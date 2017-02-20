/* jslint node:true, esnext:true */
'use strict';

var https = require('https'),
    querystring = require('querystring');

class Betfair {

    constructor(appKey, username, password) {
        this.appKey = appKey;
        this.authKey = '';
        this.username = username || '';
        this.password = password || '';

        this.login();
    }

    login (username, password) {
        this.request('identitysso.betfair.com', '/api/login', 'application/x-www-form-urlencoded', {
            username: username || this.username,
            password: password || this.password
        }).then((response) => {
            this.authKey = response.token;
        });
    }

    getEvents (filter) {
        return this.devApi('listEvents', {
            "filter": filter
        }).then((response) => {
            return response;
        });
    }

    getMarketCatalogue (filter, maxResults) {
        return this.devApi('listMarketCatalogue', {
            "filter": filter,
            "maxResults": maxResults
        }).then((response) => {
            return response;
        });
    }

    getMarketBook (marketIds,  priceProjection) {
        return this.devApi('listMarketBook', {
            "marketIds": marketIds,
            "priceProjection": priceProjection
        }).then((response) => {
            return response;
        });
    }

    devApi(method, params) {
        var def = [{
            "jsonrpc": "2.0",
            "method": "SportsAPING/v1.0/" + method,
            "params": params
        }];
        return this.request('developers.betfair.com', '/api.betfair.com/exchange/betting/json-rpc/v1', 'text/plain;charset=UTF-8', JSON.stringify(def));
    }

    request (host, path, contentType, params) {
        return new Promise((resolve, reject) => {
            var options = {
                    host: host,
                    path: path,
                    port: 443,
                    method: 'POST',
                    headers: {
                        'Content-Type': contentType,
                        'X-Application': this.appKey,
                        'Accept': 'application/json'
                    }
                },
                httpReq;
            if (contentType === 'application/x-www-form-urlencoded') {
                params = querystring.stringify(params);
                options.headers['Content-Length'] = params.length;
            }

            if (this.authKey) {
                options.headers['X-Authentication'] = this.authKey;
            }

            httpReq = https.request(options, function (res) {
                var data = '';
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    data += chunk;
                });
                res.on('end', function () {
                    var response = JSON.parse(data);
                    if (response) {
                        resolve(response);
                    } else {
                        reject();
                    }
                });
            });
            httpReq.write(params);
            httpReq.end();
        });
    }
}

module.exports = Betfair;
