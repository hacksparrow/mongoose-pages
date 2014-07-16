mongoose-pager
==============

Developer-friendly pagination plugin for Mongoose ODM.

## Installation

   $ npm install mongoose-pages

## Usage

1. Load the `mongoose-pager` module
2. To implement pagination capability for a scgema, pass the schema to `mongoose-pager`
3. The schema now has a method named `.findPaginated()`, which is a superset of `.find()` and accepts an optional pagination object at the end, after the callback function
4. The callback function will receive the same arguments as `.find()` with additional pagination details in the end

Example:

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var mongoosePages = require('mongoose-pager');

    var userSchema = new Schema({name: String, age: Number});
    mongoosePages(userSchema);

    var userModel = mongoose.model('user', userSchema);
    userModel.findPaginated();

