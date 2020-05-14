'use strict';

const Boom = require('boom');

exports.register = function (server, options, next) {

    // intercepting all requests before route execution
    server.ext('onPreHandler', function (request, reply) {

        // getting uri
        const uri = request.url.path;

        // checking if it is a debug route AND debug is not enabled...
        if (uri.indexOf(options.pattern) !== -1 && !options.enabled) {

            // blocking request
            const response = Boom.notFound();

            request.log.warn('> Request intercepted by Debug Plugin');
            request.log.debug('> Response: ', response);

            return reply(response);
        }

        // in case of it is not a debug route, move forward
        reply.continue();
    });

    // finishing registration
    next();
};

exports.options = {
    'pattern': 'debug',
    'enabled': global.config.debug.active
};

exports.register.attributes = {
    'pkg': require('./debug-package.json')
};
