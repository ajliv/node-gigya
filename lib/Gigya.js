const bindEndpoints = require('./utils/bind-endpoints');
const endpoints = require('./endpoints');
const GSException = require('./GSException');
const GSRequest = require('./GSRequest');
const SigUtils = require('./SigUtils');


class Gigya {
    constructor(apiKey, secretKey, config = {}) {
        this.apiKey = apiKey;
        this.secretKey = secretKey;
        this.config = config;
        bindEndpoints(this, endpoints);
    }

    request(endpoint, params) {
        const req = new GSRequest(this.apiKey, this.secretKey, endpoint, params);
        req.setAPIDomain(this.config.apiDomain);
        return req.send();
    }
}


Gigya.GSException = GSException;
Gigya.SigUtils = SigUtils;


module.exports = Gigya;
