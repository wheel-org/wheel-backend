var router = require("express").Router();
var firebase = require("../../firebase").database();
var bcrypt = require("bcryptjs");

router.post('/', function(req, res, next) {
    console.log("CREATING ROOM");
    var query = {
        id: req.body.id,
        name: req.body.name,
        password: req.body.password
    };

    firebase.ref("rooms/" + query.id).once("value", function(snap) {
        var data = snap.val();
        if(data !== undefined && data !== null) {
            return res.send("Room ID already taken");
        }
        console.log(query);
        var hashPw = bcrypt.hashSync(query.password);
        console.log(hashPw);
        var newRoom = {};
        newRoom[query.id] = {
            name: query.name,
            password: hashPw,
            usernames: [req.user.username],
            transactions: []
        };
        firebase.ref("rooms/").update(newRoom);

        // Add room to user
        firebase.ref("users/" + req.user.username + "/rooms/" + query.id + "/").update({
            name: query.name,
            id: query.id,
            balance: 0
        });

        var roomObject = {
            name: query.name,
            usernames: [req.user.username],
            transactions: []
        };

        res.send(roomObject);
    });

});

module.exports = router;
