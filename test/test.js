var assert = require('assert');
var mongoose = require('mongoose');
var mongoosePages = require('../');

var limit, anchorId;
var db = mongoose.connect('mongodb://localhost/mongoose-pages');

var UserSchema = new mongoose.Schema({
    username: String,
    points: Number,
    email: String
})

mongoosePages.anchor(UserSchema);

var User = mongoose.model('User', UserSchema);
User.findPaginated({_id: '53c6a40d9e16a67a1c9c9322'}, 'username', function() {

}, 10, 1);

return;

describe('mongoosePages.anchor', function() {



    // # make entries in the db, before testing
    var numberOfEntries = 27;
    before(function(done) {

        var populate = function populate(i, total, cb) {

            if (i > total) return cb();

            var now = Date.now();
            var username = 'dancer' + now;
            var points = Math.floor(now * Math.random()/ 100000000);
            var email = now + '@disco.org';

            new User({ 'username': username, 'points': points, 'email': email })
                .save(function(err) {
                    if (err) { return cb(err); }
                    populate(++i, total, cb);
                }
            )
        }

        return User.remove({}, function(err) {
            if (err) done(err);
            populate(1, numberOfEntries, done);
        })

    })

    // # after testing, close the db connection
    after(function() { db.connection.close(); })


    //# test cases

    it('should get all ' + numberOfEntries + ' users', function(done) {
        User.findPaginated({}, function(err, result) {
            assert.equal(err, null);
            assert.equal(result.documents.length, numberOfEntries);
            done(err);
        })
    })


    limit = 10;
    it('should get first 10 users', function(done) {
        User.findPaginated({}, function(err, result) {
            assert.equal(err, null);
            assert.equal(result.documents.length, 10);
            assert.equal(result.totalPages, Math.floor(numberOfEntries / limit));
            done(err);
        }, limit)
    })


    it('should get the next 10 users after ' + anchorId, function(done) {
        User.findPaginated({}, function(err, result) {
            assert.equal(err, null);
            assert.equal(result.documents.length, 10);
            anchorId = result.documents[limit-1]._id; // id of the last document
            assert.equal(result.totalPages, Math.floor(numberOfEntries / limit));
            done(err);
        }, limit, anchorId)
    })

    it('should get the remaining 7 users after' + anchorId, function(done) {
        User.findPaginated({}, function(err, result) {
            assert.equal(err, null);
            assert.equal(result.documents.length, 7);
            assert.equal(result.totalPages, Math.floor(numberOfEntries / limit));
            done(err);
        }, limit, anchorId)
    })


    it('should return an empty array for non-existent id', function(done) {
        User.findPaginated({}, function(err, result) {
            assert.equal(err, null);
            assert.equal(result.documents.length, 0);
            assert.equal(result.totalPages, 0);
            done(err);
        }, limit, 'haha')
    })
})


