const express = require("express");
const EgresosController = require("../controllers/egresosController");
const {verificarToken, verificarTokenValidoSesion} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", verificarToken, verificarTokenValidoSesion, EgresosController.agregarEgreso);
router.get("/", verificarToken, verificarTokenValidoSesion, EgresosController.obtenerEgresos);
router.get("/anio", verificarToken, verificarTokenValidoSesion, EgresosController.obtenerEgresosPorAnio);
router.get("/mes", verificarToken, verificarTokenValidoSesion, EgresosController.obtenerEgresosPorMes);
router.get(
    "/anualesDetalle",
    verificarToken,
    EgresosController.obtenerEgresosAnualesDetalle
);
router.get(
    "/getByDateRange",
    verificarToken,
    EgresosController.getEgresosDateRange
);
router.get("/:id", verificarToken, verificarTokenValidoSesion, EgresosController.obtenerEgresoPorId);
router.put("/:id", verificarToken, verificarTokenValidoSesion, EgresosController.editarEgreso);
router.put(
    "/:id/desactivar",
    verificarToken,
    EgresosController.desactivarEgreso
);
router.put("/:id/activar", verificarToken, verificarTokenValidoSesion, EgresosController.activarEgreso);

module.exports = router;
