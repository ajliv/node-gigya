module.exports = function bindEndpoints (gigya, endpoints) {
    endpoints.forEach(endpoint => {
        const [namespace, apiMethod] = endpoint.split('.');
        gigya[namespace] = gigya[namespace] || {};
        gigya[namespace][apiMethod] = gigya.request.bind(gigya, endpoint);
    });
};
