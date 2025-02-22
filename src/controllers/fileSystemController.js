const awsS3Connect = require("../utils/awsS3Connect");

class fileSystemController {
    async uploadFile(req, res) {
        const files = req.files["files"];
        const pathData = req.body.path ? JSON.parse(req.body.path) : {};

        try {
            const ids = await Promise.all(
                files.map(async (file) => {
                    return await awsS3Connect.uploadFile(file, pathData);
                })
            );

            return res.status(201).json({ files_ids: ids });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async generateUrls(req, res) {
        const path = req.body;

        try {
            const urls = await awsS3Connect.generateUrls(path);

            return res.json({ urls: urls });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async deleteFile(req, res) {
        const key = req.body.key;

        try {
            await awsS3Connect.deleteFile(key);

            return res.sendStatus(204);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new fileSystemController();
