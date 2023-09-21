const express = require("express");
const app = express();
const multer = require('multer')
const session = require("express-session");
const MONGODB_URI =
  "mongodb+srv://Fidel_Wole:2ql24UoUi4uN5302@cluster0.cwzz5uc.mongodb.net/shop";
const path = require("path");
const flash = require("connect-flash");
const mongoDbStore = require("connect-mongodb-session")(session);
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoute = require("./routes/auth");
const bodyparser = require("body-parser");
const errorController = require("./controllers/error");
const csrf = require('csurf');
const User = require("./models/user");

const mongoose = require("mongoose");

//store session in database
const store = new mongoDbStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

const csrfProtection = csrf();

app.set("view engine", "ejs");
app.set("views", "views");

//file upload middleware

// Define the directory path


const filestorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null,  file.fieldname + '-' + file.originalname);
  },
})

//middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use('/images', express.static(path.join(__dirname, "images")));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(multer({ storage:filestorage }).array('image', 4));
//session
app.use(
  session({ secret: "my secret", resave: false, saveUninitialized: false, store:store })
);

app.use(csrfProtection);

//in charge of logged users details
app.use((req,res, next)=>{
    if(!req.session.user){
       return  next();
    }
User.findById(req.session.user._id)
.then(user =>{
    req.user = user;
    next();
}).catch(err =>{
    console.log(err);
})
})

//errorMdessages
app.use(flash());

//csrf
app.use((req, res, next)=>{
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
next();

})


app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoute);

app.use(errorController.get404error);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(8000);
  })
  .catch((err) => {
    console.log(err);
  });
