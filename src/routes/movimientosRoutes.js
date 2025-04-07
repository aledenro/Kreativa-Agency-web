const express = require("express");
const movimientosController = require("../controllers/movimientosController");

const router = express.Router();

// Ruta para obtener movimientos (se pueden pasar query params: fecha, anio, fechaInicio, fechaFin)
router.get("/", movimientosController.obtenerMovimientos);

module.exports = router;
