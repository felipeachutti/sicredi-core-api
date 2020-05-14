'use strict';

const Joi  = require('joi');
const Hoek = require('hoek');

Joi.objectId = require('joi-objectid')(Joi);

exports.general_template = {
    'tags'       : ['v1', 'sicredi', 'schedule'],
    'description': 'schedule routes',
    'notes'      : 'API to schedule by Sicredi Core.',
    'auth'       : false
};

exports.post_config = function () {
    const config = Hoek.clone(exports.general_template);

    // adding validation clause
    config.validate = {
        'payload': {
            'subjectSchedule'   : Joi.string().required()
        }
    };

    // allowing all unknown fields
    config.validate.options = {
        'allowUnknown' : true
    };

    // returning config
    return config;
};

exports.get_config = function () {
    const config = Hoek.clone(exports.general_template);

    // validating parameters
    config.validate = {};

    config.validate.params = {
        'id': Joi.objectId().optional()
    };

    config.validate.options = {
        'allowUnknown' : true
    };

    // returning config
    return config;
};

exports.patch_config = function () {
    const config = Hoek.clone(exports.general_template);

    config.validate = {
        'payload': {
            'durationTimeInMinute'  : Joi.number().optional(),
            'vote'  : Joi.string().optional()
        },
        'params': {
            'id': Joi.objectId().required(),
            'cpf' : Joi.string().optional()
        }
    };

    // returning config
    return config;
};