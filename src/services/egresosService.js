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

    //Todos los egresos activos
    async obtenerEgresos() {
        try {
            return await EgresosModel.find({ activo: true }); // Solo devuelve los egresos activos
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

        try {
            datos.ultima_modificacion = new Date();  // Actualizar la fecha de modificación
            return await EgresosModel.findByIdAndUpdate(id, datos, { new: true });
        } catch (error) {
            throw new Error("Error al editar el egreso: " + error.message);
        }
    }

    // Desactivar un egreso
    async desactivarEgresoById(id) {
        try {
            const egresoDesactivado = await EgresosModel.findByIdAndUpdate(
                id,
                { activo: false, ultima_modificacion: Date.now() }, // Desactivar y actualizar la última modificación
                { new: true }  // Retorna el documento actualizado
            );
            if (!egresoDesactivado) {
                throw new Error(`Egreso ${id} no encontrado`);
            }
            return egresoDesactivado;
        } catch (error) {
            throw new Error(`No se pudo desactivar el egreso ${id}: ` + error.message);
        }
    }

    // Activar un egreso
    async activarEgresoById(id) {
        try {
            const egresoActivado = await EgresosModel.findByIdAndUpdate(
                id,
                { activo: true, ultima_modificacion: new Date() }, // Activar y actualizar la última modificación
                { new: true }  // Retorna el documento actualizado
            );
            if (!egresoActivado) {
                throw new Error(`Egreso ${id} no encontrado`);
            }
            return egresoActivado;
        } catch (error) {
            throw new Error(`No se pudo activar el egreso ${id}: ` + error.message);
        }
    }
}

module.exports = new EgresosService();