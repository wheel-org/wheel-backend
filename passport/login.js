var firebase = require("../firebase").database();
var LocalStrategy = require("passport-local").Strategy;
var bcrypt = require("bcryptjs");

module.exports = function(passport) {
    passport.use("login", new LocalStrategy({
            passReqToCallback: true
        },
        function(req, username, password, done) {
            console.log("Logging in: " + username + ", " + password);
            
            firebase.ref("usernames/" + username).once("value", function(snap) {
                var data = snap.val();
                if(data === undefined || data === null) {
                    console.log("Username not found");
                    return done(null, false, {message: "Username not found"});
                }
                else if(!bcrypt.compareSync(password, data.password)) {
                    console.log("Incorrect password");
                    return done(null, false, {message: "Incorrect password"});
                }
                else {
                    firebase.ref("users/" + username).once("value", function(snap) {
                        var name = snap.val().name;
                        var rooms = snap.val().rooms;
                        if(rooms === undefined) rooms = []; //empty room array

                        console.log("Success");
                        // Send User object
                        var userObject = {
                            username: username,
                            name: name,
                            rooms: rooms
                        };
                        return done(null, userObject);

                    }, function(error) {
                        console.log(error);
                        return done(error);
                    });
                }
            }, function(error) {
                console.log(error);
                return done(error);
            });
        }
    ));
}
