// product model
const Product = require("../models/product");
//order model
const Order = require("../models/order");

//getting of products controller
exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        path: "/",
        pageTitle: "Shop",
        isAuthenticated: req.session.isAuthenticated || false,
      });
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
      // Handle the error appropriately, e.g., send an error response to the client
    });
};

//getting a single product controller 
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

//adding selected product to cart controller
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

//getting the cart controller
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
      
//deleting cart product controller
exports.postCartDelete = (req, res, next) => {
  const productId = req.body.productId; 
  req.user.removeCartItem(productId).then(result =>{
    res.redirect('/cart')
  }).catch(err => {
  console.log(err);
  })
    
};


//order controller
exports.postOrder = (req, res, next) =>{
  req.user.populate('cart.items.productId')
    
  .then(user =>{
    const products = user.cart.items.map(i =>{
      return {quantity:i.quantity, product: {...i.productId._doc}};
    });
    const order = new Order({
      user:{
        name: req.user.lastname,
        userId: req.user
      },
      products: products
    });
   return order.save();
  })
 .then(result =>{
  return req.user.clearCart();

  }).then(()=>{
    res.redirect('orders')
  }).catch(err =>{
    console.log(err);
  })

};

//getting order page controller
exports.getOrder = (req, res, next)=>{
  const userId = req.user;
  Order.find({'user.userId': userId}).then(orders => {
    res.render('shop/order', {
      pageTitle:'Orders',
      path:'/orders',
      orders: orders
    })
  })
  
}

exports.logout = (req, res, nect) =>{
  req.session.destroy(err =>{
    console.log(err);
    res.redirect('/')
  })
   
}