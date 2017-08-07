var express     = require("express");
var app         = express();
var compression = require("compression");
var bodyParser  = require('body-parser');
var path        = require("path");
var auth        = require('./auth');

app.use(compression());
app.use(bodyParser.json({
  limit: '500kb'
}));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/*', function(req, res, next) {
    console.log('GET ' + req.url);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    next();
});

app.post('/*', function(req, res, next) {
    console.log('POST ' + req.url);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    next();
});

app.options('/*', function(req, res, next) {
    console.log('OPTIONS ' + req.url);
    next();
});

app.use('/', require('./routes'));

app.get('/app', function (req, res, next) {
    console.log(req.originalUrl);
    res.redirect('wheel://');
});

app.get('/app*', function (req, res, next) {
    console.log(req.originalUrl);
    res.redirect('wheel:/' + req.originalUrl.slice(4));
});

app.use(express.static(__dirname + '/client'));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, './client/index.html'));
    res.sendFile(path.join(__dirname, './client/index.js'));
});

app.use(function(err, req, res, next) {
    console.log("Error:");
    console.log(err);
    res.send({
        success: false,
        data: err.code
    });
});

var port = process.env.PORT || 5000;
app.listen(port, function(){
  console.log("listening on:" + port);
});
