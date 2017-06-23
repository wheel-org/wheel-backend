var router = require("express").Router();
var firebase = require("../../firebase").database();
var bcrypt = require("bcryptjs");

router.post('/', function(req, res, next) {
    console.log("Joining room");
    console.log(req.body);
    var query = {
        id: req.body.id,
        password: req.body.roomPassword
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

        // User already in room
        if(data.usernames.indexOf(req.user.username) > -1) {
            return next({
                code: 8,
                msg: 'User is already in room'
            });
        };

        // Password incorrect
        if(!bcrypt.compareSync(query.password, data.password)) {
            return next({
                code: 5,
                msg: 'Incorrect room password'
            });
        }

        data.usernames.push(req.user.username);
        firebase.ref("rooms/" + query.id + "/usernames/").set(data.usernames);

        // Add room to user
        firebase.ref("users/" + req.user.username + "/rooms/" + query.id + "/").update({
            name: data.name,
            balance: 0
        });

        // Get list of transactions
        var transactionData = [];
        if(data.transactions !== undefined) {
            for(var id in data.transactions) {
                if(data.transactions.hasOwnProperty(id)) {
                    data.transactions[id].id = id;
                    transactionData.push(data.transactions[id]);
                }
            }
        }

        var userData = [];
        var done = 0;
        for(var i = 0; i < data.usernames.length; ++i) {
            (function (i){
                firebase.ref('users/' + data.usernames[i]).once('value', function (snap) {
                    var balance = snap.val().rooms[query.id].balance;
                    var name = snap.val().name;

                    userData.push({
                        user: data.usernames[i],
                        name: name,
                        balance: balance
                    });
                    done++;
                    if(done >= data.usernames.length) {
                        res.send({
                            success: true,
                            data: {
                                name: data.name,
                                id: query.id,
                                users: userData,
                                transactions: transactionData,
                                admin: data.admin
                            }
                        });
                    }
                }, function (error) {
                    return next({
                        code: 0,
                        msg: error
                    });
                });
            })(i);
        }
    }, function (error) {
        next({
            code: 0,
            msg: error
        });
    });
});

module.exports = router;
