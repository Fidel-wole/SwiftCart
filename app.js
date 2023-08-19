const express = require("express");
const app = express();
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

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyparser.urlencoded({ extended: false }));
app.use(adminRoutes);
app.use(shopRoutes);
app.use(authRoute);

app.use((req, res, next)=>{
    const userId = '64dfb65cec09f4225f193043';
    User.findById(userId).then(user =>{
        if (user) {
            req.user = new User(user.firstname, user.middlename, user.lastname, user.email, user.phone_number, user.password, user.cart, user._id)
            console.log(userId);
            
        } else {
            console.log('User not found');
            next(); // Proceed to the next middleware
        }
         
    }).catch(err =>{
        console.log(err);
    });
});

app.use(errorController.get404error);

mongoose.connect('mongodb+srv://Fidel_Wole:2ql24UoUi4uN5302@cluster0.cwzz5uc.mongodb.net/shop?retryWrites=true&w=majority').then(result =>{
  User.findOne().then(user =>{if (!user){
    const user = new User({
        firstname:"Adewole",
        middlename:"Fidelis",
        lastname:"Adewoye",
        email:"adewoyeadedayo10@gmail.com",
        phone_numer:"0705758871",
        password:"fidelis",
        cart:{
            items:[]
        }
       });
       user.save();
}});

app.listen(3000);
}).catch(err =>{
    console.log(err);
});