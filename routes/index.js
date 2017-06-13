var router = require("express").Router();

module.exports = function(passport) {
    router.use('/login', require('./login')(passport));
    router.use('/register', require('./register')(passport));
    router.use('/get', require('./get'));
    router.use('/delete', require('./delete'));

    router.use('/rooms', isLoggedIn, require('./rooms'));

    router.get('/auth', function(req, res, next) {
        if(req.isAuthenticated()) {
            var roomInfo = [];

            if(req.user.rooms !== undefined) {
                for(var roomid in req.user.rooms) {
                    if(req.user.rooms.hasOwnProperty(roomid)) {
                        roomInfo.push({
                            id: roomid,
                            name: req.user.rooms[roomid].name,
                            balance: req.user.rooms[roomid].balance
                        })
                    }
                }
            }
            
            res.send({
                success: true,
                data: {
                    username: req.user.username,
                    name: req.user.name,
                    rooms: roomInfo
                }
            });
        }
        else {
            res.send({
                success: false,
                data: "Not authorized"
            });
        }
    });

    router.get('/logout', function(req, res) {
        req.logout();
        console.log("Logged out");
        res.send({
            success: true,
            data: "Logged out"
        });
    });

    return router;
}

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        console.log("Authorized");
        next();
    }
    else {
        console.log("Not authorized");
        res.send({
            success: false,
            data: "Not authorized"
        });
    }
}
