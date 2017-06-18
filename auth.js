var firebase = require('./firebase').database();
var bcrypt = require("bcryptjs");

var isAuth = function (req, res, next) {
    console.log("Checking auth");
    console.log(req.body);
    if(req.body.username === null || req.body.username === '' ||
       req.body.password === null || req.body.password === '') {
       console.log('Missing credentials');
        return res.send({
            success: false,
            error: 1
        });
    }
    var query = {
        username: req.body.username,
        password: req.body.password
    };
    firebase.ref('usernames/' + query.username).once('value', function (snap) {
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

            req.user = {
                username: query.username,
                name: name,
                rooms: roomInfo
            };
            next();
        }, function(error) {
            console.log(error);
            res.send({
                success: false,
                data: 0
            });
        });
    }, function (error) {
        console.log(error);
        res.send({
            success: false,
            data: 0
        });
    });
};

module.exports = isAuth;
