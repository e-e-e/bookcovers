const { Isbn } = require("library-lib");
const googleBooks = require("./services/google_books/google_books");
const openLibrary = require("./services/open_library/open_library");
const amazonBooks = require("./services/amazon_books/amazon_books");

function printFailure(err) {
  return { error: err };
}

async function fetchImages(isbn) {
  const isbnData = Isbn.parse(isbn);
  const isbnVariants = isbnData.isIsbn10
    ? [isbnData.toIsbn10(), isbnData.toIsbn13()]
    : [isbnData.toIsbn13(), isbnData.toIsbn10()];
  const amazon = amazonBooks
    .get(isbnVariants[0])
    .then(res => res || amazonBooks.get(isbnVariants[1]))
    .catch(printFailure);
  const google = googleBooks
    .get(isbnVariants[0])
    .then(res => res || googleBooks.get(isbnVariants[1]))
    .catch(printFailure);
  const ol = openLibrary
    .get(isbnVariants[0])
    .then(res => res || openLibrary.get(isbnVariants[1]))
    .catch(printFailure);
  const results = await Promise.all([amazon, google, ol]);
  return {
    amazon: results[0],
    google: results[1],
    openLibrary: results[2]
  };
}

module.exports = {
  withIsbn: fetchImages
};
