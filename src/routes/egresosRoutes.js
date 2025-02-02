const express = require("express");
const egresosController = require("../controllers/egresosController");

const router = express.Router();

router.post("/", egresosController.agregarEgreso);
router.get("/", egresosController.obtenerEgresos);
router.put("/:id", egresosController.editarEgreso);

module.exports = router;