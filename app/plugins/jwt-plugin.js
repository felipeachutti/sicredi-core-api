'use strict';

const
    validator = require('./jwt-validator'),
    jwt       = require('hapi-auth-jwt2');

exports.validate = function (decoded, request, callback) {
    const token = request.headers.authorization;

    request.log.info(`> Validating JWT token: ${token}`);

    validator.check(token, callback);
};

exports.register = function (server, options, next) {
    const self = exports;

    // registering plugin
    server.register(jwt, function (err) {

        // error handling
        if (err) throw err;

        // adding strategy
        server.auth.strategy('jwt', 'jwt', true, {
            'key'          : options.secret,
            'validateFunc' : self.validate,
            'verifyOptions': {
                'algorithms': [ options.algorithm ]
            }
        });

        // finishing registration
        next();
    });
};

exports.options = global.config.security.token;

exports.register.attributes = {
    'pkg': require('./jwt-package.json')
};
