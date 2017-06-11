var router = require("express").Router();
var firebase = require("../../firebase").database();
var bcrypt = require("bcryptjs");

router.post('/', function(req, res, next) {
    console.log("JOINING ROOM");
    var query = {
        id: req.body.id,
        password: req.body.password
    };

    firebase.ref("rooms/" + query.id).once("value", function(snap) {
        var data = snap.val();

        // Room doesn't exist
        if(data === undefined || data === null) {
            console.log("Room not found");
            return res.send("Room not found");
        }

        // User already in room
        if(data.usernames.indexOf(req.user.username) > -1) {
            console.log("User is already in room");
            return res.send("User is already in room");
        };

        // Password incorrect
        if(!bcrypt.compareSync(query.password, data.password)) {
            console.log("Incorrect password");
            return res.send("Incorrect password");
        }

        data.usernames.push(req.user.usernames);
        firebase.ref("rooms/" + query.id + "/users/").set(data.usernames);

        // Add room to user
        firebase.ref("users/" + req.user.username + "/rooms/" + query.id + "/").update({
            name: data.name,
            id: query.id,
            balance: 0
        });

        res.send({
            success: true,
            data: data
        });
    });
});

module.exports = router;
