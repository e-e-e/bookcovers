const puppeteer = require("puppeteer");

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const amazonIsbnSearchUrl = isbn =>
  `https://www.amazon.com/gp/search/ref=sr_adv_b/?search-alias=stripbooks&unfiltered=1&field-isbn=${isbn}&sort=relevanceexprank`;

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
  await page.goto(amazonIsbnSearchUrl(isbn), {
    waitUntil: "networkidle2"
  });
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
