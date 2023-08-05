const express = require('express');
const app = express();
const path = require('path');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const bodyparser = require('body-parser');
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyparser.urlencoded({ extended: false}));
app.use(adminRoutes);
app.use(shopRoutes);

app.use((req, res, next)=>{
    res.status(404).render('404',{
     pageTitle:'Page Not Found',
     path: '/'
    });
})
app.listen(3000);
