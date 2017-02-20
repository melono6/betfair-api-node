/* jslint node:true, esnext:true */
'use strict';

var https = require('https'),
    querystring = require('querystring');

class Betfair {

    /**
     * @contructor
     * @param {string} appKey
     * @param {string} [username]
     * @param {string} [password]
     */
    constructor(appKey, username, password) {
        this.appKey = appKey;
        this.authKey = '';
        this.username = username || '';
        this.password = password || '';

        this.login();
    }

    /**
     * @param {string} [username]
     * @param {string} [password]
     */
    login (username, password) {
        this.request('identitysso.betfair.com', '/api/login', 'application/x-www-form-urlencoded', {
            username: username || this.username,
            password: password || this.password
        }).then((response) => {
            this.authKey = response.token;
        });
    }

    /**
     * @param {object} filter - Filter options (refer to betfair docs)
     */
    getEventTypes (filter) {
        return this.devApi('listEventTypes', {
            "filter": filter
        }).then((response) => {
            return response;
        });
    }

    /**
     * @param {object} filter - Filter options (refer to betfair docs)
     */
    getCompetitions (filter) {
        return this.devApi('listCompetitions', {
            "filter": filter
        }).then((response) => {
            return response;
        });
    }

    /**
     * @param {object} filter - Filter options (refer to betfair docs)
     * @param {string} granularity - DAYS/HOURS/MINUTES
     */
    getTimeRanges (filter, granularity) {
        return this.devApi('listTimeRanges', {
            "filter": filter,
            "granularity": granularity
        }).then((response) => {
            return response;
        });
    }

    /**
     * @param {object} filter - Filter options (refer to betfair docs)
     */
    getEvents (filter) {
        return this.devApi('listEvents', {
            "filter": filter
        }).then((response) => {
            return response;
        });
    }

    /**
     * @param {object} filter - Filter options (refer to betfair docs)
     */
    getMarketTypes (filter) {
        return this.devApi('listMarketTypes', {
            "filter": filter
        }).then((response) => {
            return response;
        });
    }

    /**
     * @param {object} filter - Filter options (refer to betfair docs)
     */
    getCountries (filter) {
        return this.devApi('listCountries', {
            "filter": filter
        }).then((response) => {
            return response;
        });
    }

    /**
     * @param {object} filter - Filter options (refer to betfair docs)
     */
    getVenues (filter) {
        return this.devApi('listVenues', {
            "filter": filter
        }).then((response) => {
            return response;
        });
    }

    /**
     * @param {object} filter - Filter options (refer to betfair docs)
     * @param {string} maxResults - Filter options (refer to betfair docs)
     * @todo add opts object for optional args
     */
    getMarketCatalogue (filter, maxResults) {
        return this.devApi('listMarketCatalogue', {
            "filter": filter,
            "maxResults": maxResults
        }).then((response) => {
            return response;
        });
    }

    /**
     * @param {array} marketIds - array of market ids
     * @param {number} maxResults - number of max results to return
     * @todo add opts object for optional args, move priceProjection into it
     */
    getMarketBook (marketIds,  priceProjection) {
        return this.devApi('listMarketBook', {
            "marketIds": marketIds,
            "priceProjection": priceProjection
        }).then((response) => {
            return response;
        });
    }

    /**
     * @param {object} [params] - optional parameters (refer to betfair docs)
     */
    getMarketProfitAndLoss (params) {
        return this.devApi('listMarketProfitAndLoss', params || {}).then((response) => {
            return response;
        });
    }

    /**
     * @param {object} [params] - optional parameters (refer to betfair docs)
     */
    getCurrentOrders (params) {
        return this.devApi('listCurrentOrders', params).then((response) => {
            return response;
        });
    }

    /**
     * @param {object} [params] - optional parameters (refer to betfair docs)
     */
    getClearedOrders (params) {
        return this.devApi('listClearedOrders', params).then((response) => {
            return response;
        });
    }

    // placeOrders

    // cancelOrders

    // replaceOrders

    // placeOrders

    devApi(method, params) {
        var def = [{
            "jsonrpc": "2.0",
            "method": "SportsAPING/v1.0/" + method,
            "params": params
        }];
        return this.request('developers.betfair.com', '/api.betfair.com/exchange/betting/json-rpc/v1', 'text/plain;charset=UTF-8', JSON.stringify(def));
    }

    /**
     * @param {string} host - hostname of endpoint
     * @param {string} path - path of endpoint
     * @param {string} contentType - content type of payload
     * @param {object} params - payload
     */
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
