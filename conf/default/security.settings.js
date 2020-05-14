module.exports = {
    'security' : {

        // generate password crypto settings
        'passwords': {
            'hashed'    : true,
            'algorithm' : 'sha1',
            'format'    : 'hex'
        },

        // recovery password hash crypto settings
        'recoveryHash': {
            'hashed'    : true,
            'algorithm' : 'sha1',
            'format'    : 'hex'
        },

        // token settings
        'token': {
            'secret'     : 'THEMOSTHIDESECRETOFsicredi',
            'algorithm'  : 'HS256',
            'expiration' : 7200
        },

    }
};
