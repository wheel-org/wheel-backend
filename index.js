var express    = require("express");
var app        = express();
var bodyParser = require('body-parser');
var path       = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/*', function(req, res, next) {
    console.log('GET ' + req.url);
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.post('/*', function(req, res, next) {
    console.log('POST ' + req.url);
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.use('/', require('./routes'));

app.use(express.static(__dirname + '/client'));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, './client/index.html'));
    res.sendFile(path.join(__dirname, './client/index.js'));
});

var port = process.env.PORT || 5000;
app.listen(port, function(){
  console.log("listening on:" + port);
});
