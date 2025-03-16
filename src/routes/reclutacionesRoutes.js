const express = require("express");
const ReclutacionesController = require("../controllers/reclutacionesController");

const router = express.Router();

router.post("/", ReclutacionesController.nuevaReclutacion);
router.get("/", ReclutacionesController.getAllReclutaciones);
router.get("/:id", ReclutacionesController.getReclutacionById);
router.put("/:id", ReclutacionesController.desactivarReclutacion);

module.exports = router;
