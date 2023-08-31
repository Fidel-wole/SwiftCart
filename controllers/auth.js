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

 const user = new User({firstname:firstname, middlename:middlename, lastname:lastname, email:email, phone_number:phone_number, password:password});
 user.save().then(res.redirect('/shop'))
}

exports.login = (req, res, next) =>{
    console.log(req.get('Cookie').split(';')[1].trim().split('=')[1] === 'true');
    res.render('authentication/login', {
        pageTitle: 'Log in',
    })
}

exports.postLogin = (req, res, next)=>{
    res.setHeader('Set-Cookie', 'loggedIn=true; Secure');
    res.redirect('/shop')
}