var mongoose = require('mongoose'),
User = require('../model/account'),
FacebookStrategy = require('passport-facebook').Strategy,
LocalStrategy = require('passport-local').Strategy;

module.exports = function (passport,fbID,fbSecret) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findOne({ _id: id }, '-salt -hashed_password', function (err, user) {
            done(err, user);
        });
    });

    passport.use(new FacebookStrategy({
        clientID: fbID,
        clientSecret: fbSecret,
        callbackURL: '/auth/facebook/callback'
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOne({
            'facebook.id': profile.id
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                user = new User({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    provider: 'facebook',
                    facebook: profile._json
                });
                user.save(function(err) {
                    if (err) console.log(err);
                    return done(err, user);
                });
            } else {
                return done(err, user);
            }
        });
    }
    ));

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {
    	console.log("local");
        User.findOne({
            email: email
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {
                    message: 'Unknown user'
                });
            }
            if (!user.authenticate(password)) {
                return done(null, false, {
                    message: 'Invalid password'
                });
            }
            return done(null, user);
        });
    }
    ));
};