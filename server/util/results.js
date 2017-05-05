const loadCheckins = require('./loadCheckins'),
      util = require('./index.js')
    
// arrays to store our results of places & to store 
let placesToEat = [],
    placesVisited = []

function get(req, cb) {
    getHelper(req, cb);
}

function getHelper(req, cb) {
    console.log('getHelper:\n\t\t We need to load checkins');

    loadCheckins.getPlaces(req.foursquare_id, req.oauth_token, function (places) {
        placesToEat = places.venues;
        placesVisited = places.locations;
        let recent = util.printRecent(placesToEat);
        let suggestion = util.getSuggestion(placesToEat);
        cb(recent, suggestion);
    });
}

function getPlacesToEat() {
    return placesToEat
}

function getPlacesVisited() {
    return placesVisited
}

module.exports = {
    get: get,
    placesToEat: getPlacesToEat,
    placesVisited: getPlacesVisited
}