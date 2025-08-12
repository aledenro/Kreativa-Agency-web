const ProyectoController = require("../controllers/proyectoController");
const express = require("express");
const {verificarToken, verificarTokenValidoSesion} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/crear", verificarToken, verificarTokenValidoSesion, ProyectoController.createProyecto);
router.get("/id/:id", verificarToken, verificarTokenValidoSesion, ProyectoController.getProyectoById);
router.put("/editar/:id", verificarToken, verificarTokenValidoSesion, ProyectoController.editProyecto);
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
router.get("/", verificarToken, verificarTokenValidoSesion, ProyectoController.getAllProyectos);
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
router.get(
	"/colaborador/:colaboradorId",
	verificarToken,
	ProyectoController.getProyectosByColaborador
);

module.exports = router;
