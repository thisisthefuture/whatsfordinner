// using passport & the FoursquareStrategy to make GET request calls to foursquare
var passport = require('passport');
var FoursquareStrategy = require('passport-foursquare').Strategy;

// temp oauth token used to get recursion approach to querying checkins and building list
var oauth_token = "UOMC2UDVEQK11NDVENJ3PHCQJOXYUDSSNVTFZKPPGAZIOMNP"

// static request checkinURL
var checkinURL = 'https://api.foursquare.com/v2/users/self/checkins?limit=250&v=20131016&offset=';
// global offset to increment and add-on in the GET request URL
var offset = 0;

// configuration required to instantiate the foursquare strategy, so we may piggy-pack on its _oauth call
const STRATEGY_CONFIG = {
  clientID: 'FEZ41SNLALWCY2S31WJ1EDFQUUVR01SVQKBUU5F5DXY1YMVU',
  clientSecret: 'H3Q1UFJBOC1VZLAFOO3ELADDE1VS1JAPFZSXWHWJ5VBN20YP',
  callbackURL: "http://127.0.0.1:5000/auth/foursquare/callback"
};

// defining our strategy to initiate the passport object; we will use its _oauth method to get our checkins
var strategy = new FoursquareStrategy(STRATEGY_CONFIG, function(accessToken, refreshToken, profile, done) {
    console.log('accessToken = ', accessToken); // TODO: store this somewhere and have it be associated w/the user
    token = oauth_token;
    return done(null, profile);
  }
);

// making it so.
passport.use(strategy);

// helper function to print final built array for testing
function printArrayOfPlaces(list) {
  var summary = '';
  for (var i = 0 ; i < list.length; i++) {
    summary += i + ': ' + list[i].details.venue.name + '\n';
  }

  return summary;
}

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
    passport._strategies.foursquare._oauth2.get(checkinURL + offset, oauth_token, function(err, body, res) {
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
            console.log(json);

            // got more items to process, so let's increase our offset
            // and call RetrievePlacesHelper again, with our new offset, and what we've
            // got from the server so far (and have stored handily in places[])
            RetrievePlacesHelper(offset+250, places.concat(json));
        }
    });
}

// print out the checkin info we have
function displayMyStuff(places) {
    var checkins = require('./checkins').parse(places);
    summary = 'Recently visited ' + printArrayOfPlaces(checkins);
    console.log(summary);
}

// start our work
RetrievePlaces();