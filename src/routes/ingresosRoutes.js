const express = require("express");
const ingresosController = require("../controllers/ingresosController");
const verificarToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", verificarToken, ingresosController.registrarIngreso);
router.get("/", verificarToken, ingresosController.obtenerIngresos);
router.get("/anio", verificarToken, ingresosController.obtenerIngresosPorAnio);
router.get(
    "/ingresosPorMes",
    verificarToken,
    ingresosController.obtenerIngresosPorMes
);
router.get(
    "/anualesDetalle",
    verificarToken,
    ingresosController.obtenerIngresosAnualesDetalle
);
router.get(
    "/getByDateRange",
    verificarToken,
    ingresosController.getIngresosDateRange
);
router.get("/:id", verificarToken, ingresosController.obtenerIngresoPorId);
router.put("/:id", verificarToken, ingresosController.actualizarIngreso);
router.put(
    "/:id/desactivar",
    verificarToken,
    ingresosController.desactivarIngreso
);
router.put("/:id/activar", verificarToken, ingresosController.activarIngreso);
router.get(
    "/buscarPorCedula/:cedula",
    verificarToken,
    ingresosController.buscarUsuarioPorCedula
);

module.exports = router;
