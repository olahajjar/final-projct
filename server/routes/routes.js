//
var mongoose        = require('mongoose');
var Profile            = require('../models/model.js');

    
var express = require("express");
var modelRouter = express.Router();

//import models
var Profile = require("../models/model.js");
var userRouter = require("../middleware/userMiddle.js");
var superuserRouter = require("../middleware/superuserMiddle.js");
var userRouter = require("../middleware/userMiddle.js");
var adminPriv = require("../middleware/adminPriv.js");
modelRouter.use(userRouter);

//modelRouter.use(adminPriv);
//modelRouter.get("/", function(req, res) {
//  if(req.body.privilage == "admin") {
//    Profile.find({}, function(err, data) {
//      if(err) {
//        res.status(500).send({"message": "Err", err: err});
//      } else {
//        res.status(200).send({"message": "Here is the data", data: data});
//      }
//    });
//  } else {
//    Profile.find({username: req.body.username}, function(err, data) {
//      if(err) {
//        res.status(500).send({"message": "Err", err: err});
//      } else {
//        res.status(200).send({"message": "Here is the data", data: data});
//      }
//    });
//  }
//});
modelRouter.get('/', function(req, res){

       
        var query = Profile.find({});
        query.exec(function(err, routes){
            if(err) {
                res.send(err);
            } else {
           
                res.json(routes);
            }
        });
    });
modelRouter.get("/", function (req, res) {
   Profile.find({}, function (err, data) {
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
modelRouter.use(superuserRouter);
modelRouter.post("/", function(req, res) {
  var newProfile = new Profile(req.body);
  newProfile.save(function(err, data) {
    if(err) {
      res.status(500).send({"message": "Err", err: err});
    } else {
      res.status(200).send({"message": "Data has been posted", data: data});
    }
  })
});

modelRouter.put("/:id", function(req, res) {
 Profile.findOne({"_id": req.params.id}, function(err, data) {
    if(err) {
      res.status(500).send({"message": "Err", err: err});
    } else {
      for(key in req.query) {
        data[key] = req.query[key];
      }
      data.save(function(err, data) {
        if(err) {
          res.status(500).send({"message": "Err", err: err});
        } else {
          res.status(200).send({"message": "Data has been updated", data: data});
        }
      })
    }
  })
});

//modelRouter.use(adminPriv);

//modelRouter.delete("/:id", function(req, res) {
// Profile.findOne({"_id": req.params.id}, function(err, data) {
//    if(err) {
//      res.status(500).send({"message": "Err", err: err});
//    } else {
//      data.remove(function(err, data) {
//        if(err) {
//          res.status(500).send({"message": "Err", err: err});
//        } else {
//          res.status(200).send({"message": "Data has been deleted", data: data});
//        }
//      });
//    }
//  })
//});
modelRouter.post('/query/', function(req, res){

      
        var lat             = req.body.latitude;
        var long            = req.body.longitude;
        var distance        = req.body.distance;
        var male            = req.body.male;
        var female          = req.body.female;
        var other           = req.body.other;
        var minAge          = req.body.minAge;
        var maxAge          = req.body.maxAge;
        var favLang         = req.body.favlang;
        var reqVerified     = req.body.reqVerified;

       
        var query = Profile.find({});

  
        if(distance){
            query = query.where('location').near({ center: {type: 'Point', coordinates: [long, lat]},

                maxDistance: distance * 1609.34, spherical: true});

        }

        if(favLang){
            query = query.where('favlang').equals(favLang);
        }
    


        query.exec(function(err, routes){
            if(err)
                res.send(err);
            else
                res.json(routes);
        });
    });
//modelRouter.delete('/routes/:objID', function(req, res){
//        var objID = req.params.objID;
//        var update = req.body;
//
//        Profile.findByIdAndRemove(objID, update, function(err, Profile){
//            if(err)
//                res.send(err);
//            else
//                res.json(req.body);
//        });
//    });


module.exports = modelRouter;