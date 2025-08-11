const express = require("express");
const ConfigController = require("../controllers/configController");
const {verificarToken, verificarTokenValidoSesion} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", ConfigController.getFormStatus);
router.put("/", verificarToken, verificarTokenValidoSesion, ConfigController.toggleFormStatus);

module.exports = router;
