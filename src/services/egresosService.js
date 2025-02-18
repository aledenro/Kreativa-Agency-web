const EgresosModel = require("../models/egresosModel");

class EgresosService {

    //Agregar egreso
    async agregarEgreso(datosEgreso) {
        try {
            const egreso = new EgresosModel(datosEgreso);
            await egreso.save();
            return egreso;
        } catch (error) {
            throw error;
        }
    }
    
    //Todos los egresos
    async obtenerEgresos() {
        try {
            return await EgresosModel.find(); // Devuelve todos los egresos de la base de datos
        } catch (error) {
            throw error;
        }
    }

    // Obtener un egreso por ID
    async obtenerEgresoPorId(id) {
        try {
            const egreso = await EgresosModel.findById(id); // Buscamos el egreso por su ID
            return egreso;
        } catch (error) {
            throw new Error("Error al obtener el egreso por ID: " + error.message);
        }
    }

    // Editar egreso
    async editarEgreso(id, datos) {
        datos.ultima_modificacion = new Date();  // Actualizar la fecha de modificación
        return await EgresosModel.findByIdAndUpdate(id, datos, { new: true });
    }

    // Eliminar egreso
    async eliminarEgreso(id) {
        try {
            const egresoEliminado = await EgresosModel.findByIdAndDelete(id);
    
            if (!egresoEliminado) {
                throw new Error("Egreso no encontrado");
            }
    
            return egresoEliminado;
        } catch (error) {
            throw new Error("Error al eliminar el egreso: " + error.message);
        }
    }    
}

module.exports = new EgresosService();