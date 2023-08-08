const fs = require("fs");
const path = require("path");

const pat = path.join(__dirname, "../data", "products.json");

const getProductFile = (cb) => {
  fs.readFile(pat, (err, fileContent) => {
    if (err) {
      return cb([]);
    }
    cb(JSON.parse(fileContent));
  });
};

module.exports = class Product {
  constructor(title, imageUrl, price, description) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    this.id = Math.random().toString();
    getProductFile((products) => {
      products.push(this);
      fs.writeFile(pat, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    getProductFile(cb);
  }

  static finbyId(id, cb) {
    getProductFile((products) => {
      const product = products.find((pat) => pat.id === id);
      cb(product);
    });
  }
};
