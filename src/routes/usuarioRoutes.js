const express = require("express");
const verificarToken = require("../middleware/authMiddleware");

const {
    crearUsuario,
    obtenerTodosLosUsuarios,
    obtenerUsuario,
    actualizarUsuarioPorId,
    eliminarUsuarioPorId,
    getClientes,
    getEmpleados,
    iniciarSesion,
} = require("../controllers/usuarioController");

const router = express.Router();

router.post("/usuarios", crearUsuario);
router.post("/login", iniciarSesion);


//Rutas protegidas
router.get("/usuarios", verificarToken, obtenerTodosLosUsuarios);
router.get("/usuarios/clientes", verificarToken, getClientes);
router.get("/usuarios/empleados", verificarToken, getEmpleados);
router.get("/usuarios/:id", verificarToken, obtenerUsuario);
router.put("/usuarios/:id", verificarToken, actualizarUsuarioPorId);
router.delete("/usuarios/:id", verificarToken, eliminarUsuarioPorId);

module.exports = router;
