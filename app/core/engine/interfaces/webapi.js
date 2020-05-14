'use strict';

const
    silly        = require('sillyname'),
    webApiRouter = require('../web/router');

exports.generateNodeName = function() {
    return silly();
};

exports.configure = function(settings) {
    return settings;
};

exports.run = function(logger) {

    // Configuring routing and http server
    logger.info('> Initializing Web Router');
    webApiRouter.configure(global.config.router, logger);

    // loading Plugins
    logger.info('> Initializing Plugins');
    webApiRouter.loadPlugins();

    // loading APIs
    logger.info('> Initializing API');
    webApiRouter.loadAPI('main');
    webApiRouter.loadAPI('v1');

    // Starting router
    logger.info('> Initializing Routes');
    webApiRouter.start();
};

exports.stop = function(cb) {
    webApiRouter.stop(cb);
};

module.exports = exports;
