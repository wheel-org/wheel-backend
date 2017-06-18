var router = require("express").Router();
var firebase = require("../../firebase").database();
var bcrypt = require("bcryptjs");

router.post('/', function(req, res, next) {
    console.log("Joining room");
    console.log(req.body);
    var query = {
        id: req.body.id,
        password: req.body.roomPassword
    };

    firebase.ref("rooms/" + query.id).once("value", function(snap) {
        var data = snap.val();

        // Room doesn't exist
        if(data === undefined || data === null) {
            console.log('Room not found');
            return res.send({
                success: false,
                data: 6
            });
        }

        // User already in room
        if(data.usernames.indexOf(req.user.username) > -1) {
            console.log('User is already in room');
            return res.send({
                success: false,
                data: 8
            });
        };

        // Password incorrect
        if(!bcrypt.compareSync(query.password, data.password)) {
            console.log('Incorrect password');
            return res.send({
                success: false,
                data: 5
            });
        }

        data.usernames.push(req.user.username);
        firebase.ref("rooms/" + query.id + "/usernames/").set(data.usernames);

        // Add room to user
        firebase.ref("users/" + req.user.username + "/rooms/" + query.id + "/").update({
            name: data.name,
            balance: 0
        });

        res.send({
            success: true,
            data: {
                name: data.name,
                id: data.id,
                users: data.usernames,
                transactions: data.transactions
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
