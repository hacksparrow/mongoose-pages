Mongoose Pages [![NPM version](https://badge.fury.io/js/mongoose-pages.svg)](https://badge.fury.io/js/mongoose-pages)
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
    prevPage: Number; the previous page number
    nextPage: Number; the next page number
}
```

`prevPage` will be undefined for the first page. `nextPage` will be undefined for the last page.

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

mongoosePages.skip(UserSchema); // makes the findPaginated() method available

var docsPerPage = 10;
var pageNumber = 1;

var User = mongoose.model('User', UserSchema);
User.findPaginated({}, function (err, result) {
    if (err) throw err;
    console.log(result);
}, docsPerPage, pageNumber); // pagination options go here

```

**Pros**

1. Familiar concept of `docsPerPage` and `pageNumber`.
2. Can implement a paged navigation system.
3. Can jump to any page.

**Cons**

1. Performance will degrade as the number of documents increase. This is a limitation is [MongoDB's skip](http://docs.mongodb.org/manual/reference/method/cursor.skip/).
2. Not recommended for high traffic websites with large number of documents in collection.

###anchor

With anchoring, you get to work with `docsPerPage`, but lose the concept of `pageNumber`; instead you work with an `anchorId`.

An anchor id is the document id which is used as a marker for making the query to MongoDB. Basically you tell Mongo, "Give me `docsPerPage` items from `anchorId` onwards".

If the anchor id is not passed, it is assumed to be making a request for the first page. You get the `nextAnchorId` value from the result of the first page, to request for the second page etc. The document with the `anchorId` is not included in the result.

**NOTE**: For pagination via anchoring, you will need to use an autoincrementing `_id` value; the default implementation of `_id` works just fine. If you don't like the default implementation of `_id`, you will need to implement `_id` of your own, which numerically autoincrements.

The result object will have the following structure.

```
{
    documents: Array; list of documents
    totalPages: Number; total page count
    prevAnchorId: String; ObjectId which was used as the anchor id in the last request
    nextAnchorId: String; ObjectId which should be used as the anchor id in the next request
}
```

`prevAnchorId` will be undefined for the first page. `nextAnchorId` will be undefined for the last page.

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

mongoosePages.anchor(UserSchema); // makes the findPaginated() method available

var docsPerPage = 10;
var anchorId = '53c797a2043db36f2b673cd1';

var User = mongoose.model('User', UserSchema);
User.findPaginated({}, function (err, result) {
    if (err) throw err;
    console.log(result);
}, docsPerPage, anchorId); // pagination options go here
```

If you want to request the first page, just omit the `anchorId` parameter.

```
User.findPaginated({}, function (err, result) {
    if (err) throw err;
    console.log(result);
}, docsPerPage);
```

**Pros**

1. Performance is not affected with increasing number of documents in the collection.
2. Recommended for high traffic websites.
3. Navigation is previou-next based.

**Cons**

1. Page navigation is sequential.
2. Pages cannot be referenced via page numbers.
3. Cannot jump to pages. However, it can jump to anchor points, once you have the reference.


## License

Copyright (c) 2014 Hage Yaapa &lt;captain@hacksparrow.com&gt;

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
