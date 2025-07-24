const express = require("express");
const multer = require("multer");
const fileSystemController = require("../controllers/fileSystemController");
const verificarToken = require("../middleware/authMiddleware");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadMiddleware = upload.fields([{ name: "files" }]);

router.post(
    "/",
    verificarToken,
    uploadMiddleware,
    fileSystemController.uploadFile
);
router.get("/", verificarToken, fileSystemController.generateUrls);
router.post("/delete", verificarToken, fileSystemController.deleteFile);

module.exports = router;
