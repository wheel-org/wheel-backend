var firebase = require('./firebase').database();
var bcrypt = require("bcryptjs");

var isAuth = function (req, res, next) {
    console.log("Checking auth");
    console.log(req.body);
    if(req.body.username === null || req.body.username === '' ||
       req.body.password === null || req.body.password === '') {

        return next({
            code: 1,
            msg: 'Missing credentials'
        });
    }
    var query = {
        username: req.body.username,
        password: req.body.password
    };
    firebase.ref('usernames/' + query.username).once('value', function (snap) {
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

            req.user = {
                username: query.username,
                name: name,
                rooms: roomInfo
            };
            next();
        }, function(error) {
            next({
                code: 0,
                msg: error
            });
        });
    }, function (error) {
        next({
            code: 0,
            msg: error
        });
    });
};

module.exports = isAuth;
