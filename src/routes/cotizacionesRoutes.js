const express = require("express");
const CotizacionesController = require("../controllers/cotizacionesController");
const {verificarToken, verificarTokenValidoSesion} = require("../middleware/authMiddleware");

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
router.post("/crear", verificarToken, verificarTokenValidoSesion, CotizacionesController.crearCotizacion);
router.get("/id/:id", verificarToken, verificarTokenValidoSesion, CotizacionesController.getCotizacionById);
router.get(
    "/getByUser/:user_id",
    verificarToken,
    CotizacionesController.getCotizacionByUserId
);
router.get("/", verificarToken, verificarTokenValidoSesion, CotizacionesController.getAllCotizaciones);

module.exports = router;
