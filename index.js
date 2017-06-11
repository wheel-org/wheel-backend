var express     = require("express");
var app         = express();
var compression = require("compression");
var bodyParser  = require('body-parser');
var path        = require("path");

var expressSession = require("express-session");
var firebase = require("./firebase");
var FirebaseStore = require('connect-session-firebase')(expressSession);
var passport = require("passport");

app.use(expressSession({
    secret: "dankmemes",
    resave: true,
    saveUninitialized: true,
    store: new FirebaseStore({
        database: firebase.database()
    })
}));
require("./passport/init")(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/*', function(req, res, next) {
    console.log('GET ' + req.url);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.post('/*', function(req, res, next) {
    console.log('POST ' + req.url);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.options('/*', function(req, res, next) {
    console.log('OPTIONS ' + req.url);
    next();
});

app.use('/', require('./routes')(passport));

app.use(express.static(__dirname + '/client'));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, './client/index.html'));
    res.sendFile(path.join(__dirname, './client/index.js'));
});

app.use(function(err, req, res, next) {
    console.log(err);
    res.send("Error: " + err.message);
});

var port = process.env.PORT || 5000;
app.listen(port, function(){
  console.log("listening on:" + port);
});
