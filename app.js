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

app.use(logfmt.requestLogger());
app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname+'/views');
app.use(bodyParser());
// app.use(bodyParser.json());
app.use(methodoverride());
app.use(cookieParser('algodificil'));
app.use(session({
	secret: 'algodificil'
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




