const express = require("express");
const movimientosController = require("../controllers/movimientosController");
const {verificarToken, verificarTokenValidoSesion} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", verificarToken, verificarTokenValidoSesion, movimientosController.obtenerMovimientos);

module.exports = router;
