const parser = require('lambda-multipart-parser');
const fs = require('fs');
const s3Upload = require('./s3-upload');
const resize = require('./image-resize');
const get_short_url = require('./url-shortner');
exports.handler = async (event) => {
	// TODO implement

	try {
		const parsedEvent = await parser.parse(event);
		console.log({ parsedEvent });
		const resolution = JSON.parse(parsedEvent.resolution);
		let height = Number(resolution.height);
		let width = Number(resolution.width);
		const filename = parsedEvent.files[0].filename;
		fs.writeFileSync(`/tmp/1${filename}`, parsedEvent.files[0].content);
		await resize(height, width, filename);
		const res = await s3Upload(filename, parsedEvent.files[0].contentType);
		const shor_url = await get_short_url(JSON.stringify(res));
		console.log('before response: ', res);
		const response = {
			statusCode: 200,
			body: `Response: ${shor_url}`,
		};
		return response;
	} catch (err) {
		console.log(err);
	}
};

