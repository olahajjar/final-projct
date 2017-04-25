var express = require("express");
var apiRouter = express.Router();

//import models
var Community = require("../models/community.js");

//import middleware
var userRouter = require("../middleware/userMiddle.js");
var adminPriv = require("../middleware/adminPriv.js");
var superuserRouter = require("../middleware/superuserMiddle.js");

//apiRouter.use(adminPriv);
apiRouter.use(userRouter);
apiRouter.use(superuserRouter);
//apiRouter.get("/", function(req, res) {
//  if(req.body.privilage == "admin") {
//    Community.find({}, function(err, data) {
//      if(err) {
//        res.status(500).send({"message": "Err", err: err});
//      } else {
//        res.status(200).send({"message": "Here is the data", data: data});
//      }
//    });
//  } else {
//    Community.find({username: req.body.username}, function(err, data) {
//      if(err) {
//        res.status(500).send({"message": "Err", err: err});
//      } else {
//        res.status(200).send({"message": "Here is the data", data: data});
//      }
//    });
//  }
//});


apiRouter.get("/", function (req, res) {
    Community.find({}, function (err, data) {
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

apiRouter.post("/", function(req, res) {
  var newTodoItem = new Community(req.body);
  newTodoItem.save(function(err, data) {
    if(err) {
      res.status(500).send({"message": "Err", err: err});
    } else {
      res.status(200).send({"message": "Data has been posted", data: data});
    }
  })
});

//apiRouter.post("/:id", function(req, res) {
//    alert(req.body.comments);
//  Community.findOne({"_id": req.params.id}, function(err, data) {
//    if(err) {
//      res.status(500).send({"message": "Err", err: err});
//    } else {
//        alert(req.body.comments)
//      data.comments.push(req.body.comments);
//      data.save(function(err, data) {
//        if(err) {
//          res.status(500).send({"message": "Err", err: err});
//        } else {
//          res.status(200).send({"message": "Data has been updated", data: data});
//        }
//      })
//    }
//  })
//});

apiRouter.delete("/:id", function(req, res) {
	if(req.query.index >=0) {
		Community.findById(req.params.id, function(err, data) {
			if(err) {
				res.status(500).send({"message": "Error with db", err: err});
			} else if (data == undefined) {
				res.status(404).send({"message": "no item with id " + req.params.id});
			} else {
				data.comments.splice(req.query.index, 1); data.save(function(err, data) {
					if(err) {
						res.status(500).send({"message": "Error with db", err: err});
					} else {
						res.status(200).send({"message": "a comment was deleted"});
					}
				});
			}
		})
	} else {
		Community.findById(req.params.id, function(err, data) {
            if(err){
                res.status(500).send(err);
            } else if(data == undefined) {
                res.status(404).send({message: "no item with id " + req.params.id});
            } else {
                data.remove(function(err, data) {
                    if(err) {
                        res.status(500).send({"message": "Error with db", err: err});
                    } else {
                        res.status(200).send({message: "item deleted"});
                    }
                });
            }
        }) 
    }
});

apiRouter.put("/:id", function (req, res) {
	Community.findById(req.params.id, function (err, data) {
		if(err) {
			res.status(500).send({"message": "Error with db", err: err});
		} else {
			for(key in req.query) {
                if(key !== "comments") {
                    data[key] = req.query[key];
                }
			}
            if(req.query.comments && req.query.comments !== undefined && req.query.comments !== "") {
                data.comments.push(req.query.comments);
            }
			data.save(function(err, data) {
				if(err) {
					res.status(500).send({"message": "Error with db", err: err});
				} else {
					res.status(200).send({"message": "Success",	data: data});
				}
			});
		}
	})
});

module.exports = apiRouter;