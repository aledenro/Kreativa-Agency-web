const {
    S3Client,
    PutObjectCommand,
    ListObjectsV2Command,
    GetObjectCommand,
    DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESSKEYID,
        secretAccessKey: process.env.AWS_SECRETACCESSKEY,
    },
});

const uploadFile = async (file, path) => {
    const key = `${path.folder}/${path.parent}/${
        path.parent_id
    }/${Date.now().toString()}-${file.originalname}`;

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

const getFilesByParent = async (path) => {
    const prefix = `${path.folder}/${path.parent}/${path.parent_id}/`;

    const command = new ListObjectsV2Command({
        Bucket: process.env.AWS_BUCKET_NAME,
        Prefix: prefix,
    });

    const { Contents = [] } = await s3Client.send(command);

    return Contents.map((file) => file.Key);
};

const generateUrls = async (path) => {
    try {
        const keys = await getFilesByParent(path);

        const urls = Promise.all(
            keys.map(async (key) => {
                const command = new GetObjectCommand({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: key,
                });

                return await getSignedUrl(s3Client, command, {
                    expiresIn: 1800,
                });
            })
        );

        return urls;
    } catch (error) {
        throw new Error(`Error al  generar  los URLs: ${error.message}`);
    }
};

const deleteFile = async (key) => {
    try {
        const command = new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
        });

        await s3Client.send(command);

        return;
    } catch (error) {
        throw new Error(`Error al  eliminar el archivo: ${error.message}`);
    }
};

module.exports = { uploadFile, generateUrls, deleteFile };
