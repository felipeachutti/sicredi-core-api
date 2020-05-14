'use strict';

const
    path   = require('path'),
    lodash = require('lodash');

exports.targetEnv   = process.env.NODE_ENV || 'development';
exports.currentPath = __dirname; // eslint-disable-line

exports.create = function (engine) {

    let settings;

    // Kernel settings
    settings = lodash.assign(

        // Engine Settings
        require(path.join(this.currentPath, 'default', `${engine}.settings`)),

        // Debug Settings
        require(path.join(this.currentPath, 'default', 'debug.settings')),

        // Kernel Settings
        require(path.join(this.currentPath, 'default', 'kernel.settings')),

        // Logging Settings
        require(path.join(this.currentPath, 'default', 'logging.settings')),

        // Security Settings
        require(path.join(this.currentPath, 'default', 'security.settings')),

        // Database Settings
        require(path.join(this.currentPath, 'env', this.targetEnv, 'databases.settings'))

    );

    // Setting process name
    settings.kernel.process.title += `-${engine}`;

    // Explicit settings
    settings.root = path.normalize(`${this.currentPath}/../`);

    return settings;
};

module.exports = exports;
