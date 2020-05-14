'use strict';

exports.register = require('inert');
exports.options = {};
exports.register.attributes = {
    'pkg': require('./inert-package.json')
};
