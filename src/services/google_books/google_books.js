const request = require("request-promise-native");
const { URL, URLSearchParams } = require("url");

async function get(isbn, options = {}) {
  const url = new URL("books/v1/volumes", "https://www.googleapis.com");
  url.search = new URLSearchParams({ q: `isbn:${isbn}` }).toString();
  let result;
  try {
    result = await request(url, { json: true, options });
  } catch (e) {
    throw e.body.error;
  }
  if (!result.items) return null;
  const images = result.items
    .map((item) => item.volumeInfo && item.volumeInfo.imageLinks)
    .filter((a) => !!a);
  return images.length > 0 ? images[0] : null;
}

module.exports = {
  get,
};
