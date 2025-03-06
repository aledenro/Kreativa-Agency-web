const ProyectoModel = require("../models/proyectoModel");
const lodash = require("lodash");

class ProyectoService {
    async createProyecto(data) {
        try {
            const proyecto = new ProyectoModel(data);
            return await proyecto.save();
        } catch (error) {
            throw new Error(`Error al crear el proyecto: ${error.message}`);
        }
    }

    async getProyectoById(id) {
        try {
            return await ProyectoModel.findById(id)
                .populate("cliente_id", "nombre")
                .populate("historial_respuestas.usuario_id", "nombre");
        } catch (error) {
            throw new Error(`Error al obtener el proyecto: ${error.message}`);
        }
    }

    async editProyecto(id, data) {
        try {
            const proyecto = await ProyectoModel.findByIdAndUpdate(id, data, {
                new: true,
            });

            return proyecto;
        } catch (error) {
            throw new Error(`Error al editar el proyecto: ${error.message}`);
        }
    }

    async editEstado(id, estado) {
        try {
            const proyecto = await ProyectoModel.findByIdAndUpdate(id, estado, {
                new: true,
            });

            return proyecto;
        } catch (error) {
            throw new Error(`Error al editar el proyecto: ${error.message}`);
        }
    }

    async getAllProyectosLimitedData() {
        try {
            return ProyectoModel.find().select("nombre");
        } catch (error) {
            throw new Error(`Error al buscar todos los proyectos`);
        }
    }

    async actualizarLog(id, data) {
        try {
            const proyecto = await ProyectoModel.findById(id);

            if (proyecto && !lodash.isEmpty(proyecto)) {
                proyecto.log.push(data);

                await proyecto.save();
            }

            return proyecto;
        } catch (error) {
            throw new Error(
                `Error al actualizar el  log del proyecto con el id: ${id}`
            );
        }
    }

    async addRespuesta(id, respuesta) {
        try {
            const proyecto = await ProyectoModel.findById(id);

            proyecto["historial_respuestas"].push(respuesta);
            await proyecto.save();

            return proyecto["historial_respuestas"].at(-1);
        } catch (error) {
            throw new Error("Error al agregar la respuesta " + error.message);
        }
    }
}

module.exports = new ProyectoService();
