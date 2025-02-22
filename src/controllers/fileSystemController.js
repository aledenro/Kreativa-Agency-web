const awsS3Connect = require("../utils/awsS3Connect");

class fileSystemController {
    async uploadFile(req, res) {
        const files = req.files["files"];
        const pathData = req.body.path ? JSON.parse(req.body.path) : {};

        const ids = await Promise.all(
            files.map(async (file) => {
                return await awsS3Connect.uploadFile(file, pathData);
            })
        );

        return res.status(201).json({ files_ids: ids });
    }
}

module.exports = new fileSystemController();
