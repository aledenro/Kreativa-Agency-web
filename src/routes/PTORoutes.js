const express = require("express");
const router = express.Router();
const PTOController = require("../controllers/PTOController");
const verificarToken = require("../middleware/authMiddleware");

router.post("/", verificarToken, PTOController.crearPTO);
router.get("/", verificarToken, PTOController.obtenerTodosPTO);
router.get("/:empleado_id", verificarToken, PTOController.obtenerPTOPorEmpleado);
router.patch("/:id", verificarToken, PTOController.actualizarEstadoPTO);

router.get("/empleados-con-pto/listado", verificarToken, PTOController.obtenerEmpleadosConPTO);

module.exports = router;