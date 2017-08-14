/* jslint node:true, esnext:true */
'use strict';

var https = require('https'),
    querystring = require('querystring');

class Betfair {

    /**
     * @contructor
     * @param {string} appKey - Betfair application key
     * @param {string} [username] - Betfair username
     * @param {string} [password] - Betfair password
     * @param {boolean} [keepAlive=false] - Keep token alive till logout
     */
    constructor(appKey, username, password, keepAlive) {
        this.appKey = appKey;
        this.authKey = '';
        this.username = username || '';
        this.password = password || '';
        this.keepAlive = keepAlive || false;
        this.keepAliveTimeout = 3600000;
        this.locale = 'en';

        this.login();
    }

    /**
     * @param {string} [username] - Betfair username
     * @param {string} [password] - Betfair password
     * @param {boolean} [keepAlive] - Keep token alive till logout
     */
    login (username, password, keepAlive) {
        this.keepAlive = keepAlive || this.keepAlive;

        return this.request('identitysso.betfair.com', '/api/login', 'application/x-www-form-urlencoded', {
            username: username || this.username,
            password: password || this.password
        }).then((response) => {
            this.authKey = response.token;
            if (this.keepAlive) {
                setTimeout(() => {
                    this.keepAliveReset();
                }, this.keepAliveTimeout);
            }
        });
    }

    logout () {
        this.keepAlive = false;
        return this.request('identitysso.betfair.com', '/api/logout');
    }

    keepAliveReset () {
        if (this.keepAlive) {
            this.request('identitysso.betfair.com', '/api/keepAlive').then((response) => {
                if (response.status === 'FAIL') {
                    this.login();
                } else {
                    setTimeout(() => {
                        this.keepAliveReset();
                    }, this.keepAliveTimeout);
                }
            });
        }
    }

    /**
     * @param {object} filter - Filter options (refer to betfair docs)
     * @return {Promise<Array>} - Promise that resolves with the results in an array
     */
    listCompetitions (filter) {
        return this.devApi('listCompetitions', {
            "filter": filter,
            "locale": this.locale
        }).then((response) => {
            return response;
        });
    }

    /**
     * @param {object} filter - Filter options (refer to betfair docs)
     * @return {Promise<Array>} - Promise that resolves with the results in an array
     */
    listCountries (filter) {
        return this.devApi('listCountries', {
            "filter": filter,
            "locale": this.locale
        }).then((response) => {
            return response;
        });
    }

    /**
     * @param {object} [params] - optional parameters (refer to betfair docs)
     */
    listCurrentOrders (params = {}) {
        return this.devApi('listCurrentOrders', params).then((response) => {
            return response;
        });
    }

    /**
     * @param {object} [params] - optional parameters (refer to betfair docs)
     * @return {Promise<Array>} - Promise that resolves with the results in an array
     */
    listClearedOrders (params) {
        return this.devApi('listClearedOrders', params).then((response) => {
            return response;
        });
    }
    
    /**
     * @param {object} filter - Filter options (refer to betfair docs)
     * @return {Promise<Array>} - Promise that resolves with the results in an array
     */
    listEvents (filter) {
        return this.devApi('listEvents', {
            "filter": filter,
            "locale": this.locale
        }).then((response) => {
            return response;
        });
    }
    
    /**
     * @param {object} filter - Filter options (refer to betfair docs)
     * @return {Promise<Array>} - Promise that resolves with the results in an array
     */
    listEventTypes (filter) {
        return this.devApi('listEventTypes', {
            "filter": filter,
            "locale": this.locale
        }).then((response) => {
            return response;
        });
    }
    
    /**
     * @param {array} marketIds - array of market ids
     * @param {object} opts - optional parameters (refer to betfair docs)
     * @return {Promise<Array>} - Promise that resolves with the results in an array
     */
    listMarketBook (marketIds, opts = {}) {
        return this.devApi('listMarketBook', Object.assign({
            "marketIds": marketIds,
            "locale": this.locale
        }, opts)).then((response) => {
            return response;
        });
    }
    
    /**
     * @param {number} marketIds
     * @param {number} selectionId
     * @param {object} opts - optional parameters (refer to betfair docs)
     * @return {Promise<Array>} - Promise that resolves with the results in an array
    */
    listRunnerBook (marketId, selectionId, opts = {}) {
        return this.devApi('listRunnerBook', Object.assign({
            "marketIds": marketId,
            "selectionId": selectionId,
            "locale": this.locale
        }, opts)).then((response) => {
            return response;
        });
    }
    
    /**
     * @param {object} filter - Filter options (refer to betfair docs)
     * @param {number} maxResults - result limit (greater than 0 less than a 1000)
     * @param {object} opts - optional parameters (refer to betfair docs)
     * @return {Promise<Array>} - Promise that resolves with the results in an array
     */
    listMarketCatalogue (filter, maxResults, opts = {}) {
        return this.devApi('listMarketCatalogue', Object.assign({
            "filter": filter,
            "maxResults": maxResults,
            "locale": this.locale
        }, opts)).then((response) => {
            return response;
        });
    }
    
    /**
     * @param {object} [params] - optional parameters (refer to betfair docs)
     * @return {Promise<Array>} - Promise that resolves with the results in an array
     */
    listMarketProfitAndLoss (params = {}) {
        return this.devApi('listMarketProfitAndLoss', params).then((response) => {
            return response;
        });
    }
    
    /**
     * @param {object} filter - Filter options (refer to betfair docs)
     * @return {Promise<Array>} - Promise that resolves with the results in an array
     */
    listMarketTypes (filter) {
        return this.devApi('listMarketTypes', {
            "filter": filter,
            "locale": this.locale
        }).then((response) => {
            return response;
        });
    }
    
    /**
     * @param {object} filter - Filter options (refer to betfair docs)
     * @param {string} granularity - DAYS/HOURS/MINUTES
     * @return {Promise<Array>} - Promise that resolves with the results in an array
     */
    listTimeRanges (filter, granularity) {
        return this.devApi('listTimeRanges', {
            "filter": filter,
            "granularity": granularity,
            "locale": this.locale
        }).then((response) => {
            return response;
        });
    }
    
    /**
     * @param {object} filter - Filter options (refer to betfair docs)
     * @return {Promise<Array>} - Promise that resolves with the results in an array
     */
    listVenues (filter) {
        return this.devApi('listVenues', {
            "filter": filter,
            "locale": this.locale
        }).then((response) => {
            return response;
        });
    }

    /**
     * @param {string} marketId - Id of market to bet in
     * @param {array<Object>} instructions - Array of placeInstruction objects {@link Betfair.buildPlaceInstruction}
     * @param {object} opts - optional parameters (refer to betfair docs)
     */
    placeOrders (marketId, instructions, opts = {}) {
        return this.devApi('placeOrders', Object.assign({
            marketId: marketId,
            instructions: instructions,
            "locale": this.locale
        }, opts)).then((response) => {
            return response;
        });
    }

    /**
     * @param {string} marketId - Id of market bet was made
     * @param {array<Object>} instructions - Array of placeInstruction objects {@link Betfair.buildCancelInstruction}
     * @param {object} opts - optional parameters (refer to betfair docs)
     */
    cancelOrders (marketId, instructions, opts = {}) {
        return this.devApi('cancelOrders', Object.assign({
            marketId: marketId,
            instructions: instructions,
            "locale": this.locale
        }, opts)).then((response) => {
            return response;
        });
    }

    /**
     * @param {string} marketId - Id of market bet was made
     * @param {array<Object>} instructions - Array of placeInstruction objects {@link Betfair.buildUpdateInstruction}
     * @param {object} opts - optional parameters (refer to betfair docs)
     */
    updateOrders (marketId, instructions, opts = {}) {
        return this.devApi('updateOrders', Object.assign({
            marketId: marketId,
            instructions: instructions,
            "locale": this.locale
        }, opts)).then((response) => {
            return response;
        });
    }

    /**
     * @param {string} marketId - Id of market bet was made
     * @param {array<Object>} instructions - Array of placeInstruction objects {@link Betfair.buildReplaceInstruction}
     * @param {object} opts - optional parameters (refer to betfair docs)
     */
    replaceOrders (marketId, instructions, opts = {}) {
        return this.devApi('replaceOrders', Object.assign({
            marketId: marketId,
            instructions: instructions,
            "locale": this.locale
        }, opts)).then((response) => {
            return response;
        });
    }

    /**
     * @param {string} selectionId - Id of selection to bet on
     * @param {number} handicap - handicap, default=0
     * @param {string} orderType - LIMIT / LIMIT_ON_CLOSE / MARKET_ON_CLOSE
     * @param {string} side - BACK / LAY
     * @param {object} limitOrder - depending on orderType: {@link Betfair.buildLimitOrder} {@link Betfair.buildMarketOnCloseOrder} {@link Betfair.buildLimitOnCloseOrder}
     */
    static buildPlaceInstruction (selectionId, handicap, orderType, side, limitOrder) {
        let orderTypeDictionary = {
            LIMIT: 'limitOrder',
            LIMIT_ON_CLOSE: 'limitOnCloseOrder',
            MARKET_ON_CLOSE: 'marketOnCloseOrder'
        },
        instruction = {
            selectionId: selectionId,
            handicap: handicap || 0,
            orderType: orderType,
            side: side,
            limitOrder: limitOrder
        };
        instruction[orderTypeDictionary[orderType]] = limitOrder;
        return instruction;
    }

    static buildLimitOrder (size, price, persistenceType, timeInForce, minFillSize, betTargetType, betTargetSize) {
        return {
            size: size,
            price: price,
            persistenceType: persistenceType,
            timeInForce: timeInForce,
            minFillSize: minFillSize,
            betTargetType: betTargetType,
            betTargetSize: betTargetSize
        };
    }

    static buildMarketOnCloseOrder (liability) {
        return {
            liability: liability
        };
    }

    static buildLimitOnCloseOrder (liability, price) {
        return {
            liability: liability,
            price: price
        };
    }

    static buildReplaceInstruction(betId, newPrice) {
        return {
            betId: betId,
            newPrice: newPrice
        };
    }

    static buildCancelInstruction (betId, sizeReduction) {
        return {
            betId: betId,
            sizeReduction: sizeReduction
        };
    }

    static buildUpdateInstruction (betId, newPersistenceType) {
        return {
            betId: betId,
            newPersistenceType: newPersistenceType
        };
    }
    
    /**
     * @return {Promise<Array>} - Promise that resolves with the results in an array
     */
    getAccountDetails () {
        return this.accountsApi('getAccountDetails').then((response) => {
            return response;
        });
    }
    
    /**
     * @return {Promise<Array>} - Promise that resolves with the results in an array
     */
    getAccountFunds (wallet) {
        let params = {};
        if (wallet) {
            params.wallet = wallet;
        }
        return this.accountsApi('getAccountFunds', params).then((response) => {
            return response;
        });
    }
    
    /**
     * @return {Promise<Array>} - Promise that resolves with the results in an array
     */
    getDeveloperAppKeys () {
        return this.accountsApi('getDeveloperAppKeys').then((response) => {
            return response;
        }); 
    }
    
    /**
     * @param {object} params - options (refer to betfair docs)
     * @return {Promise<Array>} - Promise that resolves with the results in an array
     */
    getAccountStatement (params = {}) {
        return this.accountsApi('getAccountStatement', params).then((response) => {
            return response;
        }); 
    }

    /**
     * @param {string} fromCurrency - currency code
     * @return {Promise<Array>} - Promise that resolves with the results in an array
     */
    listCurrencyRates (fromCurrency) {
        let params = {};
        if (fromCurrency) {
            params.fromCurrency = fromCurrency;
        }
        return this.accountsApi('listCurrencyRates', params).then((response) => {
            return response;
        });
    }

    /**
     * @private
     * @param {string} method - api request method
     * @param {object} params - payload parameters
     */
    devApi (method, params) {
        var def = [{
            "jsonrpc": "2.0",
            "method": "SportsAPING/v1.0/" + method,
            "params": params
        }];
        return this.request('developers.betfair.com', '/api.betfair.com/exchange/betting/json-rpc/v1', 'text/plain;charset=UTF-8', JSON.stringify(def));
    }
    
    /**
     * @private
     * @param {string} method - api request method
     * @param {object} params - payload parameters
     */
    accountsApi (method, params) {
        var def = [{
            "jsonrpc": "2.0",
            "method": "AccountAPING/v1.0/" + method,
            "params": params
        }];
        return this.request('developers.betfair.com', '/api.betfair.com/exchange/account/json-rpc/v1', 'text/plain;charset=UTF-8', JSON.stringify(def));
    }

    /**
     * @private
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
                        'Content-Type': contentType || 'application/json',
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

                res.on('error', function (err) {
                    throw new Error(err);
                });
            });
            if (params) {
                httpReq.write(params);
            }
            httpReq.end();
        });
    }
}

module.exports = Betfair;
