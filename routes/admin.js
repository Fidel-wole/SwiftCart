const express = require('express');

const router = express.Router();

const productController = require('../controllers/admin');

//adding of product routes
router.get('/add-product', productController.addProducts);
router.post('/add-product', productController.postProduct);

router.post('/edit-product', productController.PostEditProduct);

//get Products added by admin 
router.get('/products', productController.getAddedProducts);

//editing product
router.get('/edit-product/:productId', productController.editProduct);

//deleting product
router.post('/delete-product', productController.deleteProduct);
module.exports = router;