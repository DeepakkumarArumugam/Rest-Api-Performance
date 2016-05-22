/*jslint es6 */
/*global process, global, require*/
"use strict";

const Hapi = require('hapi');
const Good = require('good');
const Inert = require('inert');
const HapiSwagger = require('hapi-swagger');
const Vision = require('vision');
const Joi = require('joi');
const Pack = require('./package');
const bunyan = require('bunyan');
global.LOG = bunyan.createLogger({
    name: "Rest-Benchmark"
});
const benchMark = require('./benchmark.module');



const server = new Hapi.Server();
server.connection({
    port: process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3000,
    host:process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1",
    routes: {
        cors: true
    }

});
//Swagger options
const options = {
    info: {
        'title': 'API Documentation',
        'version': Pack.version,
        contact: {
            'name': 'Gunjan kumar'
        }
    }

};


server.route({
    method: 'POST',
    path: '/v1/benchMark',
    config: {
        handler: benchMark.callBenchMark

    }
});

server.register(Inert, function (err) {
    if (err) {
        throw err;
    };
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: './public',
                redirectToSlash: true,
                index: true
            }
        }
    });

});

server.register([Inert, Vision, {
    'register': HapiSwagger,
    'options': options
}], (err) => {
    if (err) {
        LOG.info(err);
    }
});

// Good console - Log messages
server.register(


    server.start(() => {
        LOG.info('info', 'Server running at: ' + server.info.uri);

    })
);