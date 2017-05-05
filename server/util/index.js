const moment = require('moment');

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

// Returns the list of cities
function getCitiesList(placesVisited) {
  let cities = '';
  if (placesVisited.length === 0) {
    cities = 'Whoops, no cities for some reason...';
  } else {
    cities = placesVisited.reduce((msg, item) => msg + '<a href="/city/' + item + '">' + item + '</a>  ', '')
  }

  return cities;
}

// Takes a list and suggest a place to eat
// 1. in the same city as they currently are in
// 2. that hasn't been visited in 10 days.
// TODO: make these two factors adjustable
function bubblingTheOlder(list) {

  if (list.length === 0) {
    return "...sorry, I don't know where you've been."
  }

  // give me places only in Seattle
  let results = findPlaceByCity(list, "Seattle"),
      suggestion = '',
      margin = 10,
      index = 0;

  // TODO: Fix this to handle if all check-ins are within the last 10 days...
  // assumption: list goes from most recently visited to least recently visited
  // slightly better: check the last element available.
  // if the last (oldest known) place isn't more than 10 days old, then nothing is.
  // Give that place back for now. Ideally: suggest them a place in the area they haven't been but
  // have lots of visits from the community

  if (moment(results[results.length - 1].details.createdAt * 1000).isBefore(moment().subtract(10, 'days')) !== true) {
    margin = 0;
    console.log('checkins too new. Setting margin = 0')
  }
  // still can be looping here for awhile. OPPORTUNITY for optimization
  while (suggestion === '') {
    index = Math.floor(Math.random() * (results.length - 0));

    // to manually check how many tries we take to find a suggestion fitting the 10+ day threshold
    // ideally should see this only once      
    console.log('attempt');

    // TODO: add logic to handle ambigious places (e.g., which Serious Pie have I been to recently?)
    // ... e.g., in print out of details, mention its street + city

    // if createdAt (last seen this check in) at least 10 days old
    if (moment(results[index].details.createdAt * 1000).isBefore(moment().subtract(margin, 'days')) === true) {
      suggestion = printDetails(results[index], true);
    }
  }

  return suggestion;
}

module.exports = {
    findPlaceByCity: findPlaceByCity,
    printDetails: printDetails,
    printArrayOfPlaces: printArrayOfPlaces,
    printRecent: printRecent,
    getCitiesList: getCitiesList,
    getSuggestion: bubblingTheOlder
}
