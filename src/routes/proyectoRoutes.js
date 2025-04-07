const ProyectoController = require("../controllers/proyectoController");
const express = require("express");

const router = express.Router();

router.post("/crear", ProyectoController.createProyecto);
router.get("/id/:id", ProyectoController.getProyectoById);
router.put("/editar/:id", ProyectoController.editProyecto);
router.put("/editarEstado/:id", ProyectoController.editProyecto);
router.get(
    "/getAllProyectosLimitedData",
    ProyectoController.getAllProyectosLimitedData
);
router.get("/", ProyectoController.getAllProyectos);
router.put("/actualizarLog/:id", ProyectoController.actualizarLog);
router.put("/agregarRespuesta/:id", ProyectoController.addRespuesta);
router.get("/cliente/:clienteId", ProyectoController.getProyectosByCliente);

module.exports = router;
