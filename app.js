// app.js
var express = require("express");
var logfmt = require("logfmt");
var cons = require('consolidate');
var app = express();
var bodyParser = require("body-parser");
var routes = require('./routes');

var cookieParser = require('cookie-parser');
var session = require('express-session');
var methodoverride = require('method-override');
var validator = require("validator");
var crypto = require('crypto');
var uuid = require('node-uuid');

app.use(logfmt.requestLogger());
app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname+'/views');
app.use(bodyParser());
// app.use(bodyParser.json());
app.use(methodoverride());
app.use(cookieParser('algodificil'));


// var generate_key = function() {
//     var sha = crypto.createHash('sha256');
//     sha.update(Math.random().toString());
//     return sha.digest('hex');
// };
// const uui = uuid.v4();

app.use(session({
	genid: function(req) {
    return uuid.v4(); // use UUIDs for session IDs
  },
	secret: 'algodificil',
	duration: 30 * 60 * 1000,
  	activeDuration: 5 * 60 * 1000,
  	ephemeral: true
}));

app.use(function(req, res, next) {
	if (req.session.user != null) {
		//req.session.user.locura = moment(req.session.user.alta).format("YYYY-MM-DD HH:MM");
		app.locals.user = req.session.user;
		//console.log(req.session.user);
	}
	next();
});

app.use(express.static(__dirname+'/public'));

routes(app);

var port = Number(process.env.PORT || 5000);
//port = 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});




