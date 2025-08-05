const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuarioModel");
const { enviarCorreoRecuperacion } = require("../services/emailService");

const {
    verificarUsuarioExistente,
    crearNuevoUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario,
    getUsuariosClientes,
    getUsuariosColabAdmins,
} = require("../services/usuarioService");

const lodash = require("lodash");

// Crear un usuario
const crearUsuario = async (req, res) => {
    const { nombre, usuario, cedula, email, contraseña, tipo_usuario, estado } =
        req.body;

    if (
        !nombre ||
        !usuario ||
        !cedula ||
        !email ||
        !contraseña ||
        !tipo_usuario ||
        !estado
    ) {
        return res
            .status(400)
            .json({ mensaje: "Todos los campos son obligatorios" });
    }

    try {
        const usuarioExistente = await verificarUsuarioExistente(usuario);
        const cedulaExistente = await Usuario.findOne({ cedula });

        if (usuarioExistente) {
            return res
                .status(400)
                .json({ mensaje: "El nombre de usuario ya está en uso" });
        }

        if (cedulaExistente) {
            return res
                .status(400)
                .json({ mensaje: "La cédula ya está en uso" });
        }

        const usuarioCreado = await crearNuevoUsuario({
            nombre,
            usuario,
            cedula,
            email,
            contraseña,
            tipo_usuario,
            estado,
        });

        res.status(201).json({
            mensaje: "Usuario creado exitosamente",
            usuario: usuarioCreado,
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al crear el usuario",
            error: error.message,
        });
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

// Iniciar Sesión
const iniciarSesion = async (req, res) => {
    const { usuario, contraseña } = req.body;

    try {
        const user = await Usuario.findOne({ usuario });

        if (!user) {
            return res.status(400).json({ mensaje: "Usuario no encontrado" });
        }

        if (user.estado && user.estado.toLowerCase() === "inactivo") {
            return res
                .status(403)
                .json({
                    mensaje:
                        "Tu cuenta está inactiva. Contacta al administrador.",
                });
        }

        const isMatch = await bcrypt.compare(contraseña, user.contraseña);
        if (!isMatch) {
            return res.status(400).json({ mensaje: "Contraseña incorrecta" });
        }

        const token = jwt.sign(
            {
                id: user._id,
                usuario: user.usuario,
                tipo_usuario: user.tipo_usuario,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1m" }
        );

        res.json({
            mensaje: "Inicio de sesión exitoso",
            token,
            usuario: user,
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error en el inicio de sesión",
            error,
        });
    }
};

// Recuperar Contraseña
const recuperarContraseña = async (req, res) => {
    const { email } = req.body;

    try {
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res
                .status(404)
                .json({ mensaje: "Usuario o correo no registrado" });
        }

        const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, {
            expiresIn: "15m",
        });

        await enviarCorreoRecuperacion(email, token);

        res.json({ mensaje: "Correo de recuperación enviado con éxito" });
    } catch (error) {
        console.error("Error en la recuperación de contraseña:", error);
        res.status(500).json({ mensaje: "Error al enviar el correo" });
    }
};

// Restablecer Contraseña
const restablecerContraseña = async (req, res) => {
    const { token, nuevaContraseña } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usuario = await Usuario.findById(decoded.id);

        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(nuevaContraseña, salt);

        usuario.contraseña = hashedPassword;
        await usuario.save();

        res.json({ mensaje: "Contraseña restablecida exitosamente" });
    } catch (error) {
        console.error("Error al restablecer la contraseña:", error);
        res.status(500).json({ mensaje: "Error al restablecer la contraseña" });
    }
};

// Obtener Jerarquía de Usuarios

const getJerarquiaUsuarios = async (req, res) => {
    try {
        console.log("Buscando usuarios en MongoDB...");

        const usuarios = await Usuario.find(
            {},
            "nombre email tipo_usuario estado"
        );

        if (!usuarios.length) {
            console.log("No hay usuarios en la BD.");
            return res
                .status(404)
                .json({ mensaje: "No hay empleados o clientes registrados." });
        }

        console.log("Usuarios encontrados:", usuarios);

        const jerarquia = {
            Administrador: [],
            Colaborador: [],
            Cliente: [],
        };

        usuarios.forEach((usuario) => {
            if (jerarquia[usuario.tipo_usuario]) {
                jerarquia[usuario.tipo_usuario].push(usuario);
            } else {
                console.warn(
                    `⚠️ Tipo de usuario desconocido: ${usuario.tipo_usuario}`
                );
            }
        });

        console.log("Jerarquía final:", jerarquia);

        res.status(200).json(jerarquia);
    } catch (error) {
        console.error("❌ ERROR en getJerarquiaUsuarios:", error);
        res.status(500).json({
            mensaje: "Error al obtener la jerarquía de usuarios",
        });
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
    recuperarContraseña,
    restablecerContraseña,
    getJerarquiaUsuarios,
};
