// setting up an express app framework
var express = require('express');
var app = express();
app.set('view engine', 'ejs');

// configuring the port for our web server
var port = process.env.PORT || 8000;
var server = require('http').Server(app);

// get list of valid food/drinks related categories from Swarm
var categories = require('../data/categories.js');

var fs = require('fs');

// data from the imported raw file
var fromFile;

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

// start up our webapp
server.listen(port, function() {
    console.log("App is running on port " + port);
});

// Sets up the placesToEat array from the json file
function setup() {

  // read our static data
  fs.readFile('data/foursquare_checkins.json', 'utf8', function (err, data) {
    if (err) throw err;

    // parse json to JS data structure
    fromFile = JSON.parse(data);

    // an array to store the raw, unfiltered, data    
    var places = [];

    // combining the multiple arrays of checkins into one
    // JSON data is blocked to sections of 250 entries
    for (var i = 0 ; i < fromFile.length; i++) {
      places = places.concat(fromFile[i].response.checkins.items);
    }

    // response format: fromFile[ ].response.checkins.items.venue.categories[ ].name
    // new shorter format: places[ ].venue.categories[ ].name
    // console.log(places[0].venue.categories[0].name);

    console.log('# of places in log', places.length);

    // Lets loop and clean up the data we received.
    // We'll only use only places in the JSON that have 
    // 1. a venue property, 
    // 2. a category & a valid category, 
    // 3. is not closed, and 
    // let's have our list be of unique places, keeping track of multiple known visits
    for (var i = 0; i < places.length; i++) {

      // If no venue, it's not a real place we care about
      if (places[i].hasOwnProperty('venue')) {

        // check that 1. the venue.categories is in the list of valid categories before we do anything else
        //            2. the venue is not marked closed

        // How this IF statement works:
        // The IF condition is the && of two function's boolean outputs.
      
        // Function #1: What gets passed to the function is the venue 
        // category if it exists. Otherwise 'none' is passed.
        // This function returns is a bool, the output of whether the master categories list has the provided
        // function name.

        // Function #2: What gets passed to this function is the boolean "closed" value for the venue if it exists.
        // otherwise, false is passed to the function. This function simply returns what it is passed.

        // Why this silly work? Because if we wanted to evaluate the places[i].venue.closed and
        // places[i].venue.categories[0] properties directly, if they didn't exist, a error
        // would be thrown.
        if ((function(category) {
            return categories.hasOwnProperty(category.name);
          }(places[i].venue.categories[0] || 'none')) && !(function(isClosed) {
              return isClosed;
            }(places[i].venue.closed || false))
          ) {

            // Find if place is already in placesToEat.
            // If not, let's add it and put visit count = 1. Otherwise, it exists so increment visit count.
            var ele = placesToEat.find(function (element) {
              if (element.details.venue.name === places[i].venue.name) {
                return element;
              }
            });

            if (ele === undefined) {
              placesToEat.push(
              {
                details: places[i],
                count: 1
              });

              // let's build our Places list, list of citys at the moment, while we're looping the array setting up
              buildPlaceList(places[i]);      
            }
            else {
              ele.count++;
            }
        }
      } else {
        console.log('item', i, 'missing venue property');
      }
    }
    console.log('# of unique places to eat', placesToEat.length);

  });
}

// if the passed city is NOT in placesVisited add it.
function buildPlaceList(place) {
  if (placesVisited.find(function (element) {
    if (element === place.venue.location.city) {
      return element;
    }
  }) === undefined) {
    if (place.venue.location.city != undefined)
      placesVisited.push(place.venue.location.city);
    else {
      console.log('errr... undefined city with', place.venue.name);
    }
  }
}

var passport = require('passport');

// app.use(require('cookie-parser')()); not sure if I need this 

// definately need express-session for foursquare passport authentication to work; don't know why yet
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

var mongoose = require('mongoose');
mongoose.connect('mongodb://whatsfordinner:StephensMom2000!@ds157390.mlab.com:57390/whatsfordinner');
// mongoose.connect('mongodb://localhost/whatsfordinner');

var passportFoursquare = require('./auth/foursquare');

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
    // res.json(req.user);
    res.redirect('/');
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

// specifying the results to be shown when a user navigates to the root route
app.get('/', function (req, res) {

  var summary = '';

  // return the list of places in the provided City
  var results = findPlaceByCity("Seattle");

  // build the list to be displayed to the user
  for (var i = 0; i < results.length; i++) {
    summary += ('Eat at #' + i + ': ');
    if (results[i].details.venue.hasOwnProperty('url')) {
      summary += ('<a href="' + results[i].details.venue.url + '">' + results[i].details.venue.name + '</a>');
    }
    else {
        summary += (results[i].details.venue.name);
    }
    summary += ('. Visited @ least ' + results[i].count +' times<br />');
  }

  res.render('index', { output: summary, user: req.user});

});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

var offset = 0;
var itemsRemain = true;
var data = [];

function printArrayOfPlaces(list) {
  var summary = '';

  // build the list to be displayed to the user, including links if available.
  for (var i = 0; i < list.length; i++) {
    summary += ('Eat at #' + i + ': ');
    if (list[i].details.venue.hasOwnProperty('url')) {
      summary += ('<a href="' + list[i].details.venue.url + '">' + list[i].details.venue.name + '</a>');
    }
    else {
        summary += (list[i].details.venue.name);
    }
    summary += ('. Visited @ least ' + list[i].count +' times<br />');
  }

  return summary;
}

app.get('/recent', ensureAuthenticated, function(req, res) {
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
      // var checkins = require('./checkins').parse(places);

      // cleaning the existing array to replace it with updated data
      placesToEat.splice(0, placesToEat.length);
      placesToEat = require('./checkins').parse(places);
      summary = 'Recently visited:<br />' + printArrayOfPlaces(placesToEat);
      console.log(summary);
      res.send(summary);
  }

  // start our work
  RetrievePlaces();

});

// a route to display all places
app.get('/all', function (req, res) {
  var summary = '';

  // build the list to be displayed to the user
  for (var i = 0; i < placesToEat.length; i++) {
    summary += ('Eat at #' + i + ': ');
    if (placesToEat[i].details.venue.hasOwnProperty('url')) {
      summary += ('<a href="' + placesToEat[i].details.venue.url + '">' + placesToEat[i].details.venue.name + '</a>');
    }
    else {
        summary += (placesToEat[i].details.venue.name);
    }
    summary += ('. Visited @ least ' + placesToEat[i].count +' times<br />');
  }

  res.send(summary);  
});

// handling the URL routing without a city search term
app.get('/city', function (req, res) {
  var instructions = '';

  if (placesVisited.length === 0) {
    instructions = 'Whoops, no cities for some reason...';
  }

  for (var i = 0 ; i < placesVisited.length; i++) {
    instructions += ('<a href="/city/' + placesVisited[i] + '">' + placesVisited[i] + '</a>&nbsp;&nbsp;');
  }
 
  res.send(instructions);

});

// specifying a route to do city queries
app.get('/city/:city', function (req, res) {

  var city = req.params.city;
  var summary = '';

  // return the list of places in the provided City
  var results = findPlaceByCity(city);
  console.log('looking at city = ', city);

  if (results.length === 0) {
    summary = 'Can\'t find any places in ' + city;
  }
  
  // build the list to be displayed to the user
  for (var i = 0; i < results.length; i++) {
    summary += ('Eat at #' + i + ': ');
    if (results[i].details.venue.hasOwnProperty('url')) {
      summary += ('<a href="' + results[i].details.venue.url + '">' + results[i].details.venue.name + '</a>');
    }
    else {
        summary += (results[i].details.venue.name);
    }
    summary += ('. Visited @ least ' + results[i].count +' times<br />');
  }

  res.send(summary);

});

app.listen(5000);

setup();
