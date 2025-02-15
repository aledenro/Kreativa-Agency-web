const ProyectoModel = require("../models/proyectoModel");

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
            return await ProyectoModel.findById(id).populate(
                "cliente_id",
                "nombre"
            );
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
}

module.exports = new ProyectoService();
