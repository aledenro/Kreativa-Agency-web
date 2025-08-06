const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuarioModel");
const mongoose = require("mongoose");

// Verificar si un usuario ya existe
const verificarUsuarioExistente = async (usuario) => {
	return await Usuario.findOne({ usuario });
};

// Crear un nuevo usuario
const crearNuevoUsuario = async (datosUsuario) => {
	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(datosUsuario.contraseña, salt);

		const nuevoUsuario = new Usuario({
			nombre: datosUsuario.nombre,
			usuario: datosUsuario.usuario,
			cedula: datosUsuario.cedula,
			email: datosUsuario.email,
			contraseña: hashedPassword,
			tipo_usuario: datosUsuario.tipo_usuario,
			estado: datosUsuario.estado || "Activo",
		});

		return await nuevoUsuario.save();
	} catch (error) {
		throw new Error(`Error al crear el usuario: ${error.message}`);
	}
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

const getUsuariosColabAdmins = async () => {
	try {
		return await Usuario.find()
			.or([{ tipo_usuario: "Administrador" }, { tipo_usuario: "Colaborador" }])
			.select("nombre estado");
	} catch (error) {
		throw new Error(`Error al obtener los empleados: ${error.message}`);
	}
};

// Verificar credenciales de usuario
const verificarCredenciales = async (usuario, contraseña) => {
	const user = await Usuario.findOne({ usuario });

	if (!user) {
		return { error: "Usuario no encontrado" };
	}

	const isMatch = await bcrypt.compare(contraseña, user.contraseña);
	if (!isMatch) {
		return { error: "Contraseña incorrecta" };
	}

	return user;
};

// Obtener Jerarquía ordenada

const obtenerJerarquiaUsuarios = async () => {
	try {
		console.log("🔍 Buscando usuarios en MongoDB...");

		const usuarios = await Usuario.find({}, "nombre email tipo_usuario estado");

		if (!usuarios.length) {
			console.log("⚠️ No hay usuarios registrados.");
			return { mensaje: "No hay empleados o clientes registrados." };
		}

		console.log("📌 Usuarios encontrados:", usuarios);

		const jerarquia = {
			Administradores: [],
			Colaboradores: [],
			Clientes: [],
		};

		usuarios.forEach((usuario) => {
			if (usuario.tipo_usuario === "Administrador") {
				jerarquia.Administradores.push({
					nombre: usuario.nombre,
					email: usuario.email,
					estado: usuario.estado,
				});
			} else if (usuario.tipo_usuario === "Colaborador") {
				jerarquia.Colaboradores.push({
					nombre: usuario.nombre,
					email: usuario.email,
					estado: usuario.estado,
				});
			} else if (usuario.tipo_usuario === "Cliente") {
				jerarquia.Clientes.push({
					nombre: usuario.nombre,
					email: usuario.email,
					estado: usuario.estado,
				});
			}
		});

		console.log("Jerarquía generada correctamente:", jerarquia);
		return jerarquia;
	} catch (error) {
		console.error("ERROR en obtenerJerarquiaUsuarios:", error);
		throw new Error("Error al obtener la jerarquía de usuarios");
	}
};

const getEmailUsuario = async (id) => {
	try {
		if (mongoose.Types.ObjectId.isValid(id)) {
			return await Usuario.findById(id).select("email");
		} else {
			return await Usuario.findOne({ cedula: id }).select("email");
		}
	} catch (error) {
		throw new Error(`Error al obtener los empleados: ${error.message}`);
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
	getUsuariosColabAdmins,
	verificarCredenciales,
	obtenerJerarquiaUsuarios,
	getEmailUsuario,
};
