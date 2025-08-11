const express = require("express");
const {verificarToken, verificarTokenValidoSesion} = require("../middleware/authMiddleware");

const {
    crearUsuario,
    obtenerTodosLosUsuarios,
    obtenerUsuario,
    actualizarUsuarioPorId,
    eliminarUsuarioPorId,
    getClientes,
    getEmpleados,
    iniciarSesion,
    recuperarContraseña,
    restablecerContraseña,
    getJerarquiaUsuarios,
} = require("../controllers/usuarioController");

const router = express.Router();

//Ruta no protegida
router.post("/login", iniciarSesion);
router.get("/usuarios/jerarquia", getJerarquiaUsuarios);

//Rutas protegidas
router.post("/usuarios", verificarToken, verificarTokenValidoSesion, crearUsuario);
router.get("/usuarios", verificarToken, verificarTokenValidoSesion, obtenerTodosLosUsuarios);
router.get("/usuarios/clientes", verificarToken, verificarTokenValidoSesion, getClientes);
router.get("/usuarios/empleados", verificarToken, verificarTokenValidoSesion, getEmpleados);
router.get("/usuarios/:id", verificarToken, verificarTokenValidoSesion, obtenerUsuario);
router.put("/usuarios/:id", verificarToken, verificarTokenValidoSesion, actualizarUsuarioPorId);
router.delete("/usuarios/:id", verificarToken, verificarTokenValidoSesion, eliminarUsuarioPorId);
router.post("/recuperar", recuperarContraseña);
router.post("/restablecer", restablecerContraseña);


module.exports = router;