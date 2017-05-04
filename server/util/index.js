const moment = require("moment");

// Filter results by City
function findPlaceByCity(placesToEat, query) {
    return placesToEat.filter(function (el) {
        if (query === el.details.venue.location.city) {
        return el;
        }
    });
}

// Takes an expected checkin object ele and returns a String summary containing
// the name, linked if available, followed with one piece of detail.
// if lastDate is true, the detail is the element's last known visit will be displayed
// otherwise, the the detail is the visit count
function printDetails (ele, lastDate) {
    var summary = '';

    if (ele.details.venue.hasOwnProperty('url')) {
        summary += ('<a href="' + ele.details.venue.url + '">' + ele.details.venue.name + '</a>');
    } else {
        summary += (ele.details.venue.name);
    }

    // can we get the neighborhood info from foursquare, e.g.,
    // https://api.foursquare.com/v2/venues/search?client_secret=xxxx&client_id=cccc&limit=50&venuePhotos=1&v=20140327&near=Seattle,WA&radius=40000&categoryId=4f2a25ac4b909258e854f55f
    // and then do a look up for the venu's neighbourhood
    // alt look into: http://twofishes.net/
    /*
    http://demo.twofishes.net/?query=new%20york&lang=es&maxInterpretations=4
    http://demo.twofishes.net/?ll=47.62479716487741,-122.30756968259811&lang=en&maxInterpretations=4&woeHint=SUBURB

    "lat": 47.62479716487741,
    "lng": -122.30756968259811,
    */
    // most places from foursquare don't have this field yet. Need to look into twofishes
    // to populate this field. Sigh.
    if (ele.details.venue.location.hasOwnProperty('neighborhood'))
        summary += ' in ' + ele.details.venue.location.neighborhood;
    // } else if (ele.details.venue.location.hasOwnProperty('address')) {
    //   summary += ' on ' + ele.details.venue.location.address;
    // }

    if (lastDate) {
        summary += ('.<br />Last known visit on ' + moment(ele.details.createdAt * 1000).format('LL') + '<br />');
    } else {
        if (ele.count === 1) {
        summary += ('. Visited @ least once<br />');
        } else
        summary += ('. Visited @ least ' + ele.count + ' times<br />');
    }
    return summary;
}

// Build the list to be displayed to the user, using printDetails helper function
function printArrayOfPlaces(list) {
  let summary = list.reduce((msg, item) => msg + printDetails(item), '');
  return summary;
}

// Takes a list and returns the summary of the first (most recent) item
function printRecent(list) {
  if (list.length === 0) {
    return "...sorry, I don't know where you've been."
  }
  return printDetails(list[0]);
}

module.exports = {
    findPlaceByCity: findPlaceByCity,
    printDetails: printDetails,
    printArrayOfPlaces: printArrayOfPlaces,
    printRecent: printRecent
}
