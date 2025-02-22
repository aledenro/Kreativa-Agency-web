const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESSKEYID,
        secretAccessKey: process.env.AWS_SECRETACCESSKEY,
    },
});

const uploadFile = async (file, path) => {
    const key = `${path.folder}/${path.parent}/${Date.now().toString()}-${
        file.originalname
    }`;

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    });

    try {
        await s3Client.send(command);

        return key;
    } catch (error) {
        throw new Error(`Error al subir el archivo: ${error.message}`);
    }
};

module.exports = { uploadFile };
