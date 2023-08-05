const express = require('express');
const router = express.Router();
router.get('/', (req, res, next)=>{
    // res.sendFile(path.join(__dirname, '../views', 'index.ejs'));
       res.render('index',{
        pageTitle:'Shop',
        path:'/'
       })
});

module.exports = router;
