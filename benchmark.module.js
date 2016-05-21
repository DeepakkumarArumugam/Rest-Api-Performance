"use strict"

const benchrest = require('bench-rest');

let flow = {'main':[]};
let runOptions = {};


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

    callBenchMark: function(req, reply) {
        let requestObj = req.payload.requestObj;
        let serviceTypeAndUrl = {};
        let main ={}; 
        
        main[requestObj.methodType]= requestObj.url;
        main.headers =  { 'uuid': '1234' };
        //main['headers'] = requestObj.headers;
        flow.main.push(main);
        //console.log(JSON.stringify(flow));  
        runOptions.iterations = requestObj.iterations;
        runOptions.limit = requestObj.limit;
        benchrest(flow, runOptions)
            .on('error', function(err, ctxName) { 
                console.error('Failed in %s with err: ', ctxName, err); 
               // reply('Failed in %s with err: ', ctxName, err);
            })
            .on('progress', function(stats, percent, concurrent, ips) {
                console.log('Progress: %s complete', percent);
            })
            .on('end', function(stats, errorCount) {
                console.log('error count: ', errorCount);
                console.log('stats', stats);
                reply(stats);
            });
    }


}


