'use strict';

const
    fsHelper   = require('./filesystem/fs-helper'),
    exit_codes = require('./literals/exit-codes');

let
    settings,
    logger;

exports.onCrash = function(err) {
    logger.fatal(err);
    fsHelper.error(err);

    process.exit(exit_codes.UNEXPECTED_EXCEPTION);
};

exports.boot = function(options, loggerObj) {

    // Configurando Log do Kernel
    logger = loggerObj.child({
        'widget_type':  options.log_tag
    });

    // Expondo configurações
    settings = options;

    logger.debug(`> Kernel - Reconnection status: ${settings.process.rebirth}`);

    // Definindo Titulo do Processo
    process.title = settings.process.title;

    // Eventos
    process.on('error', this.onCrash);
    process.on('uncaughtException', this.onCrash);
};

module.exports = exports;
