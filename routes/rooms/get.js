var router = require("express").Router();
var firebase = require("../../firebase").database();
var bcrypt = require("bcryptjs");

router.post('/', function(req, res, next) {
    console.log("Getting room");
    console.log(req.body);
    var query = {
        id: req.body.id
    };

    // Check if room with ID exists
    firebase.ref("rooms/" + query.id).once("value", function(snap) {
        var data = snap.val();
        console.log(data);
        if(data === undefined || data === null) {
            console.log('Room not found');
            return res.send({
                success: false,
                data: 6
            });
        }

        // Check if user is in room
        if(data.usernames.indexOf(req.user.username) === -1) {
            console.log('User not in room');
            return res.send({
                success: false,
                data: 4
            });
        }
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
        res.send({
            success: false,
            data: error
        });
    });
});

module.exports = router;
