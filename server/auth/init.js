var passport = require('passport');
var User = require('../models/user');

module.exports = function() {

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
        // done(null, id);
    });
};