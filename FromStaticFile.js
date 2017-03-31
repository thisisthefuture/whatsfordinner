// app.get('/', function (req, res) {
//
//   var summary = '';
//
//   fs.readFile('data/foursquare_checkins.json', 'utf8', function (err, data) {
//     if (err) throw err;
//     text = JSON.parse(data);
//     var places = [];
//
//     // combining multiple arrays of checkins into one
//     for (var i = 0 ; i < text.length; i++) {
//       places = places.concat(text[i].response.checkins.items);
//     }
//
//     // response format: text[ ].response.checkins.items.venue.categories[ ].name
//     // var places = text[0].response.checkins.items;     // give me only the array of checkin items in text[0]
//     // format: places[ ].venue.categories[ ].name
//     // console.log(places[0].venue.categories[0].name);
//
//     console.log('# of places', places.length);
//
//     for (var i = 0; i < places.length; i++) {
//
//       if (places[i].hasOwnProperty('venue')) {
//
//         // check that 1. the venue.categories is in the list of valid categories before we do anything else
//         //            2. the venue is not marked closed
//         if ((function(category) {
//             return categories.hasOwnProperty(category.name);
//           }(places[i].venue.categories[0] || 'none')) && !(function(isClosed) {
//               return isClosed;
//             }(places[i].venue.closed || false))
//           ) {
//
//             // Find if place is already in placesToEat.
//             // If not, let's add it and put visit count = 1. Otherwise, increment visit count.
//             if (placesToEat.find(function (element) {
//               if (element.details.venue.name === places[i].venue.name) {
//                 return element;
//               }
//             }) === undefined) {
//               placesToEat.push(
//                 {
//                   details: places[i],
//                   count: 1
//                 });
//             }
//             else {
//               places.count++;
//             }
//         }
//       } else {
//         console.log('item', i, 'missing venue property');
//       }
//
//     }
//     console.log('# of places to eat', placesToEat.length);
//
//     var results = findPlaceByCity("Barcelona");
//
//     for (var i = 0; i < results.length; i++) {
//       summary += ('Eat at #' + i + ': ');
//       if (results[i].details.venue.hasOwnProperty('url')) {
//         summary += ('<a href="' + results[i].details.venue.url + '">' + results[i].details.venue.name + '</a>');
//       }
//       else {
//           summary += (results[i].details.venue.name);
//       }
//       summary += ('. Visited @ least ' + results[i].count +' times<br />');
//     }
//
//     res.send(summary);
//
//   });
// });


//                                                     // response.checkins.items[0].venue.categories[0].id
//
//
//
//
// //usage:
//
// console.log(placesToEat);
// // console.log(text[0].response.checkins.items[1].venue.name);