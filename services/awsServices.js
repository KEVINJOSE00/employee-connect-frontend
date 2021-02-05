import AWS from 'aws-sdk';

class awsServices {
    constructor() { }
    s3Upload = async ({ file, fileName }) => {
        if (file && fileName) {
            AWS.config.update({
                region: process.env.AWS_REGION,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                accessKeyId: process.env.AWS_ACCESS_KEY_ID
            })
            const upload = new AWS.S3.ManagedUpload({
                params: {
                    Bucket: process.env.BUCKET_NAME,
                    Body: file,
                    Key: 'kevin/' + fileName,
                }

            })
            return upload.promise()
        }
    }
}

export default awsServices;

















const test = () => {
    if (file && fileName) {
        AWS.config.update({
            region: process.env.AWS_REGION,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID
        })
        const upload = new AWS.S3.ManagedUpload({
            params: {
                Bucket: process.env.BUCKET_NAME,
                Body: file,
                Key: 'kevin/' + fileName,
            }

        })
        return upload.promise()
    }

}