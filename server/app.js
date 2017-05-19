// setting up an express app framework
const express = require('express'),
      app = express();

// need express-session for foursquare passport authentication to work
const session = require('express-session'),
      mongoose = require('mongoose'),
      MongoDBStore = require('connect-mongodb-session')(session),
      passport = require('passport'),
      passportFoursquare = require('./auth/foursquare');

// configuring the port for our web server
const port = process.env.PORT || 5000,
      server = require('http').Server(app);

// to make use of a bunch of helper functions
const util = require('./util'),
      displayedResults = require('./util/results.js');

// connect to mongo database
process.env.MONGOOSE_URL = process.env.MONGOOSE_URL || require('./_config').mongoose.url;
mongoose.connect(process.env.MONGOOSE_URL);
 
const store = new MongoDBStore({
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

    displayedResults.get(req.user, function (recent, suggestion) {
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

app.post('/update', function (req, res) {
  console.log('post body', req.body)

  res.send('hi!')
})

app.get('/account', ensureAuthenticated, function (req, res) {
  res.render('account', {
    user: req.user
  });
});

app.get('/login', function (req, res) {
  res.render('login');
});

// shows only the recently visited place
app.get('/recent', ensureAuthenticated, function (req, res) {
  console.log('recently visited')
  displayedResults.get(req.user, function (recent) {
    res.render('results', {
      title: 'recent',
      results: recent
    });
  });
});

// a route to display all places
app.get('/all', ensureAuthenticated, function (req, res) {
  let summary = '';
  console.log('showing all food related checkins')

  displayedResults.get(req.user, function () {
    if (displayedResults.placesToEat().length === 0) {
      summary = 'why are there no places to eat...'
      console.error(summary);
    } else {
      summary = util.printArrayOfPlaces(displayedResults.placesToEat());
    }

    res.render('results', {
      title: 'all',
      results: summary
    });
  });
});

// handling the URL routing without a city search term
app.get('/city', ensureAuthenticated, function (req, res) {
  console.log("list of cities visited")
  res.render('results', {
    title: 'city',
    results: util.getCitiesList(displayedResults.placesVisited())
  });
});

// specifying a route to do city queries
app.get('/city/:city', ensureAuthenticated, function (req, res) {

  let summary = '';

  displayedResults.get(req.user, function () {
    let city = req.params.city;
    // return the list of places in the provided City
    let results = util.findPlaceByCity(displayedResults.placesToEat(), city);
    console.log('looking at city = ', city);

    if (results.length === 0) {
      summary = 'Can\'t find any places in ' + city;
    } else {
      summary = util.printArrayOfPlaces(results);
    }

    res.render('results', {
      title: city,
      results: summary
    });
  });
});

app.get('/logout', function (req, res) {
  console.log('logout')
  req.logout()
  res.redirect('/')
})