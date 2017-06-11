var router = require('express').Router();

module.exports = function(passport) {
    router.post('/', function(req, res, next) {
        passport.authenticate("login", function(err, user, info) {
            if(err) return res.send(err);
            if(!user) return res.send(info.message);
            req.logIn(user, function() {
                console.log("login success");
                res.send(user);
            });
        })(req, res, next);
    });
    /*router.post('/', passport.authenticate('login'), function(req, res, next) {
        console.log(req.isAuthenticated());
        res.send(req.user);
        console.log(res.message);
    });*/
    return router;
}
