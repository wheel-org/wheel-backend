var firebase = require("../firebase").database();
var LocalStrategy = require("passport-local").Strategy;
var bcrypt = require("bcryptjs");

module.exports = function(passport) {
    passport.use("register", new LocalStrategy({
            passReqToCallback: true
        },
        function(req, username, password, done) {
            var name = req.body.name;

            console.log("Registering: " + username + ", " + password + ", " + name);

            firebase.ref("usernames/" + username).once("value", function(snap) {
                var data = snap.val();

                // User with username already exists
                if(data !== undefined && data !== null) {
                    return done(null, false, {message: "Username already taken"});
                }

                var hashPw = bcrypt.hashSync(password);

                var newUsername = {};
                newUsername[username] = {
                    password: hashPw
                };
                firebase.ref("usernames").update(newUsername);

                var newUser = {};
                newUser[username] = {
                    name: name,
                    rooms: []
                };
                firebase.ref("users").update(newUser);

                console.log("Success");

                // Send User object
                return done(null, {
                    username: username,
                    name: name,
                    rooms: []
                });
            }, function(error) {
                return done(error);
            });
        }
    ));
}
