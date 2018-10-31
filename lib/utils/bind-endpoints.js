"use strict";
module.exports = function bindEndpoints (gigya, endpoints) {
    endpoints.forEach(endpoint => {
        let nameSpaceApi = endpoint.split('.');
        gigya[nameSpaceApi[0]] = gigya[nameSpaceApi[0]] || {};
        gigya[nameSpaceApi[0]][nameSpaceApi[1]] = gigya.request.bind(gigya, endpoint);
    });
};
