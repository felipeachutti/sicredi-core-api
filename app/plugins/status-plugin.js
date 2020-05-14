'use strict';

const plugin = require('hapi-routes-status');

exports.register = function (server, options, next) {

    // registering plugin if conditions enable it...
    if (options.enabled) {

        server.register({ 'register': plugin }, function (err) {

            if (err) throw err;

            // finishing reistration
            next();
        });
    } else {

        // finishing reistration
        next();
    }
};

exports.options = {
    'enabled': global.config.debug.active
};

exports.register.attributes = {
    'pkg': require('./status-package.json')
};
