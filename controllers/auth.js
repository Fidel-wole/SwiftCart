const User = require("../models/user");
const bcrypt = require("bcryptjs");
exports.authPage = (req, res, next) => {
  res.render("authentication/signUp", {
    pageTitle: "Sign Up",
    isAuthenticated:true,
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
        res.redirect("/signup");
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
      user.save().then(res.redirect("/shop", {isAuthenticated:true,}));
    });
};

exports.login = (req, res, next) => {
  console.log(req.session.isLoggedIn);
  res.render("authentication/login", {
    pageTitle: "Log in",
    isAuthenticated: true,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({email:email})
  .then((user) => {
    if(!user){
      res.redirect('/');
    }
    bcrypt.compare(password, user.password).then(doMatch =>{
      if(!doMatch){
        res.redirect('/');
      }
      req.session.isAuthenticated = true;
      req.session.isLoggedIn = true;
      req.session.user = user;
      return req.session.save(err =>{
console.log(err);
res.redirect("/shop");
      })
    
    }).catch(err =>{
      console.log(err)
    })

  });
};
