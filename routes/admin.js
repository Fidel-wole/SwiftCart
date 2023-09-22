const express = require('express');

const router = express.Router();

const productController = require('../controllers/admin');

const auth = require('../middlewares/auth')

//adding of product routes
router.get('/add-product', auth, productController.addProducts);
router.post('/add-product', productController.postProduct);

router.post('/edit-product', productController.PostEditProduct);

//get Products added by admin 
router.get('/products', auth, productController.getAddedProducts);

//editing product
router.get('/edit-product/:productId', auth, productController.editProduct);

//deleting product
router.delete('/products/:productId', auth,  productController.deleteProduct);
module.exports = router;
