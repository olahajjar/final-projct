var express         = require("express");
var mongoose        = require("mongoose");
var port            = process.env.PORT || 8080;
var path= require("path");
var ejs=require("ejs");
var morgan          = require("morgan");
var bodyParser      = require("body-parser");
var methodOverride  = require("method-override");
var expressJwt = require("express-jwt");
var config = require("./config.js");
var app             = express();
var fileRouter=require("./routes/file.js")
var modelRouter=require("./routes/routes.js");
var apiRouter=require("./routes/api.js");
var authRouter = require("./routes/auth.js");
mongoose.connect("mongodb://localhost/map", function(err) {
    if (err) {
        console.log("Not connected to the database: " + err); // Log to console if unable to connect to database
    } else {
        console.log("Successfully connected to MongoDB"); // Log to console if able to connect to database
    }
});
//app.use(express.static(__dirname + '/../public'));  
//app.set("views", __dirname + "/../public/views");
//app.use('/bower_components',  express.static(__dirname + '/../bower_components')); 

app.use(express.static(path.join(__dirname + "/../public")));  
app.set("views", __dirname + "/../public/views");
app.use(express.static(path.join(__dirname + "/../node_modules/angularjs-geolocation"))); 
app.set("/angularjs-geolocation", __dirname + "/../node_modules/angularjs-geolocation");

app.engine("html",ejs.renderFile);
app.set("view engine","ejs");
app.use(morgan("dev"));                                      
app.use(bodyParser.json());                                     
app.use(bodyParser.urlencoded({extended: true}));               
app.use(bodyParser.text());                                     
app.use(bodyParser.json({ type: "application/vnd.api+json"})); 

app.use(methodOverride());
app.use("/api", expressJwt({"secret": config.secret}));
app.use("/routes", expressJwt({"secret": config.secret}));
app.use("/auth", authRouter);
app.use("/",fileRouter);
app.use("/routes",modelRouter);
app.use("/api",apiRouter );
    
app.listen(port);
console.log("App listening on port " + port);
