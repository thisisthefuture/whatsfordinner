var passport = require('passport');
var FoursquareStrategy = require('passport-foursquare').Strategy;

var User = require('../models/user');
var init = require('./init');

passport.use(new FoursquareStrategy({
    clientID: process.env.FOURSQUARE_CLIENTID,
    clientSecret: process.env.FOURSQUARE_CLIENTSECRET,
    callbackURL: process.env.FOURSQUARE_CALLBACKURL
    }, function(accessToken, refreshToken, profile, done) {
        // let's put this chunk of code on the call stack to be processed
        // after the stack is clear
        // Q: not sure if this code has any effect vs. the cb in User.findOneAndUpdate...
        process.nextTick(function () {
            var searchQuery = {
                foursquare_id: profile.id
            };

            var updates = {
                name: profile.name.givenName,
                foursquare_emails: profile.emails,
                foursquare_id: profile.id,
                oauth_token: accessToken
            };

            // upsert = true to create the object if it doesn't exist. Defaults to false.
            // new = true so the updated modifyed document is returned. Defaults to false.
            let options = {
                upsert: true,
                new: true
            }
            
            // check if foursquare_id exists in database, if so, return known user
            User.findOneAndUpdate(searchQuery, updates, options, function(err, user) {
                if(err) {
                    return done(err);
                } else {
                    if (user) {
                        if (user._doc.swarm_checkins_total === profile._json.response.user.checkins.count) {
                            console.log('Checkin totals in sync. Update DB that no checkin update needed.');
                            User.findOneAndUpdate(searchQuery, {checkin_update_needed: false}, options, function (err, user) {
                                if (err) { console.error(err); }
                            });
                        }
                        else if (user._doc.swarm_checkins_total === undefined || user._doc.swarm_checkins_total < profile._json.response.user.checkins.count) {
                            console.log('Need to update our checkins. Update DB with flag that update needed.');
                            let updates = {
                                checkin_update_needed: true
                            }
                            User.findOneAndUpdate(searchQuery, updates, options, function (err, user) {
                                if (err) { console.error(err); }
                            });
                        } else {
                            console.error('can\'t compare checkins total with latest from profile.')
                        }
                        return done(null, user);
                    } else {
                        console.error('Mongoose didn\'t return a user. This shouldn\'t happen if options.upsert = true')
                    }
                    // is the total of known check ins (in the db) < what we're seeing from the latest service call?
                    // if yes, set the flag that checkins need to be updated to true; else false

                }
            });
    });
  }
));

// serialize user into the session
init();

module.exports = passport;