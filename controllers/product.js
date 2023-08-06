const Product = require('../models/product');

exports.getProducts = (req, res, next)=>{
    // res.sendFile(path.join(__dirname, '../views', 'index.ejs'));
    const product = Product.fetchAll((products)=>{
        res.render('index',{
            pageTitle:'Shop',
            path:'/'
           })
    });
    
};

exports.addProducts = (req, res, next)=>{
    res.render('add-product',{
        pageTitle: 'add-product',
        path: '/add-product'
    })
    };

exports.postProduct = (req, res, next)=>{
    const product = new Product(req.body.title);
    product.save();
    console.log(product);
    res.redirect('/');
};