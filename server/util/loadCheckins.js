const passport = require('passport'),
    User = require('../models/user'),
    moment = require('moment'),
    options = {
        upsert: true
    };

let searchQuery = {};

// with token, get user's check_in account
// only update database's checkin if
// 1. flag for update = true
// 2. we last updated checkins at least 10 days ago
// 3. AND we know the total # of checkins from Swarm > what we last saw

// then parse results raw using ./checkins
// with what ./checkins returns (an array), update db
// else... awkward...that our db have more check_in than Swarm

exports.getPlaces = function (id, token, callback) {
    findUser(id, function (user) {
        console.log('Getting places')
        if (user[0]._doc.checkin_update_needed || (moment(user[0]._doc.swarm_slurp_date) < moment().subtract(10, 'days'))) {
            getCheckinTotal(token, function (total) {
                if (total !== user[0]._doc.swarm_checkins_total) {
                    console.log('\t\t totals differ! Getting update from Swarm');

                    // gets the whole list of checkins.
                    getCheckins(token, callback)
                } else {
                    console.log('no update needed.')
                    const checkins = {
                        venues: user[0]._doc.checkins,
                        locations: user[0]._doc.locations
                    }
                    callback(checkins);
                }
            })
        } else {
            console.log('\t\t getting from database');
            const checkins = {
                venues: user[0]._doc.checkins,
                locations: user[0]._doc.locations
            }
            callback(checkins);
        }
    });
};

exports.updateCheckins = function (id, token, callback) {
    searchQuery.foursquare_id = id
    findUser(id, function (user) {
        User.findOneAndUpdate(searchQuery, {
            checkin_update_needed: true
        }, options, function (err, user) {
            if (err) {
                console.error(err);
            } else {
                // call some function that will compare and then call out to swarm if needed
            }
        });

    })
}

function findUser(id, callback) {
    searchQuery.foursquare_id = id;
    User.find(searchQuery, function (err, user) {
        if (err) return console.error(err);

        if (user.length > 1) {
            return console.error('why did we find multiple users with the same id');
        } else if (user.length === 0) {
            // This should never happen if we're looking at the right id.
            // In foursquare.js we do User.findOneAndUpdate with upsert = true so
            // a new user gets added to the db, if they don't already exist
            return console.error('Unexpected:\tdidn\'t find a user with id = ', id);
        }
        console.log('Found a user')
        callback(user)
    });
}

function getCheckinTotal(token, callback) {
    let profileURL = 'https://api.foursquare.com/v2/users/self?&v=20131016';
    passport._strategies.foursquare._oauth2.get(profileURL, token, function (err, body, res) {
        console.log('GET request for profile data')
        let json;

        if (err) {
            if (err.data) {
                try {
                    json = JSON.parse(err.data);
                } catch (_) {}
            }
        }
        try {
            json = JSON.parse(body);
        } catch (ex) {
            console.error('Failed to get checkin total')
        }

        callback(json.response.user.checkins.count)

    })
}

function getCheckins(token, callback) {
    let checkinURL = 'https://api.foursquare.com/v2/users/self/checkins?limit=250&v=20131016&offset=';
    let count = 0;

    // defining our RetrievePlaces method to kick-off our recurrsion RetrievePlacesHelper()
    function RetrievePlaces() {
        // passing our initial offset, and an empty array which will store the GET's json result
        RetrievePlacesHelper(0, []);
    }

    // accepts  offset, and our places array that stores the GET's json result
    function RetrievePlacesHelper(offset, places) {
        // calling our get request
        // passing our checkin URL with offset, token, and callback function to process
        // the result of our GET request
        passport._strategies.foursquare._oauth2.get(checkinURL + offset, token, function (err, body, res) {
            console.log('GET request\t', ++count);
            var json;

            if (err) {
                if (err.data) {
                    try {
                        json = JSON.parse(err.data);
                    } catch (_) {}
                }
            }
            try {
                json = JSON.parse(body);
            } catch (ex) {
                console.error('Failed to get checkins')
                // return done(new Error('Failed to get checkins'));
            }

            // if no results come back, that means we are done collecting the json responses
            // we can now convert the json response to a data structure we can use to get checkin info
            if (json.response.checkins.items.length === 0) {
                parseAndUpdate(places, json.response.checkins.count);
            } else {
                // got more items to process, so let's increase our offset
                // and call RetrievePlacesHelper again, with our new offset, and what we've
                // got from the server so far (and have stored handily in places[])
                RetrievePlacesHelper(offset + 250, places.concat(json));
            }
        });
    }

    // Update database entry with checkins array
    function parseAndUpdate(places, totalSwarmCheckins) {
        let placesToEat = require('./checkins').parse(places);

        User.findOneAndUpdate(searchQuery, {
            swarm_checkins_total: totalSwarmCheckins,
            checkin_update_needed: false,
            swarm_slurp_date: moment(),
            checkins: placesToEat.venues,
            locations: placesToEat.locations
        }, options, function (err, user) {
            if (err) {
                console.error(err);
            } else {
                console.log('updating the user in the db')
                callback(placesToEat);
            }
        });
    }

    // start our work
    RetrievePlaces();
}