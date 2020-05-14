'use strict';

const crypto = require('crypto');

exports.getSalt = function () {
    return new Date().valueOf().toString();
};

exports.encrypt = function (value, saltValue, cb) {

    if (!value) return cb(null);

    if (typeof saltValue === 'function') {
        cb        = saltValue;
        saltValue = this.getSalt();
    }

    if (!saltValue)
        saltValue = this.getSalt();

    const
        salt   = saltValue,
        hmac   = global.config.security.passwords.algorithm,
        format = global.config.security.passwords.format;

    // Encryting information
    const cryptedValue = crypto.createHmac(hmac, salt).update(value).digest(format);

    // returning values
    return cb(cryptedValue, salt);
};

exports.encryptMd5 = (value) => {
    return require('crypto')
        .createHash(global.config.security.emailPassword.algorithm)
        .update(value)
        .digest(global.config.security.emailPassword.format);
};