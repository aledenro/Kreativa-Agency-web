const IngresosModel = require("../models/ingresosModel");
const Usuario = require("../models/usuarioModel");

const ingresosService = {
    async registrarIngreso({ cedula, monto, descripcion, servicio, estado, nota }) {
        console.log("Buscando cliente con cédula:", cedula);
        // Validar si el usuario existe en la base de datos
        const usuarioExistente = await Usuario.findOne({ cedula });
        console.log("Cliente encontrado:", usuarioExistente);
        if (!usuarioExistente) {
            throw new Error("El cliente con esta cédula no está registrado.");
        }

        // Crear el nuevo ingreso
        const nuevoIngreso = new IngresosModel({
            cedula,
            nombre_cliente: usuarioExistente.nombre,  // Guardar el nombre del usuario en el ingreso
            monto,
            descripcion,
            servicio,
            estado,
            nota,
        });

        // Guardar en la base de datos
        await nuevoIngreso.save();
        return nuevoIngreso;
    },

    // Buscar un usuario por cédula
    async buscarUsuarioPorCedula(cedula) {
        try {
            const usuario = await Usuario.findOne({ cedula });
            if (!usuario) {
                throw new Error("Usuario no encontrado.");
            }
            return usuario;
        } catch (error) {
            throw new Error("Error al buscar el usuario: " + error.message);
        }
    },

    async obtenerIngresos() {
        return await IngresosModel.find({ activo: true }).sort({ fecha: -1 });
    },

    async obtenerIngresoPorId(id) {
        const ingreso = await IngresosModel.findById(id);
        if (!ingreso) {
            throw new Error("Ingreso no encontrado.");
        }
        return ingreso;
    },

    // Función para actualizar un ingreso
    async actualizarIngreso(id, { cedula, monto, descripcion, servicio, estado, nota, activo }) {
        // Buscar el ingreso
        const ingreso = await IngresosModel.findById(id);
        if (!ingreso) {
            throw new Error("Ingreso no encontrado.");
        }

        // Actualizar el ingreso con los nuevos valores
        ingreso.cedula = cedula || ingreso.cedula;
        ingreso.monto = monto || ingreso.monto;
        ingreso.descripcion = descripcion || ingreso.descripcion;
        ingreso.servicio = servicio || ingreso.servicio;
        ingreso.estado = estado || ingreso.estado;
        ingreso.nota = nota || ingreso.nota;
        ingreso.activo = activo !== undefined ? activo : ingreso.activo; // No modificar si no se pasa el valor

        // Guardar el ingreso actualizado
        await ingreso.save();
        return ingreso;
    },

    // Desactivar un ingreso
    async desactivarIngresoById(id) {
        try {
            const ingresoDesactivado = await IngresosModel.findByIdAndUpdate(
                id,
                { activo: false, ultima_modificacion: Date.now() },
                { new: true }
            );
            if (!ingresoDesactivado) {
                throw new Error(`Ingreso ${id} no encontrado`);
            }
            return ingresoDesactivado;
        } catch (error) {
            throw new Error(`No se pudo desactivar el ingreso ${id}: ` + error.message);
        }
    },

    // Activar un ingreso
    async activarIngresoById(id) {
        try {
            const ingresoActivado = await IngresosModel.findByIdAndUpdate(
                id,
                { activo: true, ultima_modificacion: Date.now() },
                { new: true }
            );
            if (!ingresoActivado) {
                throw new Error(`Ingreso ${id} no encontrado`);
            }
            return ingresoActivado;
        } catch (error) {
            throw new Error(`No se pudo activar el ingreso ${id}: ` + error.message);
        }
    }

};

module.exports = ingresosService;