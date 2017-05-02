// setting up an express app framework
const express = require('express');

// need express-session for foursquare passport authentication to work; don't know why yet
const session = require('express-session');
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongodb-session')(session);

const app = express();

// configuring the port for our web server
const port = process.env.PORT || 5000;
const server = require('http').Server(app);

// for time math and display
const moment = require("moment");

// array to store our results of places
var placesToEat = [];

// array to store all supported cities
var placesVisited = [];

// Filter results by City
function findPlaceByCity(query) {
  return placesToEat.filter(function (el) {
    if (query === el.details.venue.location.city) {
      return el;
    }
  });
}

// connect to mongo database
process.env.MONGOOSE_URL = process.env.MONGOOSE_URL || require('./_config').mongoose.url;
mongoose.connect(process.env.MONGOOSE_URL);

var passport = require('passport');
var passportFoursquare = require('./auth/foursquare');
let loadCheckins = require('./loadCheckins');
var store = new MongoDBStore({
  uri: process.env.MONGOOSE_URL,
  collection: 'sessions'
});

store.on('error', function (error) {
  console.error(error);
});

// start up our webapp
server.listen(port, function () {
  console.log("App is running on port " + port);
});

app.set('view engine', 'ejs');
app.use(require('cookie-parser')(process.env.COOKIE_SECRET));
app.use(session({
  secret: process.env.COOKIE_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week 
  },
  store: store,
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// GET /auth/foursquare
//   Use passportFoursquare.authenticate() as route middleware to authenticate the
//   request.  The first step in Foursquare authentication will involve
//   redirecting the user to foursquare.com.  After authorization, Foursquare
//   will redirect the user back to this application at /auth/foursquare/callback
app.get('/auth/foursquare',
  passportFoursquare.authenticate('foursquare'));

// GET /auth/foursquare/callback
//   Use passportFoursquare.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/foursquare/callback',
  passportFoursquare.authenticate('foursquare', {
    failureRedirect: '/login'
  }),
  function (req, res) {
    console.log('authenticated');

    req.session.save(err => {
      if (err) console.error(err)
      res.redirect(req.session.redirectTo || '/');
    })
  });

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  // saving original URL so we can navigate back to it again after login
  if (!req.session.redirectTo) req.session.redirectTo = req.originalUrl;

  req.session.save(err => {
    if (err) return next(err)
    res.redirect('/login')
  });
}

// The results to be shown when a user navigates to the root route
app.get('/', function (req, res) {
  if (req.user) {
    console.log('User exists:\t', req.user.name);

    getCheckins(req.user, function (recent, suggestion) {
      res.render('index', {
        suggestion: suggestion,
        user: req.user
      });
    });
  } else {
    console.log('No user:\t :(');
    res.render('index', {
      recent: null,
      suggestion: null,
      user: req.user
    });
  }
});

app.get('/account', ensureAuthenticated, function (req, res) {
  res.render('account', {
    user: req.user
  });
});

app.get('/login', function (req, res) {
  res.render('login');
});

function getCheckins(req, cb) {
  getCheckinsHelper(req, cb);
}

// Determins if we have a list of placesToEat to work with already or if we need to load them
function getCheckinsHelper(req, cb) {
  console.log('getcheckinshelper:\n\t\t We need to load checkins');

  loadCheckins.getPlaces(req.foursquare_id, req.oauth_token, function (places) {
    placesToEat = places.venues;
    placesVisited = places.locations;
    var recent = printRecent(placesToEat);
    var suggestion = bubblingTheOlder(placesToEat);
    cb(recent, suggestion);
  });
}


// Takes an expected checkin object ele and returns a String summary containing
// the name, linked if available, followed with one piece of detail.
// if lastDate is true, the detail is the element's last known visit will be displayed
// otherwise, the the detail is the visit count
function printDetails(ele, lastDate) {
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

// Takes a list and suggest a place to eat
// 1. in the same city as they currently are in
// 2. that hasn't been visited in 10 days.
// TODO: make these two factors adjustable
function bubblingTheOlder(list) {

  if (list.length === 0) {
    return "...sorry, I don't know where you've been."
  }

  // give me places only in Seattle
  let results = findPlaceByCity("Seattle"),
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

// shows only the recently visited place
app.get('/recent', ensureAuthenticated, function (req, res) {
  console.log('recently visited')
  getCheckins(req.user, function (recent) {
    res.render('results', {
      title: 'recent',
      results: recent
    });
  });
});

app.get('/recent/update', ensureAuthenticated, function (req, res) {

})

// a route to display all places
app.get('/all', ensureAuthenticated, function (req, res) {
  let summary = '';
  console.log('showing all food related checkins')

  getCheckins(req.user, function () {
    if (placesToEat.length === 0) {
      summary = 'why are there no places to eat...'
      console.error(summary);
    } else {
      summary = printArrayOfPlaces(placesToEat);
    }

    res.render('results', {
      title: 'all',
      results: summary
    });
  });
});

function getCitiesList() {
  let cities = '';
  if (placesVisited.length === 0) {
    cities = 'Whoops, no cities for some reason...';
  } else {
    cities = placesVisited.reduce((msg, item) => msg + '<a href="/city/' + item + '">' + item + '</a>  ', '')
  }

  return cities;
}

// handling the URL routing without a city search term
app.get('/city', ensureAuthenticated, function (req, res) {
  console.log("list of cities visited")
  res.render('results', {
    title: 'city',
    results: getCitiesList()
  });
});

// specifying a route to do city queries
app.get('/city/:city', ensureAuthenticated, function (req, res) {

  var summary = '';

  getCheckins(req.user, function () {
    var city = req.params.city;
    // return the list of places in the provided City
    var results = findPlaceByCity(city);
    console.log('looking at city = ', city);

    if (results.length === 0) {
      summary = 'Can\'t find any places in ' + city;
    } else {
      summary = printArrayOfPlaces(results);
    }

    res.render('results', {
      title: city,
      results: summary
    });
  });
});

app.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/')
})