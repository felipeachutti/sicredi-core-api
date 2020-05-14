'use strict';

const
    rootHandler  = require('./controllers/root'),
    debugHandler = require('./controllers/debug');

module.exports = [
    {
        'method'  : 'GET',
        'path'    : '/',
        'handler' : rootHandler.handle,
        'config'  : rootHandler.config
    },

    {
        'method'  : 'GET',
        'path'    : '/debug',
        'handler' : debugHandler.handle,
        'config'  : debugHandler.config
    }
];
