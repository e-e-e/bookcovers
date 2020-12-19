const request = require("request-promise-native");
const { URL } = require("url");

const openLibraryBaseUrl = "http://covers.openlibrary.org";
const getEndpoint = (isbn, size) => `/b/isbn/${isbn}-${size}.jpg`;

async function get(isbn) {
  const url = new URL(getEndpoint(isbn, "S"), openLibraryBaseUrl);
  url.search = "?default=false";
  try {
    await request({ uri: url.toString(), followRedirect: false });
  } catch (e) {
    switch (e.statusCode) {
      case 302:
        const imageUrl = e.response.headers.location;
        return {
          small: imageUrl,
          medium: imageUrl.replace(/-S\./g, "-M."),
          large: imageUrl.replace(/-S\./g, "-L.")
        };
      case 404:
        return null;
      default:
        throw e;
    }
  }
  return null;
}
module.exports = {
  get
};
