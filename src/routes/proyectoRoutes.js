const ProyectoController = require("../controllers/proyectoController");
const express = require("express");
const verificarToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/crear", verificarToken, ProyectoController.createProyecto);
router.get("/id/:id", verificarToken, ProyectoController.getProyectoById);
router.put("/editar/:id", verificarToken, ProyectoController.editProyecto);
router.put(
    "/editarEstado/:id",
    verificarToken,
    ProyectoController.editProyecto
);
router.get(
    "/getAllProyectosLimitedData",
    verificarToken,
    ProyectoController.getAllProyectosLimitedData
);
router.get("/", verificarToken, ProyectoController.getAllProyectos);
router.put(
    "/actualizarLog/:id",
    verificarToken,
    ProyectoController.actualizarLog
);
router.put(
    "/agregarRespuesta/:id",
    verificarToken,
    ProyectoController.addRespuesta
);
router.get(
    "/cliente/:clienteId",
    verificarToken,
    ProyectoController.getProyectosByCliente
);

module.exports = router;
