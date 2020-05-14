'use strict';

const
    ConfigFactory = require('../conf/factory'),
    kernel        = require('./core/kernel'),
    dbfactory     = require('./core/dao/dbfactory'),
    fsHelper      = require('./core/filesystem/fs-helper'),
    exit_codes    = require('./core/literals/exit-codes'),
    core_timeouts = require('./core/literals/core-timeouts'),
    logFactory    = require('bunyan');

let
    target_engine,
    engine,
    logger;

exports.configure = (currentEngine) => {

    // Engine definition
    target_engine       = currentEngine || 'webapi';
    global.gcore_engine = target_engine;

    // Getting engine contant settings
    const options = ConfigFactory.create(target_engine);

    // Loading engine interface
    engine = require(`./core/engine/interfaces/${target_engine}`);

    // Node name definition by Silly Name
    global.nodename = engine.generateNodeName();

    // Logtag name
    options.logging.options.name = global.nodename;

    // Getting pos analyzed engine settings
    return engine.configure(options);
};

exports.bootstrap = (boot_settings) => {

    // Carregando Globals da Engine referente
    global.config = boot_settings;

    // Criação da Pasta de Log
    fsHelper.folderAssurance(global.config.logging.folder);

    // Definindo objeto de Log
    logger = logFactory.createLogger(global.config.logging.options);
    logger.info('> Initializing Log');

    // Inicializando Kernel
    logger.info('> Initializing Kernel');
    kernel.boot(global.config.kernel, logger);

    // Inicializando DBFactory
    logger.info('> Initializing DBFactory');
    dbfactory.boot(global.config.databases, logger);
};

exports.run = function () {
    const self = this;

    // Setando maximo listeners para ilimitado
    process.setMaxListeners(0);

    // Criando conexões da DBFactory
    dbfactory.createConnections(global.config.databases.connections, function (err, connections) {

        // Gerenciamento de Erros
        if (err) {

            logger.fatal('# Unexpected error initiazling database connections, Core API Server going down..');
            process.exit(exit_codes.OPEN_DATABASE_CONNECTION_ERR);

        } else {

            // Tornando acesso à conexão Global
            global.db = connections;

            // Executando Engine
            logger.info(`> Initializing Engine ${target_engine}`);
            engine.run(logger);

            // Eventos de desligamento
            process
                .on('SIGINT', self.onShutdown)
                .on('SIGTERM', self.onShutdown);
        }
    });

};

exports.onShutdown = function () {

    // preventing of getting stuck
    const handler = setTimeout(function() {
        logger.warn('# Error getting Core API server down, it will be forced!');
        process.exit(exit_codes.CLOSE_CONNECTION_TIMEOUT);
    }, core_timeouts.SHUTDOWN_TIMEOUT);

    logger.info('> Kill command received (SIGINT | SIGTERM)');
    logger.info('> Getting Core API Server down');

    engine.stop(function() {

        dbfactory.closeAll();

        if (handler) clearTimeout(handler);

        logger.info('> Core API Server is finished');
    });
};

module.exports = exports;
