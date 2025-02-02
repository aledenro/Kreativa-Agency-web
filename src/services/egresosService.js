const EgresosModel = require("../models/egresosModel");

class EgresosService {
    async agregarEgreso(datosEgreso) {
        try {
            const egreso = new EgresosModel(datosEgreso);
            await egreso.save();
            return egreso;
        } catch (error) {
            throw error;
        }
    }

    async obtenerEgresos() {
        try {
            return await EgresosModel.find(); // Devuelve todos los egresos de la base de datos
        } catch (error) {
            throw error;
        }
    }

    // Función para obtener un egreso por ID
    async obtenerEgresoPorId(id) {
        try {
            const egreso = await EgresosModel.findById(id); // Buscamos el egreso por su ID
            return egreso;
        } catch (error) {
            throw new Error("Error al obtener el egreso por ID: " + error.message);
        }
    }

    async editarEgreso(id, datos) {
        datos.ultima_modificacion = new Date();  // Actualizar la fecha de modificación
        return await EgresosModel.findByIdAndUpdate(id, datos, { new: true });
    }
}

module.exports = new EgresosService();