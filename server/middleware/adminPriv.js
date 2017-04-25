var express = require("express");
var jwt = require("jsonwebtoken");
var config = require("../config.js");
var adminRouter = express.Router();

adminRouter.use(function(req, res, next) {
  if(req.body.privilage == "admin") {
    next();
  } else {
    res.status(403).send({"message": "Must be admin"});
  }
});

module.exports = adminRouter;
