//Dependencies
//set up express server
var express = require("express");
var port = process.env.PORT || 3000;
var app = express();

//set up other npm
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
//session ensures one client-server connection and encrypted. 
var session = require('express-session');
var passport = require("passport");
var flash = require('connect-flash');
var db = require ('./models');
var path = require('path');

SALT_WORK_FACTOR = 10;

//middleware used for development
// Serve static content for the app from the "views" directory in the application directory.
app.use(express.static('public'));
app.set(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/JS'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'keep it safe',
				  saveUninitialized: true,
				  resave: true }));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.engine('html', require('ejs').renderFile);
app.set("view engine", "handlebars", "html");

//for player Stats
app.engine("handlebars", exphbs({ defaultLayout: "playerstatstemplate" }));
app.set("view engine", "handlebars", "html");


// Import routes and give the server access to them.
require("./config/passport")(passport);
require('./controllers/login.js')(app, passport);
require('./controllers/model_controller')(app);

//syncing our sequelize models and then starting express app
db.sequelize.sync().then(function(){
	app.listen(port);
	console.log("running" + port);
});