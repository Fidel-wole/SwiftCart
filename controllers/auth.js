const User = require('../models/user');

exports.authPage = (req, res, next) =>{
    res.render('authentication/signUp',{
        pageTitle: "Sign Up",
    })
}
exports.Postsignup = (req, res, next)=>{
 const firstname = req.body.firstname;
 const middlename = req.body.middlename;
 const lastname = req.body.lastname;
 const email = req.body.email;
 const phone_number = req.body.phone_number;
 const password = req.body.password;

 const user = new User(firstname, middlename, lastname, email, phone_number, password);
 user.save().then(res.redirect('/shop'))
}