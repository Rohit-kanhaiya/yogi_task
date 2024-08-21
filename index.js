var express = require("express");
var bodyparser = require("body-parser");
var upload = require("express-fileupload");
var session = require("express-session");
var admin_route = require("./routes/admin_routes");
var user_route=require("./routes/user_routes");
var app = express();
app.use(upload());
app.use(session({
   secret:"rohit" ,
   resave:true,
   saveUninitialized:true
}));
app.use(express.static("public/"));
app.use("/admin",admin_route)
app.use("/",user_route)


app.listen(1000);