const express = require("express");
const app = express();
const path = require("path");
 const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const bodyparser = require("body-parser");
const errorController = require("./controllers/error");
const mongoConnect = require('./util/database');

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyparser.urlencoded({ extended: false }));
app.use(adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404error);

mongoConnect.mongoConnect(() =>{
   
    app.listen(3000);
});