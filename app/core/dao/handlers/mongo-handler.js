'use strict';

const
    mongo        = require('mongodb'),
    formatHelper = require('./format-helper'),
    mongo_client = mongo.MongoClient,
    ObjectID     = mongo.ObjectID;

function MongoHandler(dburl) {
    this.url = dburl;
    this.db  = null;
}

MongoHandler.prototype.open = function(cb) {
    const self = this;

    mongo_client.connect(this.url, function(err, dbconn) {
        self.db = dbconn;
        cb(err);
    });
};

MongoHandler.prototype.close = function() {
    this.db.close();
};

MongoHandler.prototype.insert = function(collectionName, doc, cb) {

    this.db.collection(collectionName, (err, collection) => {
        if (err) return cb(err);
        collection.insert(doc, { 'w': 1 }, cb);
    });
};

MongoHandler.prototype.findFull = function(collectionName, cb) {

    this.db.collection(collectionName, (err, collection) => {
        if (err) return cb(err);
        collection.find().toArray(cb);
    });
};

MongoHandler.prototype.update = function(collectionName, doc, cb) {

    let
        i,
        idOne;

    const arrayIds = [];

    if (!doc) return cb('Missing param: { doc }');

    if (Array.isArray(doc.ids)) {

        for (i = 0; i < doc.ids.length; i += 1)
            if (formatHelper.isOID(doc.ids[i]))
                arrayIds.push(new ObjectID(doc.ids[i]));

        delete doc.ids;

    } else if (formatHelper.isOID(doc._id)) {
        idOne = new ObjectID(doc._id);
        delete doc._id;
    }

    this.db.collection(collectionName, function(err, collection) {
        if (err)  return cb(err);

        // Array data update
        if (arrayIds && Array.isArray(arrayIds) && arrayIds.length > 0) {
            return collection.update({'_id': { '$in': arrayIds }}, { '$set' : doc }, { 'multi': true }, cb);
        }

        // Single data update
        if (idOne) {
            collection.update({'_id': idOne}, doc, function(err, data) {
                return cb(null, data);
            });
        }
    });

};

MongoHandler.prototype.findOneById = function(collectionName, id, cb) {
    const query = {
        '_id': formatHelper.isOID(id) ? new ObjectID(id) : id
    };

    this.db.collection(collectionName, (err, collection) => {
        if (err) return cb(err);
        collection.findOne(query, cb);
    });
};

MongoHandler.prototype.findOne = function(collectionName, query, cb) {
    this.db.collection(collectionName, function(err, collection) {
        if (err)  return cb(err);

        collection.count(query, function(error, totalForm) {
            if (error) return cb(err);

            if (totalForm === 0) {
                return cb(null, false);
            } else {
                return cb(null, true);
            }

        });

    });


};

module.exports = function(dburl) {
    return new MongoHandler(dburl);
};