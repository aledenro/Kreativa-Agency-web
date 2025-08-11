const express = require("express");
const ReclutacionesController = require("../controllers/reclutacionesController");
const {verificarToken, verificarTokenValidoSesion} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", ReclutacionesController.nuevaReclutacion);
router.get("/", verificarToken, verificarTokenValidoSesion, ReclutacionesController.getAllReclutaciones);
router.get("/:id", verificarToken, verificarTokenValidoSesion, ReclutacionesController.getReclutacionById);
router.put("/actualizar/:id", ReclutacionesController.actualizarFormById);
router.put(
    "/desactivar/:id",
    verificarToken,
    ReclutacionesController.desactivarReclutacion
);

module.exports = router;
