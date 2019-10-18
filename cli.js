#!/usr/bin/env node

const program = require("commander");
const bookcovers = require("./index");

program
  .arguments("<isbn>")
  .option("-t, --type <api>", "api to use, defaults to all")
  .action((isbn, options) => {
    if (!options.type) {
      bookcovers
        .withIsbn(isbn)
        .then(results => {
          for (let [source, images] of Object.entries(results)) {
            if (images === null) continue;
            for (let [qualifier, url] of Object.entries(images)) {
              if (qualifier === "error") continue;
              console.log(source, qualifier, url);
            }
          }
        })
        .catch(e => {
          console.error(e);
          process.exit(1);
        });
      return;
    }
  });

program.parse(process.argv);
