const fetch = require('node-fetch');
const qs = require('qs');
const url = require('url');

const GSException = require('./GSException');
const SigUtils = require('./SigUtils');


function isObject(value) {
    var type = typeof value;
    return !!value && (type == 'object' || type == 'function');
}


class GSRequest {
    constructor(apiKey, secretKey, apiMethod, params) {
        if (!apiMethod) {
            const err = new GSException('Missing API Method');
            err.status = 400;
            throw err;
        }
        if (apiMethod.charAt(0) === '/') {
            apiMethod = apiMethod.slice(1);
        }
        if (apiMethod.indexOf('.') === -1) {
            this.domain = 'socialize.gigya.com';
            this.path = `/socialize.${apiMethod}`;
        } else {
            const [namespace, method] = apiMethod.split('.');
            this.domain = `${namespace}.gigya.com`;
            this.path = `/${namespace}.${method}`;
        }
        this.method = apiMethod;
        this.params = Object.assign({}, params);
        this.apiDomain = GSRequest.DEFAULT_API_DOMAIN;
        this.apiKey = apiKey;
        this.secretKey = secretKey;
    }

    send() {
        const params = Object.assign({ format: 'json' }, this.params);
        params.timestamp = Math.round(Date.now() / 1000);
        params.nonce = Date.now();
        params.apiKey = this.apiKey;

        if (this.method.indexOf('.') === -1) {
            this.host = `socialize.${this.apiDomain}`;
            this.path = `/socialize.${this.method}`;
        } else {
            const [namespace] = this.method.split('.');
            this.host = `${namespace}.${this.apiDomain}`;
            this.path = `/${this.method}`;
        }
        if (!this.method || !this.apiKey) {
            const err = new GSException('Invalid request');
            err.status = 400;
            return Promise.reject(err);
        }
        const baseURI = `https://${this.host}${this.path}`;
        params.sig = GSRequest.getOAuth1Signature(this.secretKey, 'POST', baseURI, params);

        const resourceURI = `${baseURI}?${qs.stringify(params)}`;
        const request = fetch(resourceURI, {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            form: params
        })
        .then(response => response.json())
        .then(response => {
            if (response.errorCode !== 0) {
                const err = new GSException(response.errorMessage);
                err.response = response;
                err.status = Math.floor(response.errorCode / 1000);
                throw err;
            }
            return response;
        });
        return request;
    }

    setAPIDomain(apiDomain) {
        this.apiDomain = apiDomain || GSRequest.DEFAULT_API_DOMAIN;
    }
}


GSRequest.DEFAULT_API_DOMAIN = 'us1.gigya.com';


GSRequest.calcOAuth1BaseString = (httpMethod, resourceURI, params) => {
    const { host, pathname, protocol } = url.parse(resourceURI);
    const baseURL = (`${protocol}//${host}${pathname}`);
    const queryString = Object.keys(params)
        .sort((a, b) => a.toLowerCase() > b.toLowerCase())
        .map(key => {
            const param = params[key];
            const val = (Array.isArray(param) || isObject(param)) ? JSON.stringify(param) : param;
            return `${key}=${GSRequest.URLEncode(val)}`
        });
    return `${httpMethod.toUpperCase()}&${GSRequest.URLEncode(baseURL)}&${GSRequest.URLEncode(queryString.join('&'))}`;
};


GSRequest.getOAuth1Signature = (key, httpMethod, resourceURI, params) => {
    const baseString = GSRequest.calcOAuth1BaseString(httpMethod, resourceURI, params);
    return SigUtils.calcSignature(baseString, key);
};


GSRequest.URLEncode = (value) => {
    return encodeURIComponent(value).replace('%7E', '~');
};


module.exports = GSRequest;
