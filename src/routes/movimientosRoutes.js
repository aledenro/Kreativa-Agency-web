const express = require("express");
const movimientosController = require("../controllers/movimientosController");
const verificarToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", verificarToken, movimientosController.obtenerMovimientos);

module.exports = router;
