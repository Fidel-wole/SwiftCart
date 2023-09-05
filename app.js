const express = require("express");
const app = express();
const session = require("express-session");
const MONGODB_URI =
  "mongodb+srv://Fidel_Wole:2ql24UoUi4uN5302@cluster0.cwzz5uc.mongodb.net/shop";
const path = require("path");
const mongoDbStore = require("connect-mongodb-session")(session);
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoute = require("./routes/auth");
const bodyparser = require("body-parser");
const errorController = require("./controllers/error");

const User = require("./models/user");

const mongoose = require("mongoose");

const store = new mongoDbStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

//middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(
  session({ secret: "my secret", resave: false, saveUninitialized: false, store:store })
);

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

// app.use((req, res, next) => {
//   const userId = "64f1b3f7c76b1718318a2555";
//   User.findById(userId)
//     .then((user) => {
//       req.user = user;

//       console.log(user);
//       next();
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoute);

app.use(errorController.get404error);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          firstname: "Adewole",
          middlename: "Fidelis",
          lastname: "Adewoye",
          email: "adewoyeadedayo10@gmail.com",
          phone_number: "0705758871",
          password: "fidelis",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });

    app.listen(8000);
  })
  .catch((err) => {
    console.log(err);
  });
