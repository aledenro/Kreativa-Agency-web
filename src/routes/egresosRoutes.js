const express = require("express");
const EgresosController = require("../controllers/egresosController");

const router = express.Router();

router.post("/", EgresosController.agregarEgreso);
router.get("/", EgresosController.obtenerEgresos);
router.get("/mes", EgresosController.obtenerEgresosPorMes);
router.get("/:id", EgresosController.obtenerEgresoPorId);
router.put("/:id", EgresosController.editarEgreso);
router.put("/:id/desactivar", EgresosController.desactivarEgreso);
router.put("/:id/activar", EgresosController.activarEgreso);


module.exports = router;