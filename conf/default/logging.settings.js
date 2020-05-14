'use strict';

const LOG_FOLDER = process.env.SICREDI_LOG_FOLDER || './logs';

module.exports = {

    // logging settings
    'logging': {

        // destination folder
        'folder': LOG_FOLDER,

        // bunyan options
        'options': {

            // log reference
            'name' : 'sicredi-core-server',

            // output streams
            'streams' : [

                // console output
                {
                    'stream': process.stdout,
                    'level': 'debug'
                },

                // file output
                {
                    'path' : `${LOG_FOLDER}/sicredi-core-server.log`,
                    'level' : 'debug'
                }
            ]
        }
    }
};
