var assert = require('assert');
var mongoose = require('mongoose');
var mongoosePages = require('../');

var limit, anchorId;
var connection = mongoose.createConnection('mongodb://localhost/mongoose-pages');

var UserSchema = new mongoose.Schema({
    username: String,
    points: Number,
    email: String
})
mongoosePages.anchor(UserSchema);
var User = connection.model('User', UserSchema);

describe('mongoosePages.anchor', function() {


    // # make entries in the db, before testing
    var numberOfEntries = 27;

    before(function(done) {

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
    after(function() { connection.close(); })


    //# test cases

    it('should get all ' + numberOfEntries + ' users', function(done) {
        User.findPaginated({}, function(err, result) {
            assert.equal(err, null);
            assert.equal(result.documents.length, numberOfEntries);
            done(err);
        })
    })

    it('should support conditions', function(done) {
        User.findPaginated({ points: { $gt: 5000 } }, function(err, result) {
            assert.equal(err, null);
            assert.ok(result.documents.length == 5);
            done(err);
        }, 5)
    })

    it('should support fields', function(done) {
        User.findPaginated({}, 'username', function(err, result) {
            assert.equal(err, null);
            assert.ok(!result.documents[0].__v);
            assert.ok(result.documents[0].username.length);
            done(err);
        }, 10)
    })

    it('should support options', function(done) {
        User.findPaginated({}, 'username', { limit: 2 }, function(err, result) {
            assert.equal(err, null);
            assert.ok(result.documents.length == 2);
            done(err);
        })
    })

    it('should set `nextAnchorId` and `prevAnchorId` as `undefined` if there is only one page', function(done) {
        User.findPaginated({}, function(err, result) {
            assert.equal(err, null);
            assert.ok(result.nextAnchorId == undefined);
            assert.ok(result.prevAnchorId == undefined);
            done(err);
        })
    })

    it('should set `nextAnchorId` to a doc id, and `prevAnchorId` to `undefined` on the first page', function(done) {

        User.findPaginated({}, function(err, result) {
            assert.equal(err, null);
            assert.ok(result.prevAnchorId == undefined);
            assert.ok(result.nextAnchorId.length == 24);
            done(err);
        }, 10)
    })

    it('should get the next 10 users', function(done) {

        User.findPaginated({}, function(err, result) {
            User.findPaginated({}, function(err, result) {
                assert.equal(err, null);
                assert.ok(result.prevAnchorId.length == 24);
                assert.ok(result.nextAnchorId.length == 24);
                assert.equal(result.documents.length, 10);
                done(err);
            }, 10, result.nextAnchorId)

        }, 10)

    })

    it('should return an empty error for a non-existent id', function(done) {
        User.findPaginated({}, function(err, result) {
            assert.equal(err, null);
            assert.equal(result.documents.length, 0);
            done();
        }, 10, '999997a2047db76f2c670000')
    })

    it('should return an error for an invalid id', function(done) {
        User.findPaginated({}, function(err, result) {
            assert.ok(err);
            assert.equal(result, undefined);
            done();
        }, 10, 'x')
    })

    describe('page count tests', function () {

        it('should have 27 pages', function(done) {
            User.findPaginated({}, function(err, result) {
                assert.equal(err, null);
                assert.equal(result.totalPages, 27);
                done(err);
            }, 1)
        })

        it('should have 4 pages', function(done) {
            User.findPaginated({}, function(err, result) {
                assert.equal(err, null);
                assert.equal(result.totalPages, 6);
                done(err);
            }, 5)
        })

        it('should have 3 pages', function(done) {
            User.findPaginated({}, function(err, result) {
                assert.equal(err, null);
                assert.equal(result.totalPages, 3);
                done(err);
            }, 10)
        })

    })

})


