const express = require("express");
const CotizacionesController = require("../controllers/cotizacionesController");
const verificarToken = require("../middleware/authMiddleware");

const router = express.Router();

router.put(
    "/agregarRespuesta/:id",
    verificarToken,
    CotizacionesController.addRespuestaCotizacion
);
router.put(
    "/cambiarEstado/:id",
    verificarToken,
    CotizacionesController.changeEstadoCotizacion
);
router.post("/crear", verificarToken, CotizacionesController.crearCotizacion);
router.get("/id/:id", verificarToken, CotizacionesController.getCotizacionById);
router.get(
    "/getByUser/:user_id",
    verificarToken,
    CotizacionesController.getCotizacionByUserId
);
router.get("/", verificarToken, CotizacionesController.getAllCotizaciones);

module.exports = router;
