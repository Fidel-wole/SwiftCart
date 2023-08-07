const express = require('express');

const router = express.Router();

const productController = require('../controllers/admin');

router.get('/add-product', productController.addProducts);


router.post('/add-product', productController.postProduct)

module.exports = router;