/*jslint es6 */
/*global module, console, LOG*/
"use strict";

const benchrest = require('bench-rest');



// var flow = {
//     before: [],      // operations to do before anything
//     beforeMain: [],  // operations to do before each iteration
//     main: [  // the main flow for each iteration, #{INDEX} is unique iteration counter token
//       { put: 'http://localhost:8000/foo_#{INDEX}', json: 'mydata_#{INDEX}' },
//       { get: 'http://localhost:8000/foo_#{INDEX}' }
//     ],
//     afterMain: [{ del: 'http://localhost:8000/foo_#{INDEX}' }],   // operations to do after each iteration
//     after: []        // operations to do after everything is done
//   };

var errors = [];

module.exports = {
    callBenchMark: function (req, reply) {
        let flow = {
            'main': []
        };
        let runOptions = {};
        let requestObj = req.payload.requestObj;
        let serviceTypeAndUrl = {};
        let main = {};

        main[requestObj.methodType] = requestObj.url;
        if (requestObj.payloadData != null) {
            main['json'] = JSON.parse(requestObj.payloadData);
        }
        if (requestObj.headers != null) {
            main.headers = JSON.parse(requestObj.headers);
        }

        flow.main.push(main);
        runOptions.iterations = requestObj.iterations;
        runOptions.limit = requestObj.limit;
        benchrest(flow, runOptions)
            .on('error', function (err, ctxName) {
                LOG.info('Failed in %s with err: ', ctxName, err);
            })
            .on('progress', function (stats, percent, concurrent, ips) {
                LOG.info('Progress: %s complete', percent);
            })
            .on('end', function (stats, errorCount) {

                let response = {
                    'errorCount': errorCount,
                    'stats': stats
                };
                LOG.info(response);
                reply(response);
            });
    }
}