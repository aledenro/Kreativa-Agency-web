const express = require("express");
const multer = require("multer");
const fileSystemController = require("../controllers/fileSystemController");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadMiddleware = upload.fields([{ name: "files" }]);

router.post("/", uploadMiddleware, fileSystemController.uploadFile);
router.get("/", fileSystemController.generateUrls);

module.exports = router;
