const Servicios = require("../models/serviciosModel");
const mongoose = require("mongoose");
const awsS3Connect = require("../utils/awsS3Connect");

class ServiciosService {
    async agregarServicio(data, files) {
        try {
            let imagenes = [];

            if (files && files.length > 0) {
                imagenes = await Promise.all(
                    files.map(async (file) => {
                        return await awsS3Connect.uploadFile(file, {
                            folder: "landingpage",
                            parent: "servicios",
                            parent_id: "",
                        });
                    })
                );
            }

            const servicio = new Servicios({ ...data, imagenes });
            const nuevoServicio = await servicio.save();

            return nuevoServicio.toObject();
        } catch (error) {
            throw new Error("No se pudo agregar el servicio: " + error.message);
        }
    }

    async getServicios() {
        try {
            let servicios = await Servicios.find().lean();

            if (servicios.length > 0) {
                for (let servicio of servicios) {
                    const files = await awsS3Connect.generateUrls({
                        folder: "landingpage",
                        parent: "servicios",
                        parent_id: servicio._id,
                    });

                    const sortedFiles = files.sort((a, b) => {
                        const timestampA = a.key.split("/")[3].split("-")[0];
                        const timestampB = b.key.split("/")[3].split("-")[0];

                        return parseInt(timestampB) - parseInt(timestampA);
                    });

                    servicio.imagen =
                        sortedFiles.length > 0 ? sortedFiles[0].url : null;
                }
            }

            return servicios;
        } catch (error) {
            throw new Error(
                "No se pudieron obtener los servicios: " + error.message
            );
        }
    }

    async getServicioById(id) {
        try {
            const servicio = await Servicios.findById(id).lean();

            if (!servicio) {
                throw new Error(`Servicio con ID ${id} no encontrado`);
            }

            const files = await awsS3Connect.generateUrls({
                folder: "landingpage",
                parent: "servicios",
                parent_id: servicio._id,
            });

            const sortedFiles = files.sort((a, b) => {
                const timestampA = a.key.split("/")[3].split("-")[0];
                const timestampB = b.key.split("/")[3].split("-")[0];

                return parseInt(timestampB) - parseInt(timestampA);
            });

            servicio.imagen =
                sortedFiles.length > 0 ? sortedFiles[0].url : null;

            servicio.imagenesUrls = sortedFiles.map((file) => file.url);

            return servicio;
        } catch (error) {
            throw new Error(
                `No se pudo obtener el servicio con ID ${id}: ${error.message}`
            );
        }
    }

    async getServiciosNombres() {
        try {
            let servicios = await Servicios.find({}, "_id nombre").lean();

            return servicios;
        } catch (error) {
            throw new Error(
                "No se pudieron obtener los nombres de los servicios: " +
                    error.message
            );
        }
    }

    async modificarServicioById(id, datosActualizados, files) {
        try {
            const servicioExistente = await Servicios.findById(id);
            if (!servicioExistente) {
                throw new Error(`No se encontró el servicio ${id}`);
            }

            if (files && files.length > 0) {
                const nuevasImagenes = await Promise.all(
                    files.map(async (file) => {
                        return await awsS3Connect.uploadFile(file, {
                            folder: "landingpage",
                            parent: "servicios",
                            parent_id: id,
                        });
                    })
                );

                datosActualizados.imagenes = nuevasImagenes;
            }

            if (
                datosActualizados.imagenes &&
                Object.keys(datosActualizados).length === 1
            ) {
                await Servicios.updateOne(
                    { _id: id },
                    { $set: { imagenes: datosActualizados.imagenes } }
                );
            }

            const servicioActualizado = await Servicios.findByIdAndUpdate(
                id,
                datosActualizados,
                {
                    new: true,
                    runValidators: true,
                }
            ).lean();

            const imagenesConUrls = await awsS3Connect.generateUrls({
                folder: "landingpage",
                parent: "servicios",
                parent_id: servicioActualizado._id,
            });

            servicioActualizado.imagen =
                imagenesConUrls.length > 0 ? imagenesConUrls[0].url : null;

            servicioActualizado.imagenesUrls = imagenesConUrls.map(
                (file) => file.url
            );

            return servicioActualizado;
        } catch (error) {
            throw new Error(
                `No se pudo modificar el servicio ${id}: ${error.message}`
            );
        }
    }
    async desactivarServicioById(id) {
        try {
            const servicioDesactivado = await Servicios.findByIdAndUpdate(
                id,
                { activo: false, ultima_modificacion: Date.now() },
                { new: true }
            );
            if (!servicioDesactivado) {
                throw new Error(`Servicio ${id} no encontrado`);
            }
            return servicioDesactivado;
        } catch (error) {
            throw new Error(
                `No se pudo desactivar el servicio ${id}: ` + error.message
            );
        }
    }

    async activarServicioById(id) {
        try {
            const servicioActivado = await Servicios.findByIdAndUpdate(
                id,
                { activo: true, ultima_modificacion: Date.now() },
                { new: true }
            );
            if (!servicioActivado) {
                throw new Error(`Servicio ${id} no encontrado`);
            }
            return servicioActivado;
        } catch (error) {
            throw new Error(
                `No se pudo activar el servicio ${id}: ` + error.message
            );
        }
    }

    async getCategorias() {
        try {
            const categorias = await mongoose.connection.db
                .collection("categorias_servicio")
                .find()
                .toArray();
            return categorias;
        } catch (error) {
            throw new Error("Error al obtener categorías: " + error.message);
        }
    }

    async agregarCategoria(nombre) {
        try {
            const existe = await mongoose.connection.db
                .collection("categorias_servicio")
                .findOne({ nombre });
            if (existe) {
                throw new Error("La categoría ya existe");
            }

            const resultado = await mongoose.connection.db
                .collection("categorias_servicio")
                .insertOne({ nombre });

            // devolver id de una
            return {
                _id: resultado.insertedId,
                nombre: nombre,
                mensaje: "Categoría agregada correctamente",
            };
        } catch (error) {
            throw new Error("Error al agregar la categoría: " + error.message);
        }
    }

    async agregarPaquete(id, paquete) {
        try {
            const servicioActualizado = await Servicios.findByIdAndUpdate(
                id,
                { $push: { paquetes: paquete } },
                { new: true }
            );

            if (!servicioActualizado) {
                throw new Error(`Servicio ${id} no encontrado`);
            }

            return servicioActualizado;
        } catch (error) {
            throw new Error("Error al agregar el paquete: " + error.message);
        }
    }

    async modificarPaquete(id, paqueteId, paqueteActualizado) {
        try {
            const servicio = await Servicios.findOneAndUpdate(
                { _id: id, "paquetes._id": paqueteId },
                {
                    $set: {
                        "paquetes.$": paqueteActualizado,
                        ultima_modificacion: Date.now(),
                    },
                },
                { new: true }
            );

            if (!servicio) {
                throw new Error(
                    `Servicio ${id} o paquete ${paqueteId} no encontrado`
                );
            }

            return servicio;
        } catch (error) {
            throw new Error("Error al modificar el paquete: " + error.message);
        }
    }

    async desactivarPaquete(id, paqueteId) {
        try {
            const servicioActualizado = await Servicios.findOneAndUpdate(
                { _id: id, "paquetes._id": paqueteId },
                {
                    $set: {
                        "paquetes.$.activo": false,
                    },
                },
                { new: true }
            );

            if (!servicioActualizado) {
                throw new Error(
                    `Servicio ${id} o paquete ${paqueteId} no encontrado`
                );
            }

            return servicioActualizado;
        } catch (error) {
            throw new Error(
                `No se pudo desactivar el paquete ${paqueteId}: ` +
                    error.message
            );
        }
    }

    async activarPaquete(id, paqueteId) {
        try {
            const servicioActualizado = await Servicios.findOneAndUpdate(
                { _id: id, "paquetes._id": paqueteId },
                {
                    $set: {
                        "paquetes.$.activo": true,
                    },
                },
                { new: true }
            );

            if (!servicioActualizado) {
                throw new Error(
                    `Servicio ${id} o paquete ${paqueteId} no encontrado`
                );
            }

            return servicioActualizado;
        } catch (error) {
            throw new Error(
                `No se pudo activar el paquete ${paqueteId}: ` + error.message
            );
        }
    }
}

module.exports = new ServiciosService();
