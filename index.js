const googleBooks = require("./services/google_books/google_books");
const openLibrary = require("./services/open_library/open_library");
const amazonBooks = require("./services/amazon_books/amazon_books");

function printFailure(err) {
  return { error: err };
}

async function fetchImages(isbn) {
  const results = await Promise.all([
    amazonBooks.get(isbn).catch(printFailure),
    googleBooks.get(isbn).catch(printFailure),
    openLibrary.get(isbn).catch(printFailure)
  ]);
  return {
    amazon: results[0],
    google: results[1],
    openLibrary: results[2]
  };
}

module.exports = {
  withIsbn: fetchImages
};
