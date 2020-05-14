'use strict';

const
    Boom            = require('boom'),
    validCpf        = require('@brazilian-utils/is-valid-cpf'),
    factory         = require('./schedule-factory'),
    ObjectID        = require('mongodb').ObjectID,
    model           = require('./schedule-model');

let
    moment = require('moment');

exports.handle = function (request, reply) {
    const self = exports;
    let handler = `_${request.method}`;

    switch (true) {
    case request.path.indexOf('user') > 0 && request.method === 'patch':
        handler = `_${request.method}_user`;
        break;
    case request.path.indexOf('report') > 0 && request.method === 'get':
        handler = `_${request.method}_report`;
        break;
    }

    // running handler
    self[handler](request, reply);
};

exports._post = function (request, reply) {

    let
        req;

    try {
        model.insert(request.payload, function (err, entity) {
            if (err) {
                req.log.error('Error: ', err);
                return reply(err);
            }
            reply(entity);
        });
    } catch (err) {
        return Boom.wrap(err);
    }
};

exports._get = function (request, reply) {
    return model.find(reply);
};

exports._get_report = function (request, reply) {

    let
        yes = 0,
        no = 0,
        total = 0,
        data = {},
        id = new ObjectID(request.params.id);
    
    model.findById(id, function (err, objSchedule) {
        if (err) return Boom.wrap(err);

        if (!objSchedule) {
            return reply(Boom.badRequest("Pauta com ID: " + request.params.id + " não encontrado."));
        }

        yes = (objSchedule.vote || []).filter(x => x.vote == 'sim').length;
        no = (objSchedule.vote || []).filter(x => x.vote == 'nao').length;

        total = yes + no;

        data = { 
            "Sim": yes,
            "Não": no,
            "Total": total
        };

        reply(data).code(201)
    });
};

exports._patch = function (request, reply) {

    let
        query = {},
        id = new ObjectID(request.params.id);

    request = factory(request, 'patch');

    query = {
        '_id': id,
        '$set' : request        
    };

    model.update(query, function (err, entity) {

        if (err) {
            return Boom.wrap(err);
        }

        reply(entity);
    });
};

exports._patch_user = function (request, reply) {

    let
        query = {},
        queryCheckCpf = {},
        cpf = request.params.cpf,
        vote = request.payload.vote,
        id = new ObjectID(request.params.id);

    query = {
        '_id': id,
        '$push': {
            'vote': {
                'cpf': cpf,
                'vote' : vote.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            }
        }    
    };

    model.findById(id, function (err, objSchedule) {
        if (err) return Boom.wrap(err);

        // Valida se a pauta já foi fializada      
        if (moment(objSchedule.durationTimeInMinute).format() < moment().format()) {
            return reply(Boom.locked("A sessão de votação da pauta ID: " + id + " foi finalizada as: " + moment(objSchedule.durationTimeInMinute).format("YYYY-MM-DD HH:mm:ss")));
        } else {

            // Verifica se CPF é válido
            if(!validCpf.isValidCpf(cpf)) {
                return reply(Boom.badRequest("CPF " + cpf + " é inválido"));
            }

            // Verifica se o CPF já efetuou um voto
            queryCheckCpf = {
                '_id' : id,
                '$and' : [
                    { 'vote': { '$exists' : true } },
                    { 'vote.cpf': cpf}
                ]
            };
            model.findOneCpf(queryCheckCpf, function (err, CpfCheck) {
                if (err) return Boom.wrap(err);

                if(CpfCheck) {
                    return reply(Boom.locked("CPF " + cpf + " já votou nesta pauta"));
                }

                // Vota
                model.update(query, function (err, entity) {
                    if (err) return Boom.wrap(err);
    
                    reply(entity);
                }); 

            });

        }


    });
};

module.exports = exports;