mongoose-pager
==============

Developer-friendly pagination plugin for Mongoose ODM.

## Installation

   $ npm install mongoose-pages

## Usage

Mongoose Pager offers pagination via two different implementations - skip and anchor. Chose whichever works for your application.

1. Load the `mongoose-pager` module in your app
2. To implement pagination capability for a schema, pass the schema to `mongoose-pager`
3. The schema now has a method named `.findPaginated()`, which is a superset of `.find()`, and accepts two additional pagination options at the end, right after the callback function - number of pages and the page number
4. The callback function will receive the error and the result objects as in `.find()`. The result object contains the details of the paged query.

    {
        documents: Array; list of documents
        totalPages: Number; total page count
        pageNumber: Number; current page number
    }

Example:

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var mongoosePages = require('mongoose-pager');

    var UserSchema = new Schema({
        username: String,
        points: Number,
        email: String
    })

    mongoosePages(UserSchema);

    var User = mongoose.model('User', UserSchema);
    User.findPaginated();

