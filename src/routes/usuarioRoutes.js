const express = require("express");
const {
    crearUsuario,
    obtenerTodosLosUsuarios,
    obtenerUsuario,
    actualizarUsuarioPorId,
    eliminarUsuarioPorId,
    getClientes,
    getEmpleados,
} = require("../controllers/usuarioController");

const router = express.Router();

router.post("/usuarios", crearUsuario);
router.get("/usuarios", obtenerTodosLosUsuarios);
router.get("/usuarios/clientes", getClientes);
router.get("/usuarios/empleados", getEmpleados);
router.get("/usuarios/:id", obtenerUsuario);
router.put("/usuarios/:id", actualizarUsuarioPorId);
router.delete("/usuarios/:id", eliminarUsuarioPorId);

module.exports = router;
