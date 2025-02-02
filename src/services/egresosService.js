const EgresosModel = require("../models/egresosModel");

class EgresosService {
    async agregarEgreso(datosEgreso) {
        try {
            // Crear un nuevo egreso
            const egreso = new EgresosModel(datosEgreso);
            await egreso.save();
            return egreso;
        } catch (error) {
            throw error;
        }
    }

    // Obtener todos los egresos
    async obtenerEgresos() {
        try {
            return await EgresosModel.find(); // Devuelve todos los egresos en la base de datos
        } catch (error) {
            throw error;
        }
    }

    async editarEgreso(id, nuevosDatos) {
        try {
            // Buscar el egreso por ID y actualizarlo
            const egresoActualizado = await EgresosModel.findByIdAndUpdate(
                id,
                nuevosDatos,
                { new: true } // Devuelve el documento actualizado
            );

            // Si no se encuentra el egreso con ese ID, lanzamos un error
            if (!egresoActualizado) {
                throw new Error("Egreso no encontrado");
            }

            // Egreso actualizado
            return egresoActualizado;
        } catch (error) {
            // Si ocurre cualquier error
            throw error;
        }
    }
}

module.exports = new EgresosService();