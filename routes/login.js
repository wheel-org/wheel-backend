var router = require('express').Router();
var firebase = require("../firebase").database();
var bcrypt = require("bcryptjs");

router.post('/', function(req, res, next) {
    console.log('Logging in');
    console.log(req.body);
    var query = {
        username: req.body.username,
        password: req.body.password
    };
    if(query.username === '' || query.password === '') {
        console.log('Missing credentials');
        return res.send({
            success: false,
            data: 1
        });
    }

    firebase.ref('usernames/' + query.username).once('value', function(snap) {
        var data = snap.val();

        if(data === undefined || data === null) {
            console.log('Username not found');
            return res.send({
                success: false,
                data: 2
            });
        }
        if(!bcrypt.compareSync(query.password, data.password)) {
            console.log('Incorrect password');
            return res.send({
                success: false,
                data: 2
            });
        }
        firebase.ref('users/' + query.username).once('value', function(snap) {
            var name = snap.val().name;
            var rooms = snap.val().rooms;

            var roomInfo = [];

            if(rooms !== undefined) {
                for(var roomid in rooms) {
                    if(rooms.hasOwnProperty(roomid)) {
                        roomInfo.push({
                            id: roomid,
                            name: rooms[roomid].name,
                            balance: rooms[roomid].balance
                        })
                    }
                }
            }

            console.log("Success");
            // Send User object
            var userObject = {
                username: query.username,
                name: name,
                rooms: roomInfo
            };
            res.send({
                success: true,
                data: userObject
            });
        }, function(error) {
            console.log(error);
            res.send({
                success: false,
                data: 0
            });
        });
    }, function(error) {
        console.log(error);
        res.send({
            success: false,
            data: 0
        });
    });
});

module.exports = router;
