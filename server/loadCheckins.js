var passport = require('passport');
var User = require('./models/user');
var placesToEat = [];
var searchQuery = {};
var options = { upsert: true };

// with token, get user's check_in account
// compare collection's checkin_count with 
// what the API returns...
// if collection check_in === GET check_in, read from DB
// if colleciton check_in < GET check_in
// make GET request, then parse results raw using ./checkins
// with what ./checkins returns (an array), update db
// else... awkward...that our db have more check_in than Swarm

exports.getPlaces = function (id, token, callback) {

    searchQuery.foursquare_id = id;

    User.find(searchQuery, function (err, user) {
        if (err) return console.error(err);

        if (user.length > 1) {
            return console.error('why did we find multiple users with the same id');
        } else if (user.length === 0) {
            return console.error('didn\'t find a user with id = ', id);
        }

        if (user[0]._doc.checkin_update_needed) {
            console.log('getting from Swarm');

            // gets the whole list of checkins again.
            // should only add the most N recent....
            getCheckins(token, callback);
        } else {
            console.log('getting from database');
            var checkins = { venues: user[0]._doc.checkins, locations: user[0]._doc.locations }
            callback(checkins);
        }
    });
};

function getCheckins(token, callback) {
    var checkinURL = 'https://api.foursquare.com/v2/users/self/checkins?limit=250&v=20131016&offset=';

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
        passport._strategies.foursquare._oauth2.get(checkinURL + offset, token, function(err, body, res) {
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
                    // return done(new Error('Failed to get checkins'));
                }
        
            // if no results come back, that means we are done collecting the json responses
            // we can now convert the json response to a data structure we can use to get checkin info
            if (json.response.checkins.items == 0) {
                displayMyStuff(places);
            } else {
                // console.log(json);

                // got more items to process, so let's increase our offset
                // and call RetrievePlacesHelper again, with our new offset, and what we've
                // got from the server so far (and have stored handily in places[])
                RetrievePlacesHelper(offset+250, places.concat(json));
            }
        });
    }

    // Update database entry with checkins array
    function displayMyStuff(places) {
        placesToEat = require('./checkins').parse(places);
        User.findOneAndUpdate(searchQuery, {checkin_update_needed: false, checkins: placesToEat.venues, locations: placesToEat.locations}, options, function(err, user) {
            if(err) {
                console.error(err);
            } else {
                callback(placesToEat);
            }
        });
    }

    // start our work
    RetrievePlaces();
}