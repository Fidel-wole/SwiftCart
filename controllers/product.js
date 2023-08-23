const Product = require("../models/product");
const Cart = require("../models/cart");
const user = require("../models/user");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        path: "/",
        pageTitle: "Shop",
      });
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
      // Handle the error appropriately, e.g., send an error response to the client
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/productDetail", {
        prods: product,
        path: "/",
        pageTitle: product.title    
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId).then(product =>{
    return req.user.addToCart(product)})
    .then(result =>{
      console.log(result);
      res.redirect('/shop');
    })
  .catch(err =>{
    console.log(err);
  })
};
exports.getcart = (req, res, next) => {
      req.user.populate('cart.items.productId')
      
      .then(user =>{
        const products = user.cart.items;
        console.log(user.cart.items);
        res.render("shop/cart", {
          pageTitle: "Your Cart",
          path: "/cart",
          products: products
        });
      })
      }
      

exports.postCartDelete = (req, res, next) => {
  const prodId = req.body.productId;
  console.log(prodId);
  Product.finbyId(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect("/cart");
  });
};
