'use strict';

const pkg = require('../../../../package.json');

exports.config = {
    'tags'        : [ 'main', 'debug' ],
    'description' : 'Debug route!',
    'notes'       : 'Provides details about environment. Needs debug flag set as true.',
    'auth'        : false
};

exports.handle = function debugHandle(request, reply) {

    const data = {
        'name'           : global.nodename,
        'kernel'         : global.config.kernel.process,
        'loaded_plugins' : global.plugins,
        'loaded_apis'    : global.apis,
        'loaded_routes'  : global.routes,
        'version'        : pkg.version,
        'environment'    : process.env
    };

    reply(data);
};
