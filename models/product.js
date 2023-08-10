const fs = require("fs");
const path = require("path");

const pat = path.join(__dirname, "../data", "products.json");

const Cart = require('./cart');

const getProductFile = (cb) => {
  fs.readFile(pat, (err, fileContent) => {
    if (err) {
      return cb([]);
    }
    cb(JSON.parse(fileContent));
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    getProductFile((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (prod) => prod.id === this.id
        );
        const updateProduct = [...products];
        updateProduct[existingProductIndex] = this;
        fs.writeFile(pat, JSON.stringify(updateProduct), (err) => {
          console.log(err);
        });
      } else {
        this.id = Math.random().toString();

        products.push(this);
        fs.writeFile(pat, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
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

  static deleteById(id){
    getProductFile(products => {
      const product = products.find(prod => prod.id === id); 
      const updatedproducts = products.filter(prod => prod.id !== id);
    
      fs.writeFile(pat, JSON.stringify(updatedproducts), err =>{
        if(!err){
Cart.deleteProduct(id, product.price);
        }
      })
      
    });
  }
};
