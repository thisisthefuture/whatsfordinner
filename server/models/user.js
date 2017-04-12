var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create User Schema
var User = new Schema({
  name: String,
  foursquare_id: String,
  foursquare_emails: Array,
  // id: String,
  oauth_token: String,
  checkins: Array
});

module.exports = mongoose.model('users', User);