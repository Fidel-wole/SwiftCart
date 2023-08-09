const Product = require("../models/product");

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
  const product = new Product(null, title, imageUrl, price, description);
  product.save();
  console.log(product);
  res.redirect("/");
};

//getting added products

exports.getAddedProducts = (req, res, next)=>{
    Product.fetchAll((products)=>{
        res.render('admin/product',{
            prods:products,
            hasProducts:products.length > 0,
            pageTitle:'Products',
            path:'/'
           })
    });
}

//Controller for editig product page
exports.editProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if(!editMode){
        res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.finbyId(prodId, product =>{
        res.render('admin/add-product',{
            product: product,
            pageTitle:'Edit Product',
            path:'/edit-product',
            editing:editMode
        })
    })

};

//post request for editing product
exports.PostEditProduct = (req, res, next)=>{
  const prodId = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(prodId, title, imageUrl, price, description);
  product.save();
  res.redirect('products');
}

exports.deleteProduct = (req, res, next)=>{
  const prodId = req.body.productId;
  Product.deleteById(prodId);
  res.redirect('products')
}
