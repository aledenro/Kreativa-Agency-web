const express = require("express");
const EgresosController = require("../controllers/egresosController");

const router = express.Router();

router.post("/", EgresosController.agregarEgreso);
router.get("/", EgresosController.obtenerEgresos);
router.put("/:id", EgresosController.editarEgreso);

module.exports = router;