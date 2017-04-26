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

    // var placesToEat = [];
    var citiesVisited = [];

    // if the passed city is NOT already in citiesVisited add it.
    function buildPlaceList(place) {
      if (citiesVisited.find((element) => {
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

    // flattening array.
    // original JSON data is blocked to sections of 250 entries
    let places = json.reduce((output, blob) => output.concat(blob.response.checkins.items), [])

    // response format: json[ ].response.checkins.items.venue.categories[ ].name
    // new shorter format: places[ ].venue.categories[ ].name

    // Clean up the data from the JSON before we do any searches on it
    // Filter to array which has
    // 1. venue property
    // 2. valid category
    // 3. not closed
    // then reduce to array where each item is either
    // 1. added it to the list of placesToEat, if it's new, or
    // 2. has its visit count incremented if it's already known

    let placesToEat = []
    placesToEat = places
      .filter(place => {
        let venue = place.hasOwnProperty('venue') || false;
        let validCategory = false;
        let isClosed = false;

        if (venue) {            
          let category = place.venue.categories[0] || 'none'
          validCategory = categories.hasOwnProperty(category.name)
          isClosed = place.venue.closed || false
        }
        else {
          console.log('item ' + JSON.stringify(place) + ' missing venue.')
        }
        return venue && validCategory && !isClosed
      })
      .reduce((uniques, place) => {
        let ele = uniques.find((element) => {
          return (element.details.venue.name === place.venue.name) && (element.details.venue.location.address === place.venue.location.address)
        })
        
        if (ele === undefined) {
          uniques.push({
            details: place,
            count: 1
          });
          buildPlaceList(place);      
        }
        else {
          ele.count++;

          // tracking & storing the last known time the place was visited
          // this is used later to ensure suggestions are sufficiently old.
          if (ele.details.createdAt <= place.createdAt)
            ele.details.createdAt = place.createdAt;
        }
        return uniques
      }, [])
    console.log('# of unique places to eat', placesToEat.length);

    return { 'venues': placesToEat, 'locations': citiesVisited };
};