module.exports = {

    'security' : {

        // crypto settings
        'passwords': {
            'hashed'    : true,
            'algorithm' : 'sha1',
            'format'    : 'hex'
        },

        // token settings
        'token': {
            'secret'     : 'THEMOSTHIDESECRETOFsicredi',
            'algorithm'  : 'HS256',
            'expiration' : 20080
        }

    }
};
