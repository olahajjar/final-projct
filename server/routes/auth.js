var express = require("express");
var jwt = require("jsonwebtoken");
var config = require("../config.js");
var bcrypt = require("bcrypt-nodejs");
var authRouter = express.Router();

//import models
var User = require("../models/user.js");
var adminPriv = require("../middleware/adminPriv.js");

//signup
authRouter.post("/signup", function(req, res) {
  //If the username is already taken
  //If not then add the user
  User.find({username: req.body.username}, function(err, data) {
    if(err) {
      res.status(500).send({"message": "Error", err: err});
    } else if(data.length > 0) {
      res.status(409).send({"message": "Username is taken"});
    } else {
		if(req.body.password != undefined) {
			var salt = bcrypt.genSaltSync(10);
			var hash = bcrypt.hashSync(req.body.password, salt);
			req.body.password = hash;
			console.log(req.body.password);
		} else {
			res.status(400).send({"message": "Password is required"});
		}
      var newUser = new User(req.body);
      newUser.save(function(err, data) {
        if(err) {
          res.status(500).send({"message": "Error", err: err});
        } else {
          res.status(200).send({"message": "You just signed up for an account", data: data});
        }
      });
    }
  });
});

//signin
authRouter.post("/signin", function (req, res) {
	//if someone with the username exists
	//if the password mathces
	User.findOne({
		username: req.body.username
	}, function (err, data) {
		console.log(data);
		if (err) {
			res.status(500).send({
				"message": "Error",
				err: err
			});
		} else if (data === null) {
			res.status(404).send({
				"message": "Username does not exist"
			});
		} else {
			bcrypt.compare(req.body.password, data.password, function (err, result) {
				if (result) {
					var token = jwt.sign(data.toObject(), config.secret, {
						"expiresIn": "1h"
					});
					res.status(200).send({
						"message": "Here is your token sir",
						token: token,
						priv: data.privilage
					});
				} else {
					res.status(403).send({
						"message": "Passwords did not match"
					});
				}
			});
		}
	});
});
authRouter.use(adminPriv);
authRouter.get("/", function (req, res) {
    User.find({}, function (err, data) {
        if (err) {
            res.status(500).send({
                "massege": "there are err",
                err: err
            })
        } else {
            res.status(200).send({
                "massege": "there are data",
                data: data
            })

        }
    })
})
authRouter.delete("/:id", function(req, res) {
  User.findOne({"_id": req.params.id}, function(err, data) {
    if(err) {
      res.status(500).send({"message": "Err", err: err});
    } else {
      data.remove(function(err, data) {
        if(err) {
          res.status(500).send({"message": "Err", err: err});
        } else {
          res.status(200).send({"message": "Data has been deleted", data: data});
        }
      });
    }
  })
});

module.exports = authRouter;
