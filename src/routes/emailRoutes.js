const express = require("express");

const emailController = require("../controllers/emailController");

const router = express.Router();

router.post("/", emailController.send);

module.exports = router;
