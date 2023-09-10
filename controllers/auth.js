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
      user.save().then(res.redirect("/"));
    });
};

exports.login = (req, res, next) => {
  console.log(req.session.isLoggedIn);
  res.render("authentication/login", {
    pageTitle: "Log in",
    isAuthenticated: true,
    errorMessage: req.flash('error')
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

