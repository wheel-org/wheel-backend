var router = require('express').Router();
var firebase = require("../firebase").database();

function findUser(usersData, username){
    var users = [];
    for(var user in usersData) {
        if(usersData.hasOwnProperty(user)) {
            if(usersData[user].username === username){
                users.push(usersData[user]);
            }
        }
    }
    return users;
}

router.post('/', function(req, res) {
    var data = {
        username: req.body.username,
        password: req.body.password
    };

    var usersRef = firebase.ref("users");
    usersRef.on("value", function(snap) {
        var usersData = snap.val();
        var match = findUser(usersData, data.username);

        if(match.length === 0) {
            console.log("Error: username not found");
            res.send("Error: username not found");
        }
        else if(match.length !== 1) {
            console.log("Error: invalid username search");
            res.send("Error: invalid username search");
        }
        else if(match[0].password === data.password) {
            console.log("Success");
            res.send("Success");
        }
        else {
            console.log("Error: wrong password");
            res.send("Error: wrong password");
        }

    }, function(error) {
        console.log("Error: " + error.code);
        res.send("Error: " + error.code);
    });
});

module.exports = router;
