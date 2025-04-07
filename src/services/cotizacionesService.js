const Cotizaciones = require("../models/cotizacionesModel");
const lodash = require("lodash");
const awsS3Connect = require("../utils/awsS3Connect");

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
            const cotizacion = await Cotizaciones.findById(id)
                .populate("cliente_id", "nombre")
                .populate("historial_respuestas.usuario_id", "nombre");

            if (cotizacion && !lodash.isEmpty(cotizacion)) {
                const filesCotizacion = await awsS3Connect.generateUrls({
                    folder: "cotizaciones",
                    parent: "cotizacion",
                    parent_id: cotizacion._id,
                });

                cotizacion.files = filesCotizacion;

                if (cotizacion.historial_respuestas.length > 0) {
                    for (
                        let i = 0;
                        i < cotizacion.historial_respuestas.length;
                        i++
                    ) {
                        const respuesta = cotizacion.historial_respuestas.at(i);

                        const files = await awsS3Connect.generateUrls({
                            folder: "cotizaciones",
                            parent: cotizacion._id,
                            parent_id: respuesta._id,
                        });

                        cotizacion.historial_respuestas.at(i).files = files;
                    }
                }
            }

            return cotizacion;
        } catch (error) {
            throw new Error("Error al obtener la cotizacion " + error.message);
        }
    }

    async getCotizacionByUserId(user_id) {
        try {
            return Cotizaciones.find({ cliente_id: user_id })
                .populate("cliente_id", "nombre")
                .sort({ fecha_solicitud: -1 });
        } catch (error) {
            throw new Error(
                `Error al obtener las cotizaciones del cliente ${user_id}  ` +
                    error.message
            );
        }
    }

    async getAllCotizaciones() {
        try {
            const cotizaciones = Cotizaciones.find()
                .populate("cliente_id", "nombre")
                .sort({ fecha_solicitud: -1 });
            return cotizaciones;
        } catch (error) {
            console.error(error.message);
            throw new Error(
                `Error al obtener las cotizaciones  ` + error.message
            );
        }
    }

    async addRespuestaCotizacion(id, respuesta) {
        try {
            const cotizacion = await Cotizaciones.findById(id).populate(
                "cliente_id",
                "nombre"
            );

            cotizacion["historial_respuestas"].push(respuesta);
            await cotizacion.save();

            return cotizacion["historial_respuestas"].at(-1);
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
