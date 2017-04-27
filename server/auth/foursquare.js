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

            // setting upsert = true creates the object if it doesn't exist. defaults to false.
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
                        console.log('foursquare.js / got a user!');
                        if (user._doc.swarm_checkins_total === profile._json.response.user.checkins.count) {
                            console.log('checkin total in sync. Update DB that no checkin update needed. Not urgent work');
                            var updates = {
                                checkin_update_needed: false
                            }
                            User.findOneAndUpdate(searchQuery, updates, options, function (err, user) {
                                if (err) { console.error(err); }
                                console.log('setting updates = false');
                            });
                        }
                        else if (user._doc.swarm_checkins_total === undefined || user._doc.swarm_checkins_total < profile._json.response.user.checkins.count) {
                            console.log('Need to update our checkins... Update DB with flag that update needed, and the new count');
                            let updates = {
                                checkin_update_needed: true,
                                swarm_checkins_total: 0
                            }
                            User.findOneAndUpdate(searchQuery, updates, options, function (err, user) {
                                if (err) { console.error(err); }
                                console.log('setting updates = true');
                            });
                        } else {
                            console.error('can\t compare checkins total with latest from profile.')
                        }
                        console.log('finishing up in foursquare.js.');
                        return done(null, user);
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