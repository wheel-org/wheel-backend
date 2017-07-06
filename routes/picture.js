var router = require('express').Router();
var firebase = require("../firebase").database();
var bcrypt = require("bcryptjs");

router.post('/', function(req, res, next) {
    console.log('Setting profile picture');
    console.log(req.body);
    var query = {
        picture: req.body.picture
    };

    firebase.ref('users/' + req.user.username + '/picture/').set(query.picture);

    res.send({
        success: true,
        data: {}
    });
});

module.exports = router;
