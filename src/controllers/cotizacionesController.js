const cotizacionesService = require("../services/cotizacionesService");
const CotizacionesService = require("../services/cotizacionesService");
const lodash = require("lodash");

class CotizacionesController {
    async crearCotizacion(req, res) {
        try {
            const cotizacion = await CotizacionesService.crearCotizacion(
                req.body
            );

            return res.status(201).json(cotizacion);
        } catch (error) {
            console.error("Error al crear la cotización: " + error.message);
            return res.status(500).json({ error: error.message });
        }
    }

    async getCotizacionById(req, res) {
        try {
            const id = req.params.id;

            const cotizacion = await cotizacionesService.getCotizacionById(id);

            if (lodash.isEmpty(cotizacion) || !cotizacion) {
                return res
                    .status(404)
                    .json({ error: "No se pudo encontrar la cotizacion." });
            }

            return res.json({ cotizacion: cotizacion });
        } catch (error) {
            console.error("Error al obtener la cotizacion: " + error.message);
            return res.status(500).json({ error: error.message });
        }
    }

    async addRespuestaCotizacion(req, res) {
        try {
            const id = req.params.id;
            const respuesta = req.body;

            const cotizacion = await cotizacionesService.addRespuestaCotizacion(
                id,
                respuesta
            );

            return res.json({ cotizacion: cotizacion });
        } catch (error) {
            console.error(
                "Error al agregar una respuesta a la cotizacion: " +
                    error.message
            );
            return res.status(500).json({ error: error.message });
        }
    }

    async changeEstadoCotizacion(req, res) {
        try {
            const id = req.params.id;
            const estado = req.body.estado;

            const cotizacion = await cotizacionesService.changeEstadoCotizacion(
                id,
                estado
            );

            return res.json({ cotizacion: cotizacion });
        } catch (error) {
            console.error(
                "Error al cambiar el estado de la cotizacion: " + error.message
            );
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new CotizacionesController();
