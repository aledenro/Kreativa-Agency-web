const express = require("express");
const CotizacionesController = require("../controllers/cotizacionesController");

const router = express.Router();

router.post("/crear", CotizacionesController.crearCotizacion);

module.exports = router;
