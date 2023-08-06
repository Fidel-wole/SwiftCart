const express = require('express');

const router = express.Router();

const productController = require('../controllers/product');

router.get('/', productController.getProducts);

module.exports = router;
