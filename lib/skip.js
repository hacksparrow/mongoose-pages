module.exports = function (conditions, fields, options, callback, limit, pageNumber) {


    var model = this;

    // re-assign params
    if ('function' == typeof conditions) {
        //console.log('A');
        limit = fields;
        pageNumber = options;
        callback = conditions;
        conditions = {};
        fields = null;
        options = {};

    } else if ('function' == typeof fields) {
        //console.log('B');
        limit = options;
        pageNumber = callback;
        callback = fields;
        fields = null;
        options = {};

    } else if ('function' == typeof options) {
        //console.log('C');
        pageNumber = limit;
        limit = callback;
        callback = options;
        options = {};

    }

    if (pageNumber < 1) {
        callback(new Error('Invalid Page Number'));
    }
    else if (!(typeof pageNumber == 'undefined') && isNaN(pageNumber)) {
        callback(new Error('Invalid Page Number'));
    }
    else {

        pageNumber = +pageNumber || 1;

        // set pagination filters
        if (pageNumber) options.skip = limit * (pageNumber - 1);
        if (limit) options.limit = limit;

        return model.find(conditions, fields, options, function (err, docs) {

            var result = {}

            if (docs && docs.length) {

                result.documents = docs;

                model.count(conditions, function (err, count) {

                    var totalDocs = count;

                    if (limit) result.totalPages = Math.ceil(totalDocs / limit);
                    else result.totalPages = 1;

                    if (result.totalPages > 1) {
                        if (pageNumber > 1) result.prevPage  = pageNumber - 1;
                        if (pageNumber < result.totalPages) result.nextPage = pageNumber + 1;
                    }

                    callback(err, result);

                })

            } else {

                result.documents = [];
                result.totalPages = 0;
                callback(err, result);

            }

        })

    }

}
