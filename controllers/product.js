const Product = require('../models/product');
const Cart = require('../models/cart');

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

exports.getProduct = (req, res, next)=>{
    const prodId = req.params.productId;
    Product.finbyId(prodId, product =>{
        console.log(product);
        res.render('shop/productDetail',{
            prods:product,
            path:'/',
            pageTitle:"Product"
        })
    });
  
}
exports.postCart = (req, res, next) =>{
  const prodId = req.body.productId;
  Product.finbyId(prodId, product =>{
    Cart.addProduct(prodId, product.price)
    res.redirect('cart')
  })
  
};
exports.getcart = (req, res, next)=>{
Cart.getCart(cart =>{
    Product.fetchAll(products => {
        const cartProducts = [];
        for (product of products){
            const cartProductData = cart.products.find(prod => prod.id === product.id)
if(cart.products.find(prod => prod.id === product.id)){
       cartProducts.push({productData:product, qty:cartProductData.qty})
}
        }
        res.render('shop/cart', {
            pageTitle:'Your Cart',
            path:'/cart',
            products: cartProducts
        });
    })
 
})

}