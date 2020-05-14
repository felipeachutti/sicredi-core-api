'use strict';

const pkg = require('../../../../package.json');

exports.config = {
    'tags'        : [ 'main', 'ping' ],
    'description' : 'Greetings route!',
    'notes'       : 'Ping route to check if server is up or not.',
    'auth'        : false
};

exports.handle = function rootHandle(request, reply) {

    request.log.info('Welcome to Sicredi Core Server!');

    const data = {
        'name'        : global.nodename,
        'version'     : pkg.version,
        'environment' : pkg.env,
        'tagline'     : pkg.description
    };

    reply(data);
};
