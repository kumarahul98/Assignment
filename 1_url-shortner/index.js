const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB();
const table = "testing-short";

const addItem = async (url) => {
    const short_url = await Math.floor(new Date().getTime() / 1000);

    const params = {
        TableName: table,
        Item: {
            "short_url": { "S": '' + short_url },
            "url": { "S": url },
        }
    };

    try {
        console.log("Adding a new item...");
        let res = await docClient.putItem(params).promise();
        console.log("res: ", res);
        return short_url;
    }
    catch (e) {
        console.log("error", e);
        return e;
    }

};

const getTtem = async (short_url) => {
    console.log(short_url);
    short_url = short_url.slice(1);
    console.log(short_url);
    let param = {
        KeyConditionExpression: "short_url = :v1",
        ExpressionAttributeValues: {
            ":v1": {
                S: short_url
            }
        },
        TableName: table
    };
    try {
        console.log("entering try");
        let ans = await docClient.query(param).promise();
        return ans.Items[0].url.S;
    }
    catch (e) {
        console.log("error", e);
    }
};
const urlValidation = (url) => {
    let regex = "^https:\/\/.*\..*";
    console.log("url", url);
    if (url.match(regex)) {
        return false;
    }
    else {
        return true;
    }
};
exports.handler = async (event) => {
    let response = '';

    let host = event.headers.host;
    if (event.requestContext.http.method === 'GET' && event.rawPath !== '/url-short') {
        response = await getTtem(event.rawPath);
        return {
            statusCode: 301,
            headers: {
                Location: response
            }
        };
    }
    else if (event.requestContext.http.method === 'POST') {
        console.log("1event", event);
        console.log(JSON.stringify("2event", event));
        if (urlValidation(JSON.parse(event.body).url)) {
            return {
                statusCode: 400,
                body: "url example 'https://www.google.com'"
            };
        }
        response = `${host}/` + await addItem(JSON.parse(event.body).url);
        return {
            statusCode: 200,
            body: response
        };
    }

};