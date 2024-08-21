var express = require("express");
var exe = require("./../connection");
var router = express.Router();

router.get("/",function(req,res){
  res.redirect("/admin");
});
module.exports = router;