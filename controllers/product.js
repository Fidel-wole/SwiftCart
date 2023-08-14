const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.findAll()
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
  Product.findAll({where: {id: prodId}})
    .then((product) => {
      res.render("shop/productDetail", {
        prods: product[0],
        path: "/",
        pageTitle: product[0].title,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.finbyId(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
    res.redirect("cart");
  });
};
exports.getcart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cart.products.find((prod) => prod.id === product.id)) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render("shop/cart", {
        pageTitle: "Your Cart",
        path: "/cart",
        products: cartProducts,
      });
    });
  });
};
exports.postCartDelete = (req, res, next) => {
  const prodId = req.body.productId;
  console.log(prodId);
  Product.finbyId(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect("/cart");
  });
};
