const express = require('express');

const router = express.Router();

const productController = require('../controllers/admin');

//adding of product routes
router.get('/add-product', productController.addProducts);
router.post('/add-product', productController.postProduct)

//get Products added by admin 
router.get('/products', productController.getAddedProducts);

//editing product
router.get('/edit-product/:productId', productController.editProduct);
module.exports = router;