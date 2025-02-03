const ProyectoController = require("../controllers/proyectoController");
const express = require("express");

const router = express.Router();

router.post("/crear", ProyectoController.createProyecto);
router.get("/id/:id", ProyectoController.getProyectoById);
router.put("/editar/:id", ProyectoController.editProyecto);

module.exports = router;
