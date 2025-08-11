const express = require("express");
const ingresosController = require("../controllers/ingresosController");
const {verificarToken, verificarTokenValidoSesion} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", verificarToken, verificarTokenValidoSesion, ingresosController.registrarIngreso);
router.get("/", verificarToken, verificarTokenValidoSesion, ingresosController.obtenerIngresos);
router.get("/anio", verificarToken, verificarTokenValidoSesion, ingresosController.obtenerIngresosPorAnio);
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
router.get("/:id", verificarToken, verificarTokenValidoSesion, ingresosController.obtenerIngresoPorId);
router.put("/:id", verificarToken, verificarTokenValidoSesion, ingresosController.actualizarIngreso);
router.put(
    "/:id/desactivar",
    verificarToken,
    ingresosController.desactivarIngreso
);
router.put("/:id/activar", verificarToken, verificarTokenValidoSesion, ingresosController.activarIngreso);
router.get(
    "/buscarPorCedula/:cedula",
    verificarToken,
    ingresosController.buscarUsuarioPorCedula
);

module.exports = router;
