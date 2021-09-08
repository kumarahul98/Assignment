//s3 upload
const AWS = require('aws-sdk');
const fs = require('fs');

const documentUpload = async (filename, contentType) => {
    console.log("Uploadin Image.................");
	const s3 = new AWS.S3();
	try {
		let data = fs.readFileSync(`/tmp/${filename}`);
		const params = {
			Bucket: 'assignment-image-upload',
			Key: `${filename}`, // type is not required
			Body: data,
			ACL: 'public-read',
			ContentType: `${contentType}`, // required. Notice the back ticks
		};


		const { Location:location, Key:key } = await s3.upload(params).promise();

		console.log('Upload Finished: ', location, key);
		return location;
	} catch (error) {
		console.log(error);
		return error;
	}
};

module.exports = documentUpload;
