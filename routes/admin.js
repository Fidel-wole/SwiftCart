const express = require('express');

const router = express.Router();
const product = [];
router.get('/add-product', (req, res, next)=>{
res.render('add-product',{
    pageTitle: 'add-product',
    path: '/add-product'
})
})


router.post('/add-product', (req, res, next)=>{
    product.push({title: req.body.title});
    console.log(product);
    res.redirect('/');
})

module.exports = router;