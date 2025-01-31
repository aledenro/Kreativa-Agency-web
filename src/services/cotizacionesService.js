const Cotizaciones = require("../models/cotizacionesModel");

class CotizacionesService {
    async crearCotizacion(data) {
        try {
            const cotizacion = new Cotizaciones(data);

            return await cotizacion.save();
        } catch (error) {
            throw new Error("No se pudo crear la cotización " + error.message);
        }
    }

    async getCotizacionById(id) {
        try {
            return Cotizaciones.findById(id);
        } catch (error) {
            throw new Error("Error al obtener la cotizacion " + error.message);
        }
    }

    async addRespuestaCotizacion(id, respuesta) {
        try {
            const cotizacion = await Cotizaciones.findById(id);
            console.log(cotizacion);

            cotizacion["historial_respuestas"].push(respuesta);
            await cotizacion.save();

            return cotizacion;
        } catch (error) {
            throw new Error("Error al agregar la respuesta " + error.message);
        }
    }

    async changeEstadoCotizacion(id, estado) {
        try {
            const cotizacion = await Cotizaciones.findByIdAndUpdate(
                id,
                { estado: estado },
                { new: true }
            );

            return cotizacion;
        } catch (error) {
            throw new Error(
                "Error al cambiar el estado de la cotizacion " + error.message
            );
        }
    }
}

module.exports = new CotizacionesService();
