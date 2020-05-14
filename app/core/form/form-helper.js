'use strict';

const multiparty = require('multiparty');

exports.parse = function (payload, customer_id, cb) {

    const
        form = new multiparty.Form(),
        formData = {};

    form.parse(payload, function (err, fields, files) {
        if (err) { return cb(err); }


        files.file[0].path = global.config.drive.root_path.toString() + customer_id + '/' + files.file[0].originalFilename;

        Object.assign(formData, fields, files.file[0]);


        return cb(null, formData);
    });

};