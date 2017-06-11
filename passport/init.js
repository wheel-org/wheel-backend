var firebase = require("../firebase").database();
var LocalStrategy = require("passport-local").Strategy;

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        console.log(user + " " + user.username);
        return done(null, user.username);
    });

    passport.deserializeUser(function(id, done) {
        var usernamesRef = firebase.ref("usernames/" + id);
        usernamesRef.once("value", function(snap) {
            var data = snap.val();

            if(data === undefined) {
                return done(null, false, { message: "Username not found"});
            }
            else {
                firebase.ref("users/" + id).once("value", function(snap) {
                    var name = snap.val().name;
                    var rooms = snap.val().rooms;

                    console.log("Success");
                    // Send User object
                    var userObject = {
                        username: id,
                        name: name,
                        rooms: rooms
                    };
                    console.log(id + " " + userObject);
                    return done(null, userObject);

                }, function(error) {
                    return done(error);
                });
            }
        }, function(error) {
            return done(error);
        });
    });

    require("./login")(passport);
    require("./register")(passport);
}
