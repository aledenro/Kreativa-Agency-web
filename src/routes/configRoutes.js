const express = require("express");
const ConfigController = require("../controllers/configController");
const verificarToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", verificarToken, ConfigController.getFormStatus);
router.put("/", verificarToken, ConfigController.toggleFormStatus);

module.exports = router;
