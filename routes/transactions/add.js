var router = require("express").Router();
var firebase = require("../../firebase").database();
var bcrypt = require("bcryptjs");

router.post('/', function(req, res, next) {
    console.log("Adding transaction");
    console.log(req.body);
    var query = {
        id: req.body.id,
        amount: req.body.amount,
        desc: req.body.desc
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

        // Add transaction to room

        var newTransaction = {
            username: req.user.username,
            amount: query.amount,
            desc: query.desc,
            date: Date.now()
        };
        console.log(newTransaction);
        firebase.ref("rooms/" + query.id + "/transactions/").push(newTransaction);

        // Add to balance of user

        firebase.ref("users/" + req.user.username + "/rooms/" + query.id + "/balance/").once("value", function(snap) {
            var userBalance = snap.val();

            userBalance = parseInt(userBalance) + parseInt(query.amount);

            firebase.ref("users/" + req.user.username + "/rooms/" + query.id + "/balance/").set(userBalance);

            res.send({
                success: true,
                data: newTransaction
            });
        });
    });
});

module.exports = router;
