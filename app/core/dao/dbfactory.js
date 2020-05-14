'use strict';

const
    url      = require('url'),
    handlers = {
        'mongodb'  : require('./handlers/mongo-handler')
    };

let logger;

exports.boot = (options, loggerObj) => {

    // Configurando Log do DBFactory
    logger = loggerObj.child({
        'widget_type': options.log_tag
    });
};

exports.openConnection = (dblist, pos, connections, cb) => {
    let
        dbhandler,
        metadata;

    const self = this;

    // Looking for the end of loop
    if (pos === dblist.length) {
        logger.debug(`> DBFactory job's done`);
        return cb(null, connections);
    } else {

        // Selecting
        metadata = dblist[pos];

        // Connection details
        logger.info(`> Initializing database connection: ${metadata.name}`);
        logger.debug(`> Database URL: ${metadata.url}`);

        // Get handler based on url type (check it on the top variables)
        dbhandler = this.getHandler(metadata.url);

        // Saving handler
        connections[metadata.name] = dbhandler(metadata.url, metadata.options);

        // Connecting
        connections[metadata.name].open((err) => {

            // Checking errors
            if (err) {
                logger.debug(`# Error connecting database: ${metadata.name}`);
                logger.error(`# Error details: `, err);

                return cb(err);

            } else {

                // Success Log
                logger.debug(`> Database ${metadata.name} successfully connected`);

                // Looping up
                self.openConnection(dblist, pos + 1, connections, cb);
            }
        }, logger);
    }

};

exports.createConnections = (dblist, cb) => {
    this.openConnection(dblist, 0, {}, cb);
};

exports.closeAll = () => {
    for (const connection in global.db) {

        // Leak protection
        if (global.db.hasOwnProperty(connection)) {
            logger.info(`> Closing database connection: ${connection}`);

            // Closing
            global.db[connection].close();
        }
    }
};

exports.getHandler = (dburl) => {
    const
        parsed   = url.parse(dburl),
        protocol = parsed.protocol.replace(':', '');

    return handlers[protocol];
};

module.exports = exports;
