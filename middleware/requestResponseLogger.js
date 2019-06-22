'use strict';

const onHeaders = require('on-headers');

module.exports = function() {
    return function (req, res, next) {
        let start = Date.now();
        let request_id = req.get('x-request-id') || null;
        let sourceIP = req.headers['x-forwarded-for'] || (req.connection ? req.connection.remoteAddress : null);
        onHeaders(res, function() {
            let respTime = Date.now() - start;
            let reqLog = {
                httpMethod: req.method,
                url: req.url,
                status: res.statusCode,
                statusMessage: '',
                responseTimeInMillis: respTime,
                request_id: request_id,
                sourceIP: sourceIP
            };
            console.log('Inbound request', JSON.stringify(reqLog));
        });

        next(); // make sure we go to the next routes and don't stop here
    };
};
