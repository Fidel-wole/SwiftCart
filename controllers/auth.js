const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.mailosaur.net',
  port: 587,
  secure: false, 
  auth: {
    user: 'y1dtpak9@mailosaur.net',
    pass: 'GqFCpX5wrWFlIhE6MpZYz2RcHFvpmZc5', 
  },
});


exports.authPage = (req, res, next) => {
  let message = req.flash('error');
  if(message.length > 0){
    message = message[0];
  }else{
    message=null
  }
  res.render("authentication/signUp", {
    pageTitle: "Sign Up",
    isAuthenticated:true,
    errorMessage:message
  });
};
exports.Postsignup = (req, res, next) => {
  const firstname = req.body.firstname;
  const middlename = req.body.middlename;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const phone_number = req.body.phone_number;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((exist) => {
      if (exist) {
        //if Useer exist
    
        transporter.sendMail({
          to:email,
          from: "anon@shop.com",
          subject: 'Signup sattempt made',
          html: '<h1>Welcome to Anon Mart we are glad to have you on board</h2>'
        })   
        req.flash('error', 'User with email or phone number already exist');
        res.status(401).redirect('/signup');   
      }
      return bcrypt.hash(password, 12);
    })
    .then((hashpassword) => {
      const user = new User({
        firstname: firstname,
        middlename: middlename,
        lastname: lastname,
        email: email,
        phone_number: phone_number,
        password: hashpassword,
        cart:{items:[]}
      });
      user.save().then(result =>{
        res.redirect("/")
        transporter.sendMail({
          to:email,
          from: "box-increase@y1dtpak9.mailosaur.net",
          subject: 'Signup succeeded',
          html: '<h1>Welcome to Anon Mart we are glad to have you on board</h2>'
        })
       }).catch(err =>{
        console.log(err);
       });
    });
};

exports.login = (req, res, next) => {
  console.log(req.session.isLoggedIn);
  let message = req.flash('error');
  if(message.length > 0){
    message = message[0];
  }else{
    message=null
  }
  res.render("authentication/login", {
    pageTitle: "Log in",
    isAuthenticated: true,
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        // User not found, set an error message
        req.flash('error', 'User not found');
        return res.status(401).redirect('/');
      }
      bcrypt.compare(password, user.password).then((doMatch) => {
        if (!doMatch) {
          // Incorrect password, set an error message
          req.flash('error', 'Incorrect password');
          return res.status(401).redirect('/');
        }
        req.session.isAuthenticated = true;
        req.session.isLoggedIn = true;
        req.session.user = user;
        return req.session.save((err) => {
          if (err) {
            console.log(err);
          }
          // Successful login, redirect to "/shop" or any other desired route
          res.redirect("/shop");
        });
      }).catch((err) => {
        console.log(err);
        // Handle bcrypt error if needed
      });
    })
    .catch((err) => {
      console.log(err);
      // Handle database error if needed
    });
};

exports.getResetPassword = (req, res, next)=>{
  let message = req.flash('error');
  if(message.length > 0){
    message = message[0];
  }else{
    message=null
  }

  res.render('authentication/resetPassword', {
    pageTitle: 'reset password',
    path:'/reset',
    errorMessage: message
  })
}

exports.postResetPassword = (req, res, next)=>{
  User.findOne({email: req.body.email}).then(result =>{
    console.log(email);
  }).catch(err =>{
    console.log(err)
  })
}

//