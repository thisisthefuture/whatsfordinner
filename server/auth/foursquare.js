var passport = require('passport');
var FoursquareStrategy = require('passport-foursquare').Strategy;

var User = require('../models/user');
var config = require('../_config');
var init = require('./init');

passport.use(new FoursquareStrategy({
    clientID: config.foursquare.clientID,
    clientSecret: config.foursquare.clientSecret,
    callbackURL: config.foursquare.callbackURL
    }, function(accessToken, refreshToken, profile, done) {
    console.log('accessToken = ', accessToken);

    var searchQuery = {
        foursquare_id: profile.id
    };

    var updates = {
        name: profile.name.givenName,
        foursquare_emails: profile.emails,
        someID: profile.id,
        oauth_token: accessToken        
    };

    // setting upserts = true creates the object if it doesn't exist. defaults to false.
    var options = {
        upsert: true
    }
    
    // check if foursquare_id exists in database, if so, return known user
    User.findOneAndUpdate(searchQuery, updates, options, function(err, user) {
        if(err) {
            return done(err);
        } else {
            return done(null, user);
        }
    });
    // return done(null, profile);
  }
));


// serialize user into the session
init();

module.exports = passport;