const { Isbn } = require("library-lib");
const services = {
  amazon: require("./services/amazon_books/amazon_books"),
  google: require("./services/google_books/google_books"),
  openLibrary: require("./services/open_library/open_library"),
};

function printFailure(err) {
  return { error: err };
}

async function fetchImages(isbn, options = {}) {
  const isbnData = Isbn.parse(isbn);
  const isbnVariants = isbnData.isIsbn10
    ? [isbnData.toIsbn10(), isbnData.toIsbn13()]
    : [isbnData.toIsbn13(), isbnData.toIsbn10()];
  const getWithService = (service) =>
    service
      .get(isbnVariants[0])
      .then((res) => res || service.get(isbnVariants[1]))
      .catch(printFailure);
  if (options.type) {
    return {
      [options.type]: await getWithService(services[options.type]),
    };
  }
  const results = await Promise.all(
    Object.values(services).map(getWithService)
  );
  return Object.keys(services).reduce(
    (accum, key, i) => ({
      ...accum,
      [key]: results[i],
    }),
    {}
  );
}

module.exports = {
  withIsbn: fetchImages,
};
