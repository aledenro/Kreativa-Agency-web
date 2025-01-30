const {
    verificarUsuarioExistente,
    crearNuevoUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario
  } = require('../services/usuarioService');
  
  // Crear un usuario
  const crearUsuario = async (req, res) => {
    const { nombre, usuario, email, contraseña, tipo_usuario } = req.body;
  
    if (!nombre || !usuario || !email || !contraseña || !tipo_usuario) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }
  
    try {
      const usuarioExistente = await verificarUsuarioExistente(usuario);
      if (usuarioExistente) {
        return res.status(400).json({ mensaje: 'El nombre de usuario ya está en uso' });
      }
  
      const usuarioCreado = await crearNuevoUsuario({ nombre, usuario, email, contraseña, tipo_usuario });
      res.status(201).json({ mensaje: 'Usuario creado exitosamente', usuario: usuarioCreado });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al crear el usuario', error });
    }
  };
  
  // Obtener todos los usuarios
  const obtenerTodosLosUsuarios = async (req, res) => {
    try {
      const usuarios = await obtenerUsuarios();
      res.status(200).json(usuarios);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener los usuarios', error });
    }
  };
  
  // Obtener un usuario por ID
  const obtenerUsuario = async (req, res) => {
    try {
      const usuario = await obtenerUsuarioPorId(req.params.id);
      if (!usuario) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }
      res.status(200).json(usuario);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener el usuario', error });
    }
  };
  
  // Actualizar un usuario
  const actualizarUsuarioPorId = async (req, res) => {
    try {
      const usuarioActualizado = await actualizarUsuario(req.params.id, req.body);
      if (!usuarioActualizado) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }
      res.status(200).json({ mensaje: 'Usuario actualizado exitosamente', usuario: usuarioActualizado });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al actualizar el usuario', error });
    }
  };
  
  // Eliminar un usuario
  const eliminarUsuarioPorId = async (req, res) => {
    try {
      const usuarioEliminado = await eliminarUsuario(req.params.id);
      if (!usuarioEliminado) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }
      res.status(200).json({ mensaje: 'Usuario eliminado exitosamente', usuario: usuarioEliminado });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al eliminar el usuario', error });
    }
  };
  
  module.exports = {
    crearUsuario,
    obtenerTodosLosUsuarios,
    obtenerUsuario,
    actualizarUsuarioPorId,
    eliminarUsuarioPorId
  };