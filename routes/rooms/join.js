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
        if(data === undefined || data === null) {
            console.log("Room not found");
            return res.send("Room not found");
        }
        if(!bcrypt.compareSync(query.password, data.password)) {
            console.log("Incorrect password");
            return res.send("Incorrect password");
        }

        var newUsernames = data.usernames;
        newUsernames.push(req.user.username);
        firebase.ref("rooms/" + query.id + "/users/").set(newUsernames);

        // Add room to user
        firebase.ref("users/" + req.user.username + "/rooms/" + query.id + "/").update({
            name: data.name,
            id: query.id,
            balance: 0
        });

        res.send("Success");
    });
});

module.exports = router;
