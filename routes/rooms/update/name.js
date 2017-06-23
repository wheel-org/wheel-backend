var router = require("express").Router();
var firebase = require("../../../firebase").database();

router.post('/', function(req, res, next) {
    console.log("Updating room name");
    console.log(req.body);
    var query = {
        id: req.body.id,
        newName: req.body.newName
    };

    // Check if room with ID exists
    firebase.ref("rooms/" + query.id).once("value", function(snap) {
        var data = snap.val();
        console.log(data);
        if(data === undefined || data === null) {
            return next({
                code: 6,
                msg: 'Room not found'
            });
        }

        // Check if user is in room
        if(data.usernames.indexOf(req.user.username) === -1) {
            return next({
                code: 4,
                msg: 'User not in room'
            });
        }

        // Check if user is admin of room
        if(data.admin !== req.user.username) {
            return next({
                code: 9,
                msg: 'User not admin of room'
            });
        }

        // Change name in room
        data.name = query.newName;

        firebase.ref('rooms/' + query.id).set(data);

        // Change name in user
        firebase.ref('users/' + req.user.username + '/rooms/' + query.id + '/').once('value', function (snap) {
            var room = snap.val();
            console.log(room);
            room.name = query.newName;
            firebase.ref('users/' + req.user.username + '/rooms/' + query.id + '/').set(room);

            res.send({
                success: true,
                data: {}
            });
        }, function (error) {
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
});

module.exports = router;
