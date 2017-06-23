var router = require("express").Router();
var firebase = require("../../../firebase").database();
var bcrypt = require('bcryptjs');

router.post('/', function(req, res, next) {
    console.log("Updating room password");
    console.log(req.body);
    var query = {
        id: req.body.id,
        oldPass: req.body.oldPassword,
        newPass: req.body.newPassword
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

        // Check if user is admin of room
        if(data.admin !== req.user.username) {
            return next({
                code: 9,
                msg: 'User not admin of room'
            });
        }

        // Check old password
        if(!bcrypt.compareSync(query.oldPass, data.password)) {
            return next({
                code: 5,
                msg: 'Incorrect room password'
            });
        }

        // Change password
        data.password = bcrypt.hashSync(query.newPass);

        firebase.ref('rooms/' + query.id).set(data);

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
