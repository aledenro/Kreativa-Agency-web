const Reclutaciones = require("../models/reclutacionesModel");
const awsS3Connect = require("../utils/awsS3Connect");

class ReclutacionesService {
    async nuevaReclutacion(data, files) {
        try {
            let cv = [];

            const parent_id = `${data.nombre.trim()}_${data.apellido.trim()}`;

            if (files && files.length > 0) {
                cv = await Promise.all(
                    files.map(async (file) => {
                        return await awsS3Connect.uploadFile(file, {
                            folder: "landingpage",
                            parent: "reclutacion",
                            parent_id: parent_id,
                        });
                    })
                );
            }

            const reclutacion = new Reclutaciones({ ...data, cv });
            const nuevaReclutacion = await reclutacion.save();

            return nuevaReclutacion.toObject();
        } catch (error) {
            throw new Error(
                "No se pudo agregar la respuesta: " + error.message
            );
        }
    }

    async getReclutacionById(id) {
        try {
            const reclutacion = await Reclutaciones.findById(id).lean();
            if (!reclutacion) {
                throw new Error("Reclutación no encontrada");
            }

            const parent_id = `${reclutacion.nombre.trim()}_${reclutacion.apellido.trim()}`;

            const files = await awsS3Connect.generateUrls({
                folder: "landingpage",
                parent: "reclutacion",
                parent_id: parent_id,
            });

            return { ...reclutacion, files };
        } catch (error) {
            throw new Error(
                "No se pudo obtener la reclutación: " + error.message
            );
        }
    }

    async getAllReclutaciones() {
        try {
            const reclutaciones = await Reclutaciones.find().lean();

            const reclutacionesConCV = await Promise.all(
                reclutaciones.map(async (reclutacion) => {
                    const parent_id = `${reclutacion.nombre.trim()}_${reclutacion.apellido.trim()}`;
                    const files = await awsS3Connect.generateUrls({
                        folder: "landingpage",
                        parent: "reclutacion",
                        parent_id: parent_id,
                    });
                    return { ...reclutacion, files };
                })
            );

            return reclutacionesConCV;
        } catch (error) {
            throw new Error(
                "No se pudieron obtener las respuestas al formulario: " +
                    error.message
            );
        }
    }

    async desactivarReclutacion(id) {
        try {
            const reclutacion = await Reclutaciones.findByIdAndUpdate(
                id,
                { activo: false },
                { new: true }
            ).lean();

            if (!reclutacion) {
                throw new Error("Reclutación no encontrada");
            }

            return reclutacion;
        } catch (error) {
            throw new Error(
                "No se pudo desactivar la reclutación: " + error.message
            );
        }
    }
}

module.exports = new ReclutacionesService();
