const _ = require('lodash');
const { post } = require('request');
const handleCallback = require('../utils/handleCallback');

module.exports = (res, request) => {
    var body = request;
    const params =  {
        body,
        json: true,
        url: "https://api.sphere.io/specsavers-ctp-uk-dev/payments",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 0vRoMmJuiGd7Gi-mMtBNST12SHNT6vnl'
        }
    };

    post(params, (err, response, body) => handleCallback({ err, response, body }, res));
};
