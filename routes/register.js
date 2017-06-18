var router = require("express").Router();
var firebase = require("../firebase").database();
var bcrypt = require("bcryptjs");

router.post('/', function (req, res, next) {
    console.log("Registering user");
    console.log(req.body);
    var query = {
        username: req.body.username,
        password: req.body.password,
        name: req.body.name
    };

    firebase.ref('usernames/' + query.username).once('value', function (snap) {
        var data = snap.val();
        // User with username already exists
        if(data !== undefined && data !== null) {
            console.log('Username already taken');
            return res.send({
                success: false,
                data: 3
            });
        }

        var hashPw = bcrypt.hashSync(query.password);

        var newUsername = {};
        newUsername[query.username] = {
            password: hashPw
        };
        firebase.ref("usernames").update(newUsername);

        var newUser = {};
        newUser[query.username] = {
            name: query.name,
            rooms: []
        };
        firebase.ref("users").update(newUser);

        console.log("Success");

        res.send({
            success: true,
            data: {
                username: query.username,
                name: query.name,
                rooms: []
            }
        });
    }, function (error) {
        console.log(error);
        res.send({
            success: false,
            data: 0
        });
    });
});

module.exports = router;
