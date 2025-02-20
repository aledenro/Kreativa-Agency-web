const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuarioModel");

const {
    verificarUsuarioExistente,
    crearNuevoUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario,
    getUsuariosClientes,
    getUsuariosColabAdmins,
    verificarCredenciales,
} = require("../services/usuarioService");

const lodash = require("lodash");

// Crear un usuario
const crearUsuario = async (req, res) => {
    const { nombre, usuario, cedula, email, contraseña, tipo_usuario, estado } = req.body;
    
    if (!nombre || !usuario || !cedula || !email || !contraseña || !tipo_usuario || !estado) {
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    try {
        const usuarioExistente = await verificarUsuarioExistente(usuario);
        const cedulaExistente = await Usuario.findOne({ cedula });

        if (usuarioExistente) {
            return res.status(400).json({ mensaje: "El nombre de usuario ya está en uso" });
        }

        if (cedulaExistente) {
            return res.status(400).json({ mensaje: "La cédula ya está en uso" });
        }

        const usuarioCreado = await crearNuevoUsuario({
            nombre,
            usuario,
            cedula,
            email,
            contraseña,
            tipo_usuario,
            estado
        });

        res.status(201).json({
            mensaje: "Usuario creado exitosamente",
            usuario: usuarioCreado,
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear el usuario", error: error.message });
    }
};

// Obtener todos los usuarios
const obtenerTodosLosUsuarios = async (req, res) => {
    try {
        const usuarios = await obtenerUsuarios();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener los usuarios",
            error,
        });
    }
};

// Obtener un usuario por ID
const obtenerUsuario = async (req, res) => {
    try {
        const usuario = await obtenerUsuarioPorId(req.params.id);
        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener el usuario", error });
    }
};

// Actualizar un usuario
const actualizarUsuarioPorId = async (req, res) => {
    try {
        const usuarioActualizado = await actualizarUsuario(
            req.params.id,
            req.body
        );
        if (!usuarioActualizado) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        res.status(200).json({
            mensaje: "Usuario actualizado exitosamente",
            usuario: usuarioActualizado,
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar el usuario",
            error,
        });
    }
};

// Eliminar un usuario
const eliminarUsuarioPorId = async (req, res) => {
    try {
        const usuarioEliminado = await eliminarUsuario(req.params.id);
        if (!usuarioEliminado) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        res.status(200).json({
            mensaje: "Usuario eliminado exitosamente",
            usuario: usuarioEliminado,
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar el usuario",
            error,
        });
    }
};

const getClientes = async (req, res) => {
    try {
        const usuarios = await getUsuariosClientes();

        if (!usuarios || lodash.isEmpty(usuarios)) {
            return res
                .status(404)
                .json({ error: "No se pudo encontrar los clientes." });
        }

        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener los clientes",
            error,
        });
    }
};

const getEmpleados = async (req, res) => {
    try {
        const usuarios = await getUsuariosColabAdmins();

        if (!usuarios || lodash.isEmpty(usuarios)) {
            return res
                .status(404)
                .json({ error: "No se pudo encontrar los empleados." });
        }

        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener los empleados",
            error,
        });
    }
};

//Iniciar Sesión

const iniciarSesion = async (req, res) => {
    const { usuario, contraseña } = req.body;

    try {
        const user = await verificarCredenciales(usuario, contraseña); 

        if (user.error) {
            return res.status(400).json({ mensaje: user.error });
        }

        res.json({ mensaje: "Inicio de sesión exitoso", usuario: user });

    } catch (error) {
        res.status(500).json({ mensaje: "Error en el inicio de sesión", error });
    }
};

module.exports = {
    crearUsuario,
    obtenerTodosLosUsuarios,
    obtenerUsuario,
    actualizarUsuarioPorId,
    eliminarUsuarioPorId,
    getClientes,
    getEmpleados,
    iniciarSesion,
};

