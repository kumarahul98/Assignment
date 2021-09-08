const axios = require('axios');


const get_short_url = async (url) => {
    const data = `{
      "url":${url}
    }`;
    let shortUrl = await axios.post('https://72mfwx5mw0.execute-api.us-east-1.amazonaws.com/url-short',data,{
      headers: {
        'content-type': 'application/json'
  }
});
    console.log("Short-Url:",shortUrl.data);
    return shortUrl.data;

};

module.exports = get_short_url;