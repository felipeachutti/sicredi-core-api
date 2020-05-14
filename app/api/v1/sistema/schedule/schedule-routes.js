'use strict';

const
    controller = require('./schedule-controller'),
    options    = require('./schedule-config');

module.exports = [

    {
        'method'  : [ 'GET' ],
        'path'    : '/api/v1/sistema/schedule',
        'handler' : controller.handle,
        'config'  : options.get_config()
    },

    {
        'method'  : [ 'GET' ],
        'path'    : '/api/v1/sistema/schedule/report/{id}',
        'handler' : controller.handle,
        'config'  : options.get_config()
    },

    {
        'method'  : [ 'POST' ],
        'path'    : '/api/v1/sistema/schedule',
        'handler' : controller.handle,
        'config'  : options.post_config()
    },

    {
        'method' : [ 'PATCH' ],
        'path'   : '/api/v1/sistema/schedule/{id}',
        'handler': controller.handle,
        'config' : options.patch_config()
    },

    {
        'method' : [ 'PATCH' ],
        'path'   : '/api/v1/sistema/schedule/{id}/user/{cpf}',
        'handler': controller.handle,
        'config' : options.patch_config()
    }
];
