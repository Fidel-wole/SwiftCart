const Product = require("../models/product");
const mongoDb = require('mongodb');
const ObjectId = mongoDb.ObjectId;
const removeProductFromUsersCart = require('../middlewares/product')
exports.getProducts = (req, res, next) => {
  // res.sendFile(path.join(__dirname, '../views', 'index.ejs'));
  Product.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      hasProducts: products.length > 0,
      pageTitle: "Shop",
      path: "/",
    });
  });
};

exports.addProducts = (req, res, next) => {
  const csrfToken = req.csrfToken();
  res.render("admin/add-product", {
    pageTitle: "add-product",
    path: "/add-product",
    editing:false,
    isAuthenticated: req.session.isLoggedIn,
    csrfToken:csrfToken,
  });
};

//post request for adding  prodcts
exports.postProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.files.map(file => file.path);;
  const price = req.body.price;
  const description = req.body.description;
  const category =req.body.category;
  // const userId = req.user._id;
  const imageUrl = image;
  console.log(imageUrl);
  const product =new Product({title:title, imageUrl:imageUrl, price:price, description:description, category: category, userId: req.user._id});
  product.save()
  .then(
    req.flash('sucess', 'Product Added Sucessfully'),
    res.redirect('products')).catch(err =>{
    console.log(err);
  })
};

//getting added product

exports.getAddedProducts = (req, res, next)=>{
  let sucessMessage = req.flash('sucess');
  if(sucessMessage.length > 0){
    sucessMessage = sucessMessage[0]
  }else{
    sucessMessage = null;
  }
  Product.find({userId: req.user._id})
  .populate('userId')
    .then((products) => {
      res.render("admin/product", {
        prods: products,
        path: "/",
        pageTitle: "Products",
        sucessMessage: sucessMessage
      });
      console.log(products);
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
      // Handle the error appropriately, e.g., send an error response to the client
    });
}

//Controller for editig product page
exports.editProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if(!editMode){
        res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId).then(
      product =>{
        res.render('admin/add-product',{
            product: product,
            pageTitle:'Edit Product',
            path:'/edit-product',
            editing:editMode
        })}
    )
    

};

//post request for editing product
exports.PostEditProduct = (req, res, next)=>{
  const prodId = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.files.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

Product.findById(prodId).then(product =>{
  product.title = title;
  product.imageUrl = imagesUrl.map((image) => image.path);
  product.price = price;
  product.description = description;
  
 return product.save()
})
  .then(result =>{
    console.log(result);
    req.flash('sucess', 'Product Edited Sucessfully')
    res.redirect('products')

  }).catch(err =>{
    console.log(err)
  })
  
}

// Delete a product and trigger cart cleanup
exports.deleteProduct = (req, res) => {
  const productId = req.params.productId; // Assuming the product ID is in the request body

  Product.findByIdAndRemove(productId)
    .then((deletedProduct) => {
      if (deletedProduct) {
        return removeProductFromUsersCart(productId);
      }
    })
    .then(() => {
      console.log('Product Deleted');
      res.status(500).json({message: 'Product deleted sucessfully'});
      // req.flash('sucess', 'Product Deleted Sucessfully')
      // res.redirect('products'); // Redirect after all promises are resolved
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Error deleting product.' });
    });
}

