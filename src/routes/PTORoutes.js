const express = require("express");
const router = express.Router();
const PTOController = require("../controllers/PTOController");

router.post("/", PTOController.crearPTO);
router.get("/", PTOController.obtenerTodosPTO);
router.get("/:empleado_id", PTOController.obtenerPTOPorEmpleado);
router.patch("/:id", PTOController.actualizarEstadoPTO);

module.exports = router;