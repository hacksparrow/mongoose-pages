Mongoose Pager
==============

Developer-friendly pagination plugin for Mongoose ODM.

### Installation

```
$ npm install mongoose-pages
```

### Usage

Mongoose Pager offers pagination via two different implementations - **skip** and **anchor**. Both the implementations add a new method named `findPaginated()` to the model, which works like the normal `find()` method, except it accepts optional pagination options.

Chose whichever works for your application, their details and differences are explained below.

**Skip**

When you work with skip, you will get to work with the familiar `docsPerPage` and `pageNumber` objects.

**Anchor**

When you work with anchor, you get to work with `docsPerPage`, but lose the concept of `pageNumber`; instead you work with an `anchorId`.

An anchor id is the document id which is used as a marker for making the query. Basically you tell Mongoose, "Give me `docsPerPage` items from `anchorId` onwards". The document with the `anchorId` is not included in the result.



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

