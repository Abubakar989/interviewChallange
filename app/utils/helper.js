const AWS = require('aws-sdk')
const config = require('../config/aws.config');
const uploadToAws = (photo, path) => {
    return new Promise(async (resolve, reject) => {
        try {
            const s3 = new AWS.S3();

            const params = {
                Bucket: config.aws.bucket,
                Key: `${path}`,
                Body: photo,
                ACL: 'public-read',
                ContentEncoding: 'base64',
            };

            s3.upload(params, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        } catch (error) {
            console.log('Uploading to amazon error', error);
            reject(err);
        }
    });
};

module.exports = uploadToAws;