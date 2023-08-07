const express = require('express');

const router = express.Router();

const productController = require('../controllers/product');

router.get('/', productController.getProducts);

router.get('/product/:productId', productController.getProduct);

router.post('/cart', productController.postCart);

router.get('/cart', productController.getcart);

module.exports = router;
