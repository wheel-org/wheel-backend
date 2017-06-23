var router = require("express").Router();
var firebase = require("../../firebase").database();

router.post('/', function(req, res, next) {
    console.log("Leaving room");
    console.log(req.body);
    var query = {
        id: req.body.id
    };

    firebase.ref("rooms/" + query.id).once("value", function(snap) {
        var data = snap.val();
        console.log(data);

        // Room doesn't exist
        if(data === undefined || data === null) {
            return next({
                code: 6,
                msg: 'Room not found'
            });
        }

        // User not in room
        if(data.usernames.indexOf(req.user.username) === -1) {
            return next({
                code: 4,
                msg: 'User is not in room'
            });
        };

        // Remove room from user
        firebase.ref('users/' + req.user.username + '/rooms/').once('value', function(snap) {
            var rooms = snap.val();

            delete rooms[query.id];

            firebase.ref('users/' + req.user.username + '/rooms/').set(rooms);
        }, function(error) {
            return next({
                code: 0,
                msg: error
            });
        });

        // Remove user from room
        var index = data.usernames.indexOf(req.user.username);
        if(index > -1) {
            data.usernames.splice(index, 1);
        }
        
        if(data.usernames.length <= 0) {
            // Delete room
            firebase.ref('rooms/' + query.id).set(null);
        }

        else {
            // Remove user's transactions from room
            for(var id in data.transactions) {
                if(data.transactions.hasOwnProperty(id)) {
                    if(data.transactions[id].username === req.user.username) {
                        delete data.transactions[id];
                    }
                }
            }

            firebase.ref('rooms/' + query.id).set(data);
        }

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
});

module.exports = router;
