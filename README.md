Mongoose Pages
==============

Developer-friendly pagination plugin for Mongoose ODM.

## Installation

```
$ npm install mongoose-pages
```

## Usage

Mongoose Pages offers pagination via two different implementations - **skip** and **anchor**. Both the implementations add a new method named `findPaginated()` to the model, which works like the regular `find()` method, except it accepts optional pagination options.

Chose whichever works for your application, their details and differences are explained below.

###skip

When you work with skip, you will get to work with the familiar `docsPerPage` and `pageNumber` objects.

The result object will have the following structure.

```
{
    documents: Array; list of documents
    totalPages: Number; total number of pages, as per the `docsPerPage` value
    prevPage: NUmber; the previous page number
    nextPage: Number; the next page number
}
```

`prevPage` will be `undefined` for the first page. `nextPage` will be `undefined` for the last page.

Here is an example of using the the skip method for implementing pagination.

```
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePages = require('mongoose-pages');

var UserSchema = new Schema({
    username: String,
    points: Number,
    email: String
})

mongoosePages.skip(UserSchema); // the findPaginated() method is added this way

var docsPerPage = 10;
var pageNumber = 1;

var User = mongoose.model('User', UserSchema);
User.findPaginated({}, function (err, result) {
    if (err) throw err;
    console.log(result);
}, docsPerPage, pageNumber); // pagination options go here

```

**Pros**

1. Familiar concept of `docsPerPage` and `pageNumber`
2. Can jump to any page number

**Cons**

1. Performance will degrade as the number of documents increase. This is a limitation is MongoDB.
2. Not recommended for high traffic websites with large number of documents in collection.

###anchor

With anchoring, you get to work with `docsPerPage`, but lose the concept of `pageNumber`; instead you work with an `anchorId`.

An anchor id is the document id which is used as a marker for making the query to MongoDB. Basically you tell Mongo, "Give me `docsPerPage` items from `anchorId` onwards". The document with the `anchorId` is not included in the result.

NOTE: For pagination via anchoring, you will need to use an autoincrementing `_id` value; the default implementation of `_id` works just fine. If you don't like the default implementation of `_id`, you will need implement something of your own.

The result object will have the following structure.

```
{
    documents: Array; list of documents
    totalPages: Number; total page count
    prevAnchorId: String; ObjectId which was used as the anchor id in the last request
    nextAnchorId: String; ObjectId which should be used as the anchor id in the next request
}
```

`prevAnchorId` will be `undefined` for the first page. `nextAnchorId` will be `undefined` for the last page.

Here is an example of using the the anchor method for implementing pagination.

```
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePages = require('mongoose-pages');

var UserSchema = new Schema({
    username: String,
    points: Number,
    email: String
})

mongoosePages.anchor(UserSchema);

var docsPerPage = 10;
var anchorId = '53c797a2043db36f2b673cd1';

var User = mongoose.model('User', UserSchema);
User.findPaginated({}, function (err, result) {
    if (err) throw err;
    console.log(result);
}, docsPerPage, anchorId); // pagination options go here
```

If the `anchorId` is not specified, it is assumed to be the first page.

**Pros**

1. Performance is not affected with increasing number of documents in the collection.
2. Recommended for high traffic websites.

**Cons**

1. Page navigation is sequential
2. Cannot jump to any page number

