'use strict';

const bunyan = require('bunyan');

exports.register = require('hapi-bunyan');

exports.options = {
    'logger': bunyan.createLogger(global.config.router.tracking)
};

exports.register.attributes = {
    'pkg': require('./bunyan-package.json')
};
