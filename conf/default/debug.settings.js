'use strict';

const DEBUG_MODE = process.env.SICREDI_IS_DEBUG || true;

module.exports = {
    'debug': {
        'active': DEBUG_MODE
    }
};
