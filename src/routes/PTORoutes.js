const express = require("express");
const router = express.Router();
const PTOController = require("../controllers/PTOController");
const {verificarToken, verificarTokenValidoSesion} = require("../middleware/authMiddleware");

router.post("/", verificarToken, verificarTokenValidoSesion, PTOController.crearPTO);
router.get("/", verificarToken, verificarTokenValidoSesion, PTOController.obtenerTodosPTO);
router.get("/:empleado_id", verificarToken, verificarTokenValidoSesion, PTOController.obtenerPTOPorEmpleado);
router.patch("/:id", verificarToken, verificarTokenValidoSesion, PTOController.actualizarEstadoPTO);

router.get("/empleados-con-pto/listado", verificarToken, verificarTokenValidoSesion, PTOController.obtenerEmpleadosConPTO);

module.exports = router;