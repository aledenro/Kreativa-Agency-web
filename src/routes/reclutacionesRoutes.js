const express = require("express");
const ReclutacionesController = require("../controllers/reclutacionesController");
const verificarToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", ReclutacionesController.nuevaReclutacion);
router.get("/", verificarToken, ReclutacionesController.getAllReclutaciones);
router.get("/:id", verificarToken, ReclutacionesController.getReclutacionById);
router.put(
    "/actualizar/:id",
    verificarToken,
    ReclutacionesController.actualizarFormById
);
router.put(
    "/desactivar/:id",
    verificarToken,
    ReclutacionesController.desactivarReclutacion
);

module.exports = router;
