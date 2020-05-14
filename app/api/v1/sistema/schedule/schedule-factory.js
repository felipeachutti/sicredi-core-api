'use strict';

let
    moment = require('moment');

function PeopleFactory(request, method) {
    if (method === 'patch') {
        request.payload.durationTimeInMinute  =   request.payload.hasOwnProperty('durationTimeInMinute') ? moment().add(request.payload.durationTimeInMinute, 'minutes').format() : moment().add(1, 'minutes').format();
        request.payload.createDate    = moment().format();

        return request.payload;
    }
}

module.exports = PeopleFactory;