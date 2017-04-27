// setting up an express app framework
var express = require('express');

// need express-session for foursquare passport authentication to work; don't know why yet
const session = require('express-session');
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongodb-session')(session);

var app = express();

// configuring the port for our web server
var port = process.env.PORT || 5000;
var server = require('http').Server(app);


// for time math and display
var moment = require("moment");

// array to store our results of places
var placesToEat = [];

// array to store all supported cities
var placesVisited = [];

// Filter results by City
function findPlaceByCity(query) {
  return placesToEat.filter(function(el) {
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
var store = new MongoDBStore(
  { uri: process.env.MONGOOSE_URL, collection: 'sessions' });

store.on('error', function(error) {
  console.error(error);
});

// start up our webapp
server.listen(port, function() {
    console.log("App is running on port " + port);
});

// app.use(require('morgan')('dev')); 
app.set('view engine', 'ejs');
app.use(require('cookie-parser')());
app.use(session(
  { secret: 'keyboard cat', 
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week 
    },
    store: store,
    resave: true, 
    saveUninitialized: true}));

app.use(passport.initialize());
app.use(passport.session());

// GET /auth/foursquare
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Foursquare authentication will involve
//   redirecting the user to foursquare.com.  After authorization, Foursquare
//   will redirect the user back to this application at /auth/foursquare/callback
app.get('/auth/foursquare',
  passportFoursquare.authenticate('foursquare'));

// GET /auth/foursquare/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/foursquare/callback', 
  passportFoursquare.authenticate('foursquare', { failureRedirect: '/login' }),
  function(req, res) {
    console.log('authenticated');
    console.log('do we have a user? ', req.hasOwnProperty('user'));
    // res.json(req.user);
    req.session.user = req.user._doc
    req.session.blah = 2;
    req.session.save(err => {
      if (err)
        console.error(err)
      console.log('auth: req.session.user', req.session.hasOwnProperty('user'));
      res.redirect('/');
    })
    
  });

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

// The results to be shown when a user navigates to the root route
app.get('/', function (req, res) {
  
  let user = req.session.user || undefined;
  console.log('req.session.blah', req.session.blah)
  console.log('req.session', req.hasOwnProperty('session'));
  console.log('req.session.user', req.session.hasOwnProperty('user'));
  console.log('req.user', req.hasOwnProperty('user'));

  if (user) {
    console.log('User exists! Their name is', user.name);
    console.log('token', user.oauth_token);
    getCheckins(user, function (recent, suggestion) {
      req.user = req.user || user
      console.log('req.user = ', req.hasOwnProperty('user'));
      res.render('index', { recent: recent, suggestion: suggestion, user: req.user});
    });
  } else {
    console.log('No user yet');
    res.render('index', { recent: null, suggestion: null, user: req.user});
  }
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login');
});

function getCheckins(req, cb) {
  getCheckinsHelper(req, cb);
}

// Determins if we have a list of placesToEat to work with already or if we need to load them
function getCheckinsHelper(req, cb) {

  // crude check to avoid making calls to foursquare or the db
  // TODO: make this check more practical to getting updates while a session is alive
  if (placesToEat.length > 0) {
    console.log('we already have a list of places in memory');
    var recent = printRecent(placesToEat);
    var suggestion = bubblingTheOlder(placesToEat);
    cb(recent, suggestion);
  } else {
    console.log('we need to load checkins');
    var loadCheckins = require('./loadCheckins');
    loadCheckins.getPlaces(req.foursquare_id, req.oauth_token, function(places) {
      placesToEat = places.venues;
      placesVisited = places.locations;
      var recent = printRecent(placesToEat);
      var suggestion = bubblingTheOlder(placesToEat);
      cb(recent, suggestion);
    });
  }    
}

// Takes an expected checkin object ele and returns a String summary containing
// the name, linked if available, followed with one piece of detail.
// if lastDate is true, the detail is the element's last known visit will be displayed
// otherwise, the the detail is the visit count
function printDetails(ele, lastDate) {
  var summary = '';

  if (ele.details.venue.hasOwnProperty('url')) {
    summary += ('<a href="' + ele.details.venue.url + '">' + ele.details.venue.name + '</a>');
  }
  else {
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
  if(ele.details.venue.location.hasOwnProperty('neighborhood')) 
    summary += ' in ' + ele.details.venue.location.neighborhood;
  // } else if (ele.details.venue.location.hasOwnProperty('address')) {
  //   summary += ' on ' + ele.details.venue.location.address;
  // }

  if (lastDate) {
    summary += ('.<br />Last known visit on ' + moment(ele.details.createdAt * 1000).format('LL') +'<br />');
  }
  else {
    if (ele.count === 1) {
      summary += ('. Visited @ least once<br />');
    } else
      summary += ('. Visited @ least ' + ele.count +' times<br />');
  }
  return summary;
}


// Takes an array list and returns a string to display the list of items
function printArrayOfPlaces(list) {
 
  // build the list to be displayed to the user, using printDetails helper function
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
  var results = findPlaceByCity("Seattle");
  var suggestion = '';
  var index = 0;

  // TODO: Fix this to handle if all check-ins are within the last 10 days...
  while (suggestion === '') {
    index = Math.floor(Math.random() * (results.length - 0));

    // to manually check how many tries we take to find a suggestion fitting the 10+ day threshold
    // ideally should see this only once
    // for people with only very new checkins: suggest something they haven't been to in the area
    
    console.log('attempt');

    // TODO: add logic to handle ambigious places (e.g., which Serious Pie have I been to recently?)
    // ... e.g., in print out of details, mention its street + city
    // if createdAt (last seen this check in) at least 10 days old
    if (moment(results[index].details.createdAt * 1000).isBefore(moment().subtract(10, 'days')) === true) {
      suggestion = printDetails(results[index], true);
    }
  }

  return suggestion;

}

// shows only the recently visited place
app.get('/recent', ensureAuthenticated, function(req, res) {
  
    var recent = printRecent(placesToEat);
    res.send(recent); 
});

// a route to display all places
app.get('/all', ensureAuthenticated, function (req, res) {
  var summary = '';

  getCheckins(req, function () {
    if (placesToEat.length === 0) {
      console.error('why are there no places to eat...');
    }

    summary = printArrayOfPlaces(placesToEat);
    
    res.render('results', { title: 'all', results: summary});
  });

  // res.send(summary);  

});

function getCitiesList() {
  let cities = '';
  if (placesVisited.length === 0) {
    cities = 'Whoops, no cities for some reason...';
  }

  cities = placesVisited.reduce((msg, item) => msg + '<a href="/city/' + item + '">' + item + '</a>  ', '')

  return cities;
}

// handling the URL routing without a city search term
app.get('/city', ensureAuthenticated, function (req, res) {

  getCheckins(req, function () {
    res.render('results', { title: 'city', results: getCitiesList()});
  });  
});

// specifying a route to do city queries
app.get('/city/:city', ensureAuthenticated, function (req, res) {

  var summary = '';

  getCheckins(req, function () {
    var city = req.params.city;
    // return the list of places in the provided City
    var results = findPlaceByCity(city);
    console.log('looking at city = ', city);

    if (results.length === 0) {
      summary = 'Can\'t find any places in ' + city;
    }

    summary = printArrayOfPlaces(results);

    res.render('results', { title: city, results: summary});
  });
});
