const express = require("express");
const verificarToken = require("../middleware/authMiddleware");

const emailController = require("../controllers/emailController");

const router = express.Router();

router.post("/", verificarToken, emailController.send);
router.post("/externo", emailController.sendExterno);

module.exports = router;
