const Product = require("../models/product");
const mongoDb = require('mongodb');
const ObjectId = mongoDb.ObjectId;
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
  res.render("admin/add-product", {
    pageTitle: "add-product",
    path: "/add-product",
    editing:false,
  });
};

//post request for adding  prodcts
exports.postProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const category =req.body.category;
  // const userId = req.user._id;
  const product =new Product({title:title, imageUrl:imageUrl, price:price, description:description, category: category, userId: req.user._id});
  product.save()
  .then(res.redirect('products')).catch(err =>{
    console.log(err);
  })
};

//getting added product

exports.getAddedProducts = (req, res, next)=>{
  Product.find()
  .populate('userId')
    .then((products) => {
      res.render("admin/product", {
        prods: products,
        path: "/",
        pageTitle: "Shop",
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
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

Product.findById(prodId).then(product =>{
  product.title = title;
  product.imageUrl = imageUrl;
  product.price = price;
  product.description = description;
  
 return product.save()
})
  .then(result =>{
    console.log(result);
    res.redirect('products')
  }).catch(err =>{
    console.log(err)
  })
  
}

exports.deleteProduct = (req, res, next)=>{
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId).then(() =>{res.redirect('products')}).catch(err =>{
    console.log(err);
  })

}
