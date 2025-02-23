const Servicios = require("../models/serviciosModel");
const mongoose = require("mongoose");

class ServiciosService {
    async agregarServicio(data) {
        try {
            const servicio = new Servicios(data);

            return await servicio.save();
        } catch (error) {
            throw new Error("No se pudo agregar el servicio: " + error.message);
        }
    }

    async getServicios() {
        try {
            return await Servicios.find();
        } catch (error) {
            throw new Error(
                "No se pudieron obtener los servicios: " + error.message
            );
        }
    }

    async getServicioById(id) {
        try {
            const servicio = await Servicios.findById(id);
            if (!servicio) {
                throw new Error(`Servicio ${id} no encontrado`);
            }
            return servicio;
        } catch (error) {
            throw new Error(
                `No se pudo obtener el servicio ${id}: ` + error.message
            );
        }
    }

    async modificarServicioById(id, datosActualizados) {
        try {
            const servicioActualizado = await Servicios.findByIdAndUpdate(
                id,
                datosActualizados,
                {
                    new: true,
                }
            );

            console.log(datosActualizados);

            return servicioActualizado;
        } catch (error) {
            throw new Error(
                `No se pudo modificar el servicio ${id}: ` + error.message
            );
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
}

module.exports = new ServiciosService();
