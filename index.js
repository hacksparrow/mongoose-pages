
var anchorPagination = function (conditions, fields, options, callback, limit, anchorId) {


    if ('function' == typeof conditions) {
        callback = conditions;
        conditions = {};
        limit = fields;
        anchorId = options;
        fields = null;
        options = null;
    } else if ('function' == typeof fields) {
        callback = fields;
        limit = options;
        anchorId = callback;
        fields = null;
        options = null;
    } else if ('function' == typeof options) {
        callback = options;
        limit = callback;
        anchorId = limit;
        options = null;
    }

    // // get the raw mongodb collection object
    // var mq = new Query({}, options, this, this.collection);
    //     mq.select(fields);

    // if (this.schema.discriminatorMapping && mq._selectedInclusively()) {
    //     mq.select(this.schema.options.discriminatorKey);
    // }

    // return mq.find(conditions, callback);

    var q = this.find(conditions);
    console.log(q);
}

var skipPagination = function () {

}

exports.anchor = function (schema) {
    schema.statics.findPaginated = anchorPagination;
}

exports.skip = function (schema) {
    schema.statics.findPaginated = skipPagination;
}
