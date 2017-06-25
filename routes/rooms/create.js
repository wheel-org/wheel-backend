var router = require('express').Router();
var firebase = require('../../firebase').database();
var bcrypt = require('bcryptjs');

var createID = function (callback, error) {
    var id = Math.floor(Math.random() * 1000);
    firebase.ref('rooms/' + id).once('value', function (snap) {
        var data = snap.val();
        if(data !== undefined && data !== null) {
            // Room exist, pick another room
            createId(callback, error);
        }
        else {
            callback (id);
        }
    }, error);
}

router.post('/', function(req, res, next) {
    console.log('Creating room');
    console.log(req.body);

    var query = {
        name: req.body.roomName,
        password: req.body.roomPassword
    };

    createID(function (roomid) {
        console.log(roomid);
        var hashPw = bcrypt.hashSync(query.password);
        var newRoom = {};
        newRoom[roomid] = {
            name: query.name,
            password: hashPw,
            usernames: [req.user.username],
            transactions: [],
            admin: req.user.username
        };
        console.log(newRoom);
        firebase.ref('rooms/').update(newRoom);

        // Add room to user
        var newRoomInfo = {};
        newRoomInfo[roomid] = {
            name: query.name,
            balance: 0
        };
        console.log(newRoomInfo);
        firebase.ref('users/' + req.user.username + '/rooms/').update(newRoomInfo);

        var roomObject = {
            name: query.name,
            id: roomid,
            users: [
                {
                    user: req.user.username,
                    name: req.user.name,
                    balance: 0
                }
            ],
            transactions: [],
            admin: req.user.username
        };

        res.send({
            success: true,
            data: roomObject
        });
    }, function (error) {
        next({
            code: 0,
            msg: error
        });
    });
});

module.exports = router;
