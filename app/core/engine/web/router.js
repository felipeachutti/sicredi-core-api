'use strict';

const
    lodash           = require('lodash'),
    hapi             = require('hapi'),
    helper           = require('../../filesystem/fs-helper');

let
    logger,
    settings,
    httpServer;

exports.configure = function(options, loggerObj) {

    // creating logger
    logger = loggerObj.child({
        'widget_type': options.log_tag
    });

    // saving configurations
    settings = options;

    // setting api store
    global.apis    = {};
    global.routes  = [];
    global.plugins = [];

    // creating app
    logger.info('> Initializing HTTP Server');

    // creating server
    httpServer = new hapi.Server(settings.server);
    httpServer.connection(settings.connection);

    // Exposing logger to HapiJS Plugins
    httpServer.app.logger = logger;
};

exports.addPlugin = function(pluginPath, pluginObj) {

    // Registering plugin
    httpServer.register(pluginObj, (err) => {
        if (err) {
            logger.error(`# Unexpected error initializing plugin: ${pluginPath}`);
            logger.error(`# Error output: ${err.stack}`);
        } else {
            // Saving plugin ref
            global.plugins.push(pluginPath);
        }
    });
};

exports.loadPlugins = function() {
    const
        self     = this,
        fullPath = `${global.config.root}${settings.plugins.folder}`;

    try {
        logger.info(`> Plugins folder's path: ${fullPath}`);

        if (httpServer) helper.walk(fullPath, settings.plugins.sufix, self.addPlugin);
        else logger.error(`# Error: router is not active!`);

    } catch (e) {
        logger.error(`# Unexpected error initializing plugin: ${fullPath}`);
        logger.error(`# Error output: ${e.stack}`);
    }
};

exports.addRoute = function(routePath, routeObj) {

    // handling function scenario
    if (lodash.isFunction(routeObj)) {
        routeObj(httpServer);
    } else {
        // registering route
        httpServer.route(routeObj);
    }

    // saving route path
    global.routes.push(routePath);
};

exports.loadAPI = function(path) {
    const
        self     = this,
        fullPath = `${global.config.root}app/api/${path}`;

    try {
        logger.info(`> Initializing API: ${path}`);
        logger.debug(`> Full path at: ${fullPath}`);

        if (httpServer) {

            // registering api - saving information for debugging
            global.apis[path] = true;

            // loading API
            helper.walk(fullPath, settings.file_sufix, self.addRoute);

        } else {
            logger.error(`# Error: router is not active!`);
        }
    } catch (e) {
        global.apis[path] = false;
        logger.error(`# Unexpected error when loading API ${path}`);
        logger.error(`# Error output: ${e.stack}`);
    }
};

exports.start = function() {

    try {
        logger.info('> Starting Core API Server');
        httpServer.start((err) => {

            if (err) {
                logger.error('# Error initializing Core API Server: ', err);
                return false;
            }

            logger.info(`> Environment name: ${process.env.NODE_ENV}`);
            logger.info(`> Enviroonment URL: ${httpServer.info.uri}`);
        });

    } catch (e) {
        logger.error('# Unexpected error initilizing Core API Server');
        logger.debug('# Error output: ', e);
        throw e;
    }
};

exports.stop = function (cb) {
    try {
        logger.info('> Shutting down Core API Server');
        httpServer.stop(cb);

    } catch (e) {
        logger.error('# Unexpected error when shutting down Core API Server');
        logger.error('# Error output: ', e);
    }
};

module.exports = exports;
