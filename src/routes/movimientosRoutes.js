const express = require("express");
const movimientosController = require("../controllers/movimientosController");

const router = express.Router();

router.get("/", movimientosController.obtenerMovimientos);

module.exports = router;
