'use strict';

/* JTW DOCS: https://github.com/auth0/node-jsonwebtoken */
const jwt = require('jsonwebtoken');

/**
 * [issueToken description]
 * @param  {[type]} payload [could be an literal, buffer or string]
 * @return {[type]}         [Returns the JsonWebToken as string]
 */
module.exports.issueToken = function (payload) {

    const options = global.config.security,

        token = jwt.sign(
            payload,

            /* string or buffer containing either the secret for HMAC algorithms,
            or the PEM encoded private key for RSA and ECDSA*/
            options.token.secret,

            /* options:
                * algorithm (default: HS256)
                * expiresInMinutes or expiresInSeconds
                * audience
                * subject
                * issuer
                * noTimestamp
                * headers
                * 'expiresIn': options.token.expiration = 7200 * 60
            */

            {
                'algorithm': options.token.algorithm,
                'expiresIn': '7 days'
            }
        );

    return {'token': token};
};

module.exports.decodeToken = function (token) {
    return jwt.decode(token);
};