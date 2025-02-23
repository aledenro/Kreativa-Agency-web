const express = require("express");
const ingresosController = require("../controllers/ingresosController");

const router = express.Router();

router.post("/", ingresosController.registrarIngreso);
router.get("/", ingresosController.obtenerIngresos);
router.get("/:id", ingresosController.obtenerIngresoPorId);
router.put("/:id", ingresosController.actualizarIngreso);
router.put("/:id/desactivar", ingresosController.desactivarIngreso);
router.put("/:id/activar", ingresosController.activarIngreso);

module.exports = router;