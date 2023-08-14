const fs = require("fs");

const path = require("path");

const pat = path.join(__dirname, "../data", "cart.json");

module.exports = class Cart {
  //fetch the previous cart
  static addProduct(id, productPrice) {
    fs.readFile(pat, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      //Analyze the cart => Find existing product
      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(pat, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, productPrice){
    fs.readFile(pat, (err, fileContent) => {
      if (err) {
       return;
      }
      const updatedCart = JSON.parse(fileContent);
      const product = updatedCart.products.find(prod => prod.id === id);
      if(!product){
        return;
      }
      const productQty = product.qty;
      updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
      updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;

      fs.writeFile(pat, JSON.stringify(updatedCart), err =>{
        if(!err){
          
        }
      })
    });
  }
  
  static getCart(cb){
    fs.readFile(pat, (err, fileContent) =>{
      const cart = JSON.parse(fileContent);
      if(err){
        cb(null);
      }
      else{
        cb(cart)
      }
    })
  }
};
