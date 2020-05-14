'use strict';

const
    os                      = require('os'),
    MAX_WORKERS             = process.env.SICREDI_CORE_WORKERS || os.cpus().length,
    CLUSTER_WORKERS_REBIRTH = true;

module.exports = {
    'kernel': {
        'log_tag': 'kernel',

        'process': {
            'title'      : 'PCORE',
            'maxWorkers' : MAX_WORKERS,
            'rebirth'    : CLUSTER_WORKERS_REBIRTH
        }
    }
};
