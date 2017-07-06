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
        return next({
            code: 1,
            msg: 'Missing credentials'
        });
    }

    firebase.ref('usernames/' + query.username).once('value', function(snap) {
        var data = snap.val();

        if(data === undefined || data === null) {
            return next({
                code: 2,
                msg: 'Username not found'
            });
        }

        if(!bcrypt.compareSync(query.password, data.password)) {
            return next({
                code: 2,
                msg: 'Incorrect password'
            });
        }

        firebase.ref('users/' + query.username).once('value', function(snap) {
            var name = snap.val().name;
            var rooms = snap.val().rooms;
            var picture = snap.val().picture;

            if(picture === undefined) {
                picture = '';
            }

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
                rooms: roomInfo,
                picture: picture
            };
            res.send({
                success: true,
                data: userObject
            });
        }, function(error) {
            next({
                code: 0,
                msg: error
            });
        });
    }, function(error) {
        next({
            code: 0,
            msg: error
        });
    });
});

module.exports = router;
