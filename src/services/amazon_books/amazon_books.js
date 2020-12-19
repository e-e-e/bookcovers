const puppeteer = require("puppeteer");

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const amazonAdvanceSearchUrl =
  "https://www.amazon.com/Advanced-Search-Books/b?ie=UTF8&node=241582011";

function parseSrcset(srcset) {
  if (!srcset) return null;
  return srcset
    .split(", ")
    .map(d => d.split(" "))
    .reduce((p, c) => {
      if (c.length !== 2) {
        // throw new Error("Error parsing srcset.");
        return;
      }
      p[c[1]] = c[0];
      return p;
    }, {});
}

async function scrape(isbn) {
  const browser = await puppeteer.launch({
    defaultViewport: { width: 800, height: 600, deviceScaleFactor: 3 }
  });
  const page = await browser.newPage();
  await page.goto(amazonAdvanceSearchUrl, {
    waitUntil: "networkidle2"
  });
  await delay(100);
  await page.type("#field-isbn", isbn);

  await Promise.all([
    page.waitForNavigation(),
    page.click('input[name="Adv-Srch-Books-Submit"]')
  ]);
  const images = await page.$$(".s-image");
  const srcsets = [];
  if (images.length > 0) {
    for (let image of images) {
      const element = await image.asElement();
      const propertyHandle = await element.getProperty("srcset");
      const propertyValue = await propertyHandle.jsonValue();
      srcsets.push(propertyValue);
    }
  }
  await browser.close();
  const thumbs = srcsets.map(parseSrcset).filter(a => !!a);
  return thumbs.length > 0 ? thumbs[0] : null;
}

let previousRequest = Promise.resolve();
let count = 0;

async function get(isbn) {
  if (count >= 10) {
    throw new Error("Two many parallel requests for Amazon Image data");
  }
  // queue requests
  const executeFetch = () => {
    count++;
    return scrape(isbn)
      .then(data => {
        count--;
        return data;
      })
      .catch(e => {
        count--;
        throw e;
      });
  };
  previousRequest = previousRequest.then(executeFetch, executeFetch);
  const data = await previousRequest;
  return data;
}

module.exports = { get };
