const express = require("express");
const app = express();
const session = require('express-session')
const path = require("path");
 const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoute = require("./routes/auth")
const bodyparser = require("body-parser");
const errorController = require("./controllers/error");

const User = require("./models/user");

const mongoose = require('mongoose');
app.set("view engine", "ejs");
app.set("views", "views");

//middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(session({secret: 'my secret', resave:false, saveUninitialized: false}));

app.use((req, res, next)=>{
    const userId = '64ea14ea7a413987a3374689';
    User.findById(userId).then(user =>{
        req.user=user;
            
            console.log(user);
            next(); 
    }).catch(err =>{
        console.log(err);
    });
});
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoute);



app.use(errorController.get404error);

mongoose.connect('mongodb+srv://Fidel_Wole:2ql24UoUi4uN5302@cluster0.cwzz5uc.mongodb.net/shop?retryWrites=true&w=majority').then(result =>{
  User.findOne().then(user =>{if (!user){
    const user = new User({
        firstname:"Adewole",
        middlename:"Fidelis",
        lastname:"Adewoye",
        email:"adewoyeadedayo10@gmail.com",
        phone_number:"0705758871",
        password:"fidelis",
        cart:{
            items:[]
        }
       });
       user.save();
}});

app.listen(8000);
}).catch(err =>{
    console.log(err);
});