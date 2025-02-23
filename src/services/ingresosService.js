const IngresosModel = require("../models/ingresosModel");
const Usuario = require("../models/usuarioModel"); // Asegúrate de que aquí esté el modelo correcto

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

    async activarDesactivarIngreso(id, activo) {
        const ingreso = await IngresosModel.findByIdAndUpdate(
            id,
            { activo, ultima_modificacion: Date.now() },
            { new: true }
        );

        if (!ingreso) {
            throw new Error("Ingreso no encontrado.");
        }

        return ingreso;
    },
};

module.exports = ingresosService;