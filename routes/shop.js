const express = require('express');

const router = express.Router();

const productController = require('../controllers/product');

//landing page route
router.get('/', productController.getProducts);

//product details route
router.get('/product/:productId', productController.getProduct);

//cart routes
router.post('/cart', productController.postCart);
router.get('/cart', productController.getcart);

module.exports = router;
