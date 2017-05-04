var assert = require('assert');

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});

var app = require('./app')

function findPlaceByCity(query) {
  return [].filter(function (el) {
    if (query === el.details.venue.location.city) {
      return el;
    }
  });
}

describe('Find place by city', function () {

    it('results.length = 0', () => {
        console.log(typeof app.findPlaceByCity)
        let results = app.findPlaceByCity('San Francisco')
        assert.equal(results.length, 0)

    })
})
