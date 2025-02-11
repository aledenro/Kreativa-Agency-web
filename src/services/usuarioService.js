const Usuario = require("../models/usuarioModel");

// Verificar si un usuario ya existe
const verificarUsuarioExistente = async (usuario) => {
    return await Usuario.findOne({ usuario });
};

// Crear un nuevo usuario
const crearNuevoUsuario = async (datosUsuario) => {
    const nuevoUsuario = new Usuario(datosUsuario);
    return await nuevoUsuario.save();
};

// Obtener todos los usuarios
const obtenerUsuarios = async () => {
    return await Usuario.find();
};

// Obtener un usuario por ID
const obtenerUsuarioPorId = async (id) => {
    return await Usuario.findById(id);
};

// Actualizar un usuario
const actualizarUsuario = async (id, datosActualizados) => {
    return await Usuario.findByIdAndUpdate(id, datosActualizados, {
        new: true,
    });
};

// Eliminar un usuario
const eliminarUsuario = async (id) => {
    return await Usuario.findByIdAndDelete(id);
};

const getUsuariosClientes = async () => {
    try {
        return await Usuario.find({ tipo_usuario: "Cliente" }).select("nombre");
    } catch (error) {
        throw new Error(`Error al obtener los clientes: ${error.message}`);
    }
};

module.exports = {
    verificarUsuarioExistente,
    crearNuevoUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario,
    getUsuariosClientes,
};
