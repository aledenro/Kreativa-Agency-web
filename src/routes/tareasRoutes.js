const express = require("express");
const TareasController = require("../controllers/tareasController");
const verificarToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/crear", verificarToken, TareasController.createTarea);
router.get("/id/:id", verificarToken, TareasController.getTareaById);
router.put("/editar/:id", verificarToken, TareasController.editTarea);
router.put(
    "/actualizarLog/:id",
    verificarToken,
    TareasController.actualizarLog
);
router.get("/", verificarToken, TareasController.getAllTareas);
router.get(
    "/getByColab/:id",
    verificarToken,
    TareasController.getAllTareasByColab
);
router.put("/comment/:id", verificarToken, TareasController.commentTarea);
router.put("/comment/edit/:id", verificarToken, TareasController.editComment);

module.exports = router;
