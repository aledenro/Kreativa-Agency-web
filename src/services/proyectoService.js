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
}

module.exports = new ProyectoService();
