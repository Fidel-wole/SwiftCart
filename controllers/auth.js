const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const {validationResult} = require('express-validator')
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
  let errormessage = req.flash('error');
  if(errormessage.length > 0){
    errormessage = errormessage[0];
  }else{
    errormessage=null
  };
  let sucessMessage = req.flash('sucess');
  if(sucessMessage.length > 0){
    sucessMessage = sucessMessage[0]
  }else{
    sucessMessage = null;
  }
  res.render("authentication/login", {
    pageTitle: "Log in",
    isAuthenticated: false,
    errorMessage: errormessage,
    sucessMessage: sucessMessage
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    return res.status(422).render("authentication/login", {
      pageTitle: "Log in",
      isAuthenticated:false,
      errorMessage:errors.array()
    });
  }
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
          // Successful login, redirect to "/shop" 
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
  crypto.randomBytes(32, (err, buffer)=>{
    if(err){
      console.log(err)
      res.redirect('/reset')
    }
    const token= buffer.toString('hex')

  const email = req.body.email;
  User.findOne({email: email}).then(user =>{
    if(!user){
      req.flash('error', 'User not found')
      return res.redirect('/reset')
    }
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000;
    return user.save();
  }).then(result =>{
    res.redirect('/')
    transporter.sendMail({
      to:email,
      from: "anon",
      subject: 'Password Reset',
      html: `<p>You requested for a password reset click here to reset <a href='http://localhost:8000/reset/${token}'>Link<a/></p>`
    })
  })
  .catch(err =>{
    console.log(err)
  })
})
}

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token; // Use req.params.token to access the token parameter.

  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      if (!user) {
        // Handle the case where no user is found with the provided token.
        return res.status(404).send('User not found');
      }

      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }

      res.render('authentication/new-password', {
        pageTitle: 'Set password',
        userId: user._id.toString(),
        errorMessage: message,
        passwordResetToken:token
      });
    })
    .catch(err => {
      console.log(err);
      // Handle other errors that may occur during database query or rendering.
      res.status(500).send('Internal Server Error');
    });
};

exports.postNewPassword = (req,res, next)=>{
  let resetUser;
  const userId = req.body.userId;
  const password = req.body.password;
  const passwordResetToken = req.body.passwordResetToken;
  User.findOne({resetToken:passwordResetToken, resetTokenExpiration: {$gt: Date.now() }, _id:userId}).then(user =>{
    resetUser = user;
    if(!user){
      req.flash('error', 'Expired Token')
    }
    return bcrypt.hash(password, 12)

  }).then(hashedPassword =>{
    resetUser.password = hashedPassword;
    resetUser.resetToken = undefined;
    resetUser.resetTokenExpiration = undefined;
    return resetUser.save();
  }).then(saved =>{
    req.flash('sucess', 'Password reset sucessfull')
    return res.status(200).redirect('/');
  }).catch(err =>{
    console.log(err);
  })
}