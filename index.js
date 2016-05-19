"use strict";
const Hapi = require('hapi');
const Good = require('good');
const Inert = require('inert');
const HapiSwagger = require('hapi-swagger');
const Vision = require('vision');
const Joi = require('joi');
const Pack = require('./package');
const bunyan = require('bunyan');
global.LOG = bunyan.createLogger({name: "Rest-Benchmark"});
const benchMark = require('./benchmark.module');
const baseUrl = 'https://service-hde-capacity-dashboard-dev.apps-np.homedepot.com/service/v1/capacityDashboard/';
let flow;
flow = {
    main: [{
        get: baseUrl + 'division',
        headers: { 'uuid': '#{INDEX}' }
    }

    ]
}
var runOptions = {
    limit: 10,         // concurrent connections 
    iterations: 10,  // number of iterations to perform 
    prealloc: 100      // only preallocate up to 100 before starting 
};

//benchMark.callBenchMark(flow, runOptions);



const server = new Hapi.Server();
server.connection({
    port:3000,
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

server.register(Inert, function(err) {
    if (err) throw err;
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
        console.log('info', 'Server running at: ' + server.info.uri);

    })
);
