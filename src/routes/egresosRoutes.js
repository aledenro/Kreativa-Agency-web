const express = require("express");
const EgresosController = require("../controllers/egresosController");
const verificarToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", verificarToken, EgresosController.agregarEgreso);
router.get("/", verificarToken, EgresosController.obtenerEgresos);
router.get("/anio", verificarToken, EgresosController.obtenerEgresosPorAnio);
router.get("/mes", verificarToken, EgresosController.obtenerEgresosPorMes);
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
router.get("/:id", verificarToken, EgresosController.obtenerEgresoPorId);
router.put("/:id", verificarToken, EgresosController.editarEgreso);
router.put(
    "/:id/desactivar",
    verificarToken,
    EgresosController.desactivarEgreso
);
router.put("/:id/activar", verificarToken, EgresosController.activarEgreso);

module.exports = router;
