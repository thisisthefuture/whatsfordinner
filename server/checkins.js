/**
 * Parse checkins.
 *
 * @param {Object|String} json
 * @return {Object}
 * @api private
 */
exports.parse = function (json) {
    console.log('parse checkings!');

    if ('string' == typeof json) {
        json = JSON.parse(json);
    }

    // get list of valid food/drinks related categories from Swarm
    var categories = require('./data/categories.js');

    var placesToEat = [];
    var citiesVisited = [];

    // an array to store the raw, unfiltered, data    
    var places = [];

    // if the passed city is NOT in citiesVisited add it.
    function buildPlaceList(place) {
      if (citiesVisited.find(function (element) {
        if (element === place.venue.location.city) {
          return element;
        }
      }) === undefined) {
        if (place.venue.location.city != undefined)
          citiesVisited.push(place.venue.location.city);
        else {
          console.log('undefined city with', place.venue.name);
        }
      }
    }

    // combining the multiple arrays of checkins into one
    // JSON data is blocked to sections of 250 entries
    for (var i = 0 ; i < json.length; i++) {
      places = places.concat(json[i].response.checkins.items);
    }

    // response format: json[ ].response.checkins.items.venue.categories[ ].name
    // new shorter format: places[ ].venue.categories[ ].name
    // console.log(places[0].venue.categories[0].name);

    // is loop cleans up the data from the JSON before we do any searches on it
    for (var i = 0; i < places.length; i++) {

      // we only look at entries with a venue. If no venue, it's not a real place we care about
      if (places[i].hasOwnProperty('venue')) {

        // check that 1. the venue.categories is in the list of valid categories before we do anything else
        //            2. the venue is not marked closed

        // How this IF statement works:
        // The IF condition is the && of two function's boolean outputs.
      
        // Function #1: What gets passed to the function is the venue 
        // category if it exists. Otherwise 'none' is passed.
        // The function returns is a bool, the output of whether the master categories list has the passed
        // function name.
        // Function #2: What gets passed to this function is the boolean "closed" value for the venue if it exists.
        // otherwise, false is passed to the function. The function simply returns what it is passed.
        // Why this silly work? Because if we wanted to evaluate the places[i].venue.closed and
        // places[i].venue.categories[0] properties directly, if they didn't exist, a error
        // would be thrown.
        if ((function(category) {
            return categories.hasOwnProperty(category.name);
          }(places[i].venue.categories[0] || 'none')) && !(function(isClosed) {
              return isClosed;
            }(places[i].venue.closed || false))
          ) {

            // Find if place is already in placesToEat by venue.name + venue.location.address
            // using the combo of the two to try and avoid consolidating multiple locations as one.
            // addressing the Sizzle Pie / Starbucks Problem: 
            // avoiding multiple visits to the same named business @ multiple locations being treated @ one place
            // e.g., Sizzle Pie in Portland (which I visited years ago and forgot about) vs. in Seattle

            // If not, let's add it and put visit count = 1. Otherwise, it exists so increment visit count.

            var ele = placesToEat.find(function (element) {
              if ((element.details.venue.name === places[i].venue.name) && (element.details.venue.location.address === places[i].venue.location.address)) {
                return element;
              }
            });

            if (ele === undefined) {
              placesToEat.push(
              {
                details: places[i],
                count: 1
              });

              // let's build our locations list, list of citys at the moment, while we're looping the array setting up
              buildPlaceList(places[i]);      
            }
            else {
              // increment the visit count
              // update the createdAt value to the most recent value
              ele.count++;
              if (ele.details.createdAt <= places[i].createdAt)
                ele.details.createdAt = places[i].createdAt;
            }
        }
      } else {
        console.log('item', i, 'missing venue property');
      }

    }
    console.log('# of unique places to eat', placesToEat.length);

    return { 'venues': placesToEat, 'locations': citiesVisited };
};