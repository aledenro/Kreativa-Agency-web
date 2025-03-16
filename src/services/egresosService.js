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

    async obtenerEgresosPorFecha(inicioDelMes, finDelMes) {
        try {
            return await Egreso.find({
                fecha: {
                    $gte: inicioDelMes,   // Mayor o igual a la fecha de inicio
                    $lte: finDelMes       // Menor o igual a la fecha de fin
                }
            });
        } catch (error) {
            console.error("Error al obtener los egresos por fecha: " + error.message);
            throw new Error("Error al obtener los egresos por fecha");
        }
    }

    async obtenerEgresosPorAnio(anio) {
        try {
            let fechaInicio, fechaFin;
        
            if (anio) {
                fechaInicio = new Date(anio, 0, 1); // 1 de enero del año dado
                fechaFin = new Date(anio, 11, 31, 23, 59, 59, 999); // 31 de diciembre del año dado
            } else {
                const today = new Date();
                fechaInicio = new Date(today.getFullYear(), 0, 1);
                fechaFin = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);
            }
    
            // Filtramos solo los egresos activos y dentro del rango de fechas
            const egresos = await EgresosModel.find({
                fecha: { $gte: fechaInicio, $lte: fechaFin },
                activo: true  // Filtrar solo los egresos activos
            });
    
            // Sumamos el monto de todos los egresos filtrados
            const totalEgresos = egresos.reduce((total, egreso) => total + egreso.monto, 0);
    
            return totalEgresos;
        } catch (error) {
            console.error("Error al obtener los egresos por año:", error);
            throw new Error("No se pudieron obtener los egresos por año.");
        }
    }
}

module.exports = new EgresosService();