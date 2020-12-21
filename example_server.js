const express = require("express");
const bookcovers = require("./src");

const port = "8080";
const app = express();

// const testIsbn = "9781570273148";
// const testIsbn2 = "0553283685";
// const isbn = "9780140285000";
// const dudIsbn = "000";

app.get("/:isbn", (req, res) => {
  const { isbn } = req.params;
  if (!isbn) {
    res.status(404).send("Empty Isbn");
    return;
  }
  bookcovers
    .withIsbn(isbn)
    .then(data => {
      res.json(data);
    })
    .catch(e => {
      res.status(500).send(e);
    });
});

app.get((err, req, res, next) => {
  res.status(500).send(err && err.message);
});

app.listen(port, () => {
  console.log(`listening to ${port}`);
});
