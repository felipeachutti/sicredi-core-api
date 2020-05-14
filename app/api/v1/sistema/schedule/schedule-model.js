'use strict';

const
    Hoek             = require('hoek'),
    COLLECTION_NAME  = 'schedule',
    ObjectId         = require('mongodb').ObjectID,
    Boom             = require('boom');

exports.insert = function (doc, cb) {
    global.db.sicredidb.insert(COLLECTION_NAME, doc, function (err, data) {

        if (err) return cb(err);

        data.ops = null;

        return cb(null, data);
    });
};

exports.find = function (cb) {
    global.db.sicredidb.findFull(COLLECTION_NAME, function (err, data) {

        // error handling
        if (err) return cb(Boom.wrap(err));

        // returning data
        cb(data);
    });
};

exports.findById = function (id, cb) {
    global.db.sicredidb.findOneById(COLLECTION_NAME, id, function (err, data) {
        if (err) return cb(Boom.wrap(err));

        // returning data
        cb(null, data);
    });
};

exports.findOneCpf = function (query, cb) {
    global.db.sicredidb.findOne(COLLECTION_NAME, query, function (err, data) {
        if (err) return cb(Boom.wrap(err));

        // returning data
        cb(null, data);
    });
};

exports.update = function(query, cb) {
    global.db.sicredidb.update(COLLECTION_NAME, query, cb);
};

module.exports = exports;