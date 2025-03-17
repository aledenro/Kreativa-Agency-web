const express = require("express");

const emailController = require("../controllers/emailController");

const router = express.Router();

router.post("/", emailController.send);
router.post("/externo", emailController.sendExterno);

module.exports = router;
