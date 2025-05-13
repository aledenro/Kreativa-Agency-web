const Reclutaciones = require("../models/reclutacionesModel");
const awsS3Connect = require("../utils/awsS3Connect");

class ReclutacionesService {
    async nuevaReclutacion(data, files) {
        try {
            let cv = [];

            if (files && files.length > 0) {
                cv = await Promise.all(
                    files.map(async (file) => {
                        return await awsS3Connect.uploadFile(file, {
                            folder: "landingpage",
                            parent: "reclutacion",
                            parent_id: "",
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

            const files = await awsS3Connect.generateUrls({
                folder: "landingpage",
                parent: "reclutacion",
                parent_id: reclutacion._id,
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
            let reclutaciones = await Reclutaciones.find().lean();

            if (reclutaciones.length > 0) {
                for (let reclutacion of reclutaciones) {
                    const files = await awsS3Connect.generateUrls({
                        folder: "landingpage",
                        parent: "reclutacion",
                        parent_id: reclutacion._id,
                    });

                    reclutacion.file = files.length > 0 ? files[0].url : null;
                }
            }
            return reclutaciones;
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

    async actualizarFormById(id, datosActualizados) {
        try {
            const formActualizado = await Reclutaciones.findByIdAndUpdate(
                id,
                datosActualizados,
                {
                    new: true,
                }
            );

            console.log(datosActualizados);

            return formActualizado;
        } catch (error) {
            throw new Error(
                `No se pudo actualizar la respueta ${id}: ` + error.message
            );
        }
    }
}

module.exports = new ReclutacionesService();
