var assert = require('assert');
var mongoose = require('mongoose');
var mongoosePages = require('../');

var db = mongoose.connect('mongodb://localhost/mongoose-pages');

var UserSchema = new mongoose.Schema({
    username: String,
    points: Number,
    email: String
})

var User = mongoose.model('User', UserSchema);

describe('Mongoose Pages', function() {

    // # make entries in the db, before testing
    before(function(done) {

        var populate = function populate(i, total, cb) {

            if (i > total) return cb();

            var now = Date.now();
            var username = 'dancer' + now;
            var points = Math.floor(now * Math.random()/ 100000000);
            var email = now + '@disco.org';

            new User({ 'username': username, 'points': points, 'email': email })
                .save(function(err) {
                    if (err) {
                        cb(err);
                        return;
                    }
                    populate(++i, total, cb);
                })
        }

        return User.remove({}, function(err) {
            if (err) done(err);
            populate(1, 100, done);
        })

    })

    // # after testing, close the db connection
    after(function() { db.connection.close(); })


    //# test cases
    it('should get 100 users', function(done) {
        User.find({}, function(err, pager) {
             assert.equal(pager.length, 10);
            done(err);
        })
    })

    // it('should ', function(done) {
    //     User.findPaginated({}, function(err, pager) {
    //         assert.equal(pager.count, 23);
    //         assert.equal(pager.last, 5);
    //         done(err);
    //     }, { pageNumber: 1, limit: 2 })
    // })

})


