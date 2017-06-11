var router = require("express").Router();

module.exports = function(passport) {
    router.use('/login', require('./login')(passport));
    router.use('/register', require('./register')(passport));
    router.use('/get', require('./get'));
    router.use('/add', require('./post'));
    router.use('/delete', require('./delete'));

    router.use('/rooms', isLoggedIn, require('./rooms'));

    router.get('/auth', function(req, res, next) {
        if(req.isAuthenticated()) {
            res.send("yes: " + req.user.username);
        }
        else {
            res.send("no");
        }
    });

    router.get('/logout', function(req, res) {
        req.logout();
        console.log("Logged out");
        res.send("Logged out");
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
        res.send("Not authorized");
    }
}
