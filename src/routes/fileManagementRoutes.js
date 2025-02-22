const express = require("express");
const multer = require("multer");
const fileSystemController = require("../controllers/fileSystemController");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadMiddleware = upload.fields([{ name: "files" }]);

router.post("/", uploadMiddleware, fileSystemController.uploadFile);

module.exports = router;
