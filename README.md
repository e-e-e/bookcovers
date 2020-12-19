# book-covers

A federated search API for finding image thumbnails for book covers.

Performs a combined search of _Amazon_, _Google Books_ and _Open Library_ to find thumbnails corresponding to isbn numbers.

## Install

```
npm i -g bookcovers;
```

## Example Usage

As a library within a node application:

```js
const bookcovers = require("bookcovers");

bookcovers
  .withIsbn("9781570273148")
  .then(results => ...);
```

As a cli:

```bash
bookcovers <isbn>;
# logs out book cover data in the form "<source> <size> <url>"
```

## API

#### bookcovers.withIsbn(isbn: string);

Returns a promise that resolves to an object containing urls from each of the sources.

Note: This API will only work for use inside the Node.js environment but not within browser environments.

```js
{
  amazon: {
    '1x': 'https://m.media-amazon.com/images/I/51z2HY7kn4L._AC_UY218_ML3_.jpg',
    '1.5x': 'https://m.media-amazon.com/images/I/51z2HY7kn4L._AC_UY327_FMwebp_QL65_.jpg',
    '2x': 'https://m.media-amazon.com/images/I/51z2HY7kn4L._AC_UY436_FMwebp_QL65_.jpg',
    '2.2935x':'https://m.media-amazon.com/images/I/51z2HY7kn4L._AC_UY500_FMwebp_QL65_.jpg'
  },
  google: {
    smallThumbnail: 'http://books.google.com/books/content?id=wDVV6y-8YHEC&printsec=frontcover&img=1&zoom=5&source=gbs_api',
    thumbnail: 'http://books.google.com/books/content?id=wDVV6y-8YHEC&printsec=frontcover&img=1&zoom=1&source=gbs_api'
  },
  openLibrary: {
    small: 'http://ia801606.us.archive.org/zipview.php?zip=/26/items/olcovers36/olcovers36-S.zip&file=369091-S.jpg',
    medium: 'http://ia801606.us.archive.org/zipview.php?zip=/26/items/olcovers36/olcovers36-M.zip&file=369091-M.jpg',
    large: 'http://ia801606.us.archive.org/zipview.php?zip=/26/items/olcovers36/olcovers36-L.zip&file=369091-L.jpg'
  }
}
```
