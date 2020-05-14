'use strict';

const WEB_SERVER_PORT = process.env.PORT || 5000;

module.exports = {

    'router': {

        'file_sufix'    : '-routes.js',
        'log_tag'       : 'router',

        'server': {
            'debug': {
                'request': [ 'error' ]
            }
        },

        'connection': {

            // RFC default is 80 or 443 (ssl)
            'port'   : WEB_SERVER_PORT,
            'host'   : '0.0.0.0',
            'labels' : [ 'api', 'web' ],
            'routes' : {
                'cors': true
            }
        },

        'plugins': {
            'folder' : 'app/plugins',
            'sufix'  : '-plugin.js'
        },

        // bunyan options
        'tracking': {

            // log reference
            'name' : 'router',

            // output streams
            'streams' : [

                // file output
                {
                    'path' : './logs/webapi.log',
                    'level' : 'debug'
                }
            ]
        }
    }
};
