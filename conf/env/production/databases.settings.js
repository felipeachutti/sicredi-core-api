'use strict';

module.exports = {

    'databases': {
        'log_tag'    : 'dbfactory',
        'connections': [

            {
                'name': 'sicredidb',
                'url' : 'mongodb://root:s1cr3d1@ds043477.mlab.com:43477/sicredi-digital-db'
            },

            {
                'name': 'drivedb',
                'url' : 'mongodb://root:s1cr3d1@ds043477.mlab.com:43477/sicredi-digital-db'
            }

        ]
    }
};
