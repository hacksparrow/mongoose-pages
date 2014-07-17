
var anchorPagination = function (conditions, fields, options, callback, limit, anchorId) {

    var model = this;

    // re-assign params
    if ('function' == typeof conditions) {
        //console.log('A');
        limit = fields;
        anchorId = options;
        callback = conditions;
        conditions = {};
        fields = null;
        options = {};
    } else if ('function' == typeof fields) {
        //console.log('B');
        limit = options;
        anchorId = callback;
        callback = fields;
        fields = null;
        options = {};
    } else if ('function' == typeof options) {
        //console.log('C');
        anchorId = limit;
        limit = callback;
        callback = options;
        options = {};
    }

    // set pagination filters
    if (anchorId) conditions._id = { $gte: anchorId }
    if (limit) options.limit = limit;

    model.count({}, function (err, count) {

        var totalPages = count;

        model.find(conditions, fields, options, function (err, docs) {

            var result = { documents: docs }

            if (limit) result.totalPages = Math.floor(totalPages / limit);
            else result.totalPages = 1;

            if (result.totalPages > 1) {
                result.previousAnchorId = anchorId;
                result.nextAnchorId = docs[ docs.length - 1 ]._id.toString();
            }

            callback(err, result);
        });


    });



}

var skipPagination = function () {

}

exports.anchor = function (schema) {
    schema.statics.findPaginated = anchorPagination;
}

exports.skip = function (schema) {
    schema.statics.findPaginated = skipPagination;
}
