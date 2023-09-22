const express = require('express');

const router = express.Router();

const productController = require('../controllers/product');

const auth = require('../middlewares/auth')
//landing page route
router.get('/shop', auth, productController.getProducts);

//product details route
router.get('/product/:productId', auth, productController.getProduct);

//cart routes
router.post('/cart', productController.postCart);
router.get('/cart', auth, productController.getcart);
//delete cart
router.post('/cart-delete-item', productController.postCartDelete);

//order route

router.post('/order', productController.postOrder);
router.get('/orders', auth, productController.getOrder);

router.get('/orders/:orderId', auth, productController.getInvoice);
//logout

router.post('/logout', productController.logout);

module.exports = router;