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

// User.findPaginated('-_id -__v', function(err, docs) {
//     console.log(docs);
// }, 2);
// return;

describe('mongoosePages.anchor', function() {


    // # make entries in the db, before testing
    var numberOfEntries = 27;

    beforeEach(function(done) {

        var populate = function populate(i, total, cb) {

            if (i > total) return cb();

            var now = Date.now();
            var username = 'dancer' + now + Math.floor(Math.random() * 100000000);
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

    it('should set `nextAnchorId` and `previousAnchorId` as `undefined` if there is only one page', function(done) {
        User.findPaginated({}, function(err, result) {
            assert.equal(err, null);
            assert.ok(result.nextAnchorId == undefined);
            assert.ok(result.previousAnchorId == undefined);
            done(err);
        })
    })

    limit = 10;

    it('should set `nextAnchorId` to a doc id, and `previousAnchorId` to `undefined` on the first page', function(done) {

        User.findPaginated({}, function(err, result) {
            assert.equal(err, null);
            assert.ok(result.previousAnchorId == undefined);
            assert.ok(result.nextAnchorId.length == 24);
            done(err);
        }, limit)
    })

    // it('should get the next 10 users', function(done) {
    //     User.findPaginated({}, function(err, result) {
    //         assert.equal(err, null);
    //         assert.ok(result.previousAnchorId.length == 24);
    //         assert.ok(result.nextAnchorId.length == 24);
    //         assert.equal(result.documents.length, 10);
    //         assert.equal(result.totalPages, Math.floor(numberOfEntries / limit));
    //         done(err);
    //     }, limit)
    // })

    it('should return an empty array for non-existent id', function(done) {
        User.findPaginated({}, function(err, result) {
            assert.equal(err, null);
            assert.equal(result.documents.length, 0);
            assert.equal(result.totalPages, 0);
            done(err);
        }, limit, '57c768cb767a71b428967cce')
    })
})


