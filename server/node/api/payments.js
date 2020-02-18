const { post } = require('request');
const getPostParameters = require('../utils/getPostParameters');
const handleCallback = require('../utils/handleCallback');

module.exports = (res, request) => {
    console.log('request: ', request);
    console.log("inainte de getPostParameters");

    const params = getPostParameters('/payments', request);
    console.log("inainte de post; params = " + params);

    post(params, (err, response, body) => handleCallback({ err, response, body }, res));
    debugger
    console.log("a facut post; res.data = " + res);
    console.log("a facut post; request.data = " + request.body);
};
