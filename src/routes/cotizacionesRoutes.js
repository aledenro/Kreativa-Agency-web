const express = require("express");
const CotizacionesController = require("../controllers/cotizacionesController");

const router = express.Router();

router.put(
    "/agregarRespuesta/:id",
    CotizacionesController.addRespuestaCotizacion
);
router.put("/cambiarEstado/:id", CotizacionesController.changeEstadoCotizacion);
router.post("/crear", CotizacionesController.crearCotizacion);
router.get("/id/:id", CotizacionesController.getCotizacionById);

module.exports = router;
