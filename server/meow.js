var mongoose = require('mongoose');
mongoose.connect(require('./_config').mongoose.url);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    var kittySchema = mongoose.Schema({
        name: String,
        age: Number,
        secret: String
    });

    kittySchema.methods.speak = function () {
    var greeting = this.name
        ? "Meow name is " + this.name
        : "I don't have a name";
        console.log(greeting);
    }

    var Kitten = mongoose.model('Kitten', kittySchema);

    // get this user's check in #
    // compare check in # to latest check in #
    // if latest > known check in #, then
    // 
    Kitten.find({ age: 2}, function(err, kittens) {
        if (err) return console.error(err);
        console.log(kittens);
        console.log(kittens.length);
        console.log(kittens[0]._doc.name);
        if (kittens[0]._doc.name == 'fluffy 2') {
            Kitten.findOneAndUpdate({age: 2}, { name: 'new fluffy'}, { upsert: true}, function() {
                Kitten.find(function (err, kittens) {
                if (err) return console.error(err);
                    console.log(kittens);
                })
            });
        }
    });

});