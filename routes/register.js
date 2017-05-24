var router = require("express").Router();
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
        password: req.body.password,
        name: req.body.name
    };

    var usersRef = firebase.ref("/users");
    usersRef.once("value", function(snap) {
        var usersData = snap.val();

        var match = findUser(usersData, data.username);
        if(match.length > 0) {
            console.log("Error: username already taken");
            res.send("Error: username already taken");
        }
        else {
            firebase.ref("/users").push(data);
            console.log("Success");
            res.send("Success");
        }

    }, function(error) {
        console.log("Error: " + error.code);
        res.send("Error: " + error.code);
        //req.send error
    });
})

module.exports = router;
