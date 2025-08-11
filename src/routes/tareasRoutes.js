const express = require("express");
const TareasController = require("../controllers/tareasController");
const {verificarToken, verificarTokenValidoSesion} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/crear", verificarToken, verificarTokenValidoSesion, TareasController.createTarea);
router.get("/id/:id", verificarToken, verificarTokenValidoSesion, TareasController.getTareaById);
router.put("/editar/:id", verificarToken, verificarTokenValidoSesion, TareasController.editTarea);
router.put(
	"/actualizarLog/:id",
	verificarToken,
	TareasController.actualizarLog
);
router.get("/", verificarToken, verificarTokenValidoSesion, TareasController.getAllTareas);
router.get(
	"/getByColab/:id",
	verificarToken,
	TareasController.getAllTareasByColab
);
router.put("/comment/:id", verificarToken, verificarTokenValidoSesion, TareasController.commentTarea);
router.put("/comment/edit/:id", verificarToken, verificarTokenValidoSesion, TareasController.editComment);
router.put("/estado/:id", verificarToken, verificarTokenValidoSesion, TareasController.actualizarEstado);

module.exports = router;
