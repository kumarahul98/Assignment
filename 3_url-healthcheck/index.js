const fetch = require('node-fetch');
const AWS = require('aws-sdk');

const healthCheck = async (url) => {
    try {
        const res = await fetch(url);
        console.log(res);
        return res.status;

    }
    catch (err) {
        console.log(err);
    }
};

const notificatio = async (status) => {
    try {
        const message = {
            Message: `Website is down!!!`,
            TopicArn: 'arn:aws:sns:us-east-1:113327471445:url-healthcheck'
        };
        await AWS.sns().publish(message);
    }
    catch (err) {
        console.log(err);
    }
};

healthCheck('https://ggg.com');

exports.handler = async (event) => {
    const response = {};
    const status = healthCheck('https://www.google.com/');
    console.log(status);
    if (status === '200') {
        response = {
            statusCode: 200,
            body: JSON.stringify('website is up....'),
        };
    }
    else {
        console.log(`Website is down with Error code: ${status}`);
        notificatio(status);
    }
    return response;
};