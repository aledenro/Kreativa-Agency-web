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
}

module.exports = new CotizacionesService();
