var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// create User Schema
var User = new Schema({
  name: String,
  foursquare_id: String,
  foursquare_emails: Array,
  oauth_token: String,
  swarm_checkins_total: Number,
  checkin_update_needed: Boolean,
  swarm_slurp_date: Number, 
  locations: Array,
  checkins: Array
});

module.exports = mongoose.model('users', User);