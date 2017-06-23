var router = require("express").Router();
var firebase = require("../../firebase").database();

router.post('/', function(req, res, next) {
    console.log("Deleting transaction");
    console.log(req.body);
    var query = {
        roomid: req.body.roomid,
        transid: req.body.transid
    };

    // Check if room with ID exists
    firebase.ref("rooms/" + query.roomid).once("value", function(snap) {
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

        // Check if transaction is in room

        if(data.transactions[query.transid] === undefined) {
            return next({
                code: 8,
                msg: 'Transaction not found'
            });
        }

        // Check if user made transaction

        var transaction = data.transactions[query.transid];
        if(transaction.username !== req.user.username) {
            return next({
                code: 8,
                msg: 'Transaction not made by user'
            });
        }
        console.log(transaction);

        // Remove transaction from room

        delete data.transactions[query.transid];
        firebase.ref('rooms/' + query.roomid + '/transactions/').set(data.transactions);

        // Remove transaction balance from user

        firebase.ref('users/' + req.user.username + "/rooms/" + query.roomid + "/balance/").once('value', function(snap) {
            var userBalance = snap.val();

            userBalance = parseInt(userBalance) - parseInt(transaction.amount);

            firebase.ref('users/' + req.user.username + '/rooms/' + query.roomid + '/balance/').set(userBalance);

            res.send({
                success: true,
                data: {}
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
