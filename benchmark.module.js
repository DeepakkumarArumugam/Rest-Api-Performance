
var benchrest = require('bench-rest');



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
        var  flow = {
            'main': []
        };
        var  runOptions = {};
        var  requestObj = req.payload.requestObj;
        var  serviceTypeAndUrl = {};
        var  main = {};

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
                console.log('Failed in %s with err: ', ctxName, err);
            })
            .on('progress', function (stats, percent, concurrent, ips) {
                console.log('Progress: %s complete', percent);
            })
            .on('end', function (stats, errorCount) {

                var  response = {
                    'errorCount': errorCount,
                    'stats': stats
                };
                console.log(response);
                reply(response);
            });
    }
}