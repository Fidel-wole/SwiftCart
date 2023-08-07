const Product = require('../models/product');

exports.getProducts = (req, res, next)=>{
    // res.sendFile(path.join(__dirname, '../views', 'index.ejs'));
    Product.fetchAll((products)=>{
        res.render('shop/index',{
            prods:products,
            hasProducts:products.length > 0,
            pageTitle:'Shop',
            path:'/'
           })
    });
    
};

exports.addProducts = (req, res, next)=>{
    res.render('admin/add-product',{
        pageTitle: 'add-product',
        path: '/add-product'
    })
    };

exports.postProduct = (req, res, next)=>{
     const title = req.body.title;
     const imageUrl = req.body.imageUrl;
     const price = req.body.price;
     const description = req.body.description;
    const product = new Product(title, imageUrl, price, description);
    product.save();
    console.log(product);
    res.redirect('/');
};
