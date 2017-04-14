var passport = require('passport');
var FoursquareStrategy = require('passport-foursquare').Strategy;

var User = require('../models/user');
var config = require('../_config');
var init = require('./init');

// define our strategy config, either from the process env var if it exists, otherwise 
// use config file
process.env.FOURSQUARE_CLIENTID = process.env.FOURSQUARE_CLIENTID || config.foursquare.clientID;
process.env.FOURSQUARE_CLIENTSECRET = process.env.FOURSQUARE_CLIENTSECRET || config.foursquare.clientSecret;
process.env.FOURSQUARE_CALLBACKURL = process.env.FOURSQUARE_CALLBACKURL || config.foursquare.callbackURL

passport.use(new FoursquareStrategy({
    clientID: process.env.FOURSQUARE_CLIENTID,
    clientSecret: process.env.FOURSQUARE_CLIENTSECRET,
    callbackURL: process.env.FOURSQUARE_CALLBACKURL
    }, function(accessToken, refreshToken, profile, done) {
    console.log('accessToken = ', accessToken);

    var searchQuery = {
        foursquare_id: profile.id
    };

    var updates = {
        name: profile.name.givenName,
        foursquare_emails: profile.emails,
        foursquare_id: profile.id,
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
            if (user) {
                if (user._doc.swarm_checkins_total === profile._json.response.user.checkins.count) {
                    var updates = {
                        checkin_update_needed: false
                    }
                    User.findOneAndUpdate(searchQuery, updates, options, function (err, user) {
                        if (err) { console.error(err); }
                        console.log('setting updates = false');
                    });
                }
                else if (user._doc.swarm_checkins_total === undefined || user._doc.swarm_checkins_total < profile._json.response.user.checkins.count) {
                    var updates = {
                        checkin_update_needed: true,
                        swarm_checkins_total: profile._json.response.user.checkins.count
                    }
                    User.findOneAndUpdate(searchQuery, updates, options, function (err, user) {
                        if (err) { console.error(err); }
                        console.log('setting updates = true');
                    });
                } else {
                    console.error('can\t compare checkins total with latest from profile.')
                }
            }
            // is the total of known check ins (in the db) < what we're seeing from the latest service call?
            // if yes, set the flag that checkins need to be updated to true; else false
           
            return done(null, user);
        }
    });
  }
));

// serialize user into the session
init();

module.exports = passport;