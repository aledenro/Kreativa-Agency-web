const express = require("express");
const EgresosController = require("../controllers/egresosController");

const router = express.Router();

router.post("/", EgresosController.agregarEgreso);
router.get("/", EgresosController.obtenerEgresos);
router.get("/:id", EgresosController.obtenerEgresoPorId);
router.put("/:id", EgresosController.editarEgreso);
router.delete("/:id", EgresosController.eliminarEgreso);


module.exports = router;