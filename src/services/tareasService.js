const TareasModel = require("../models/tareasModel");

class TareasService {
    async createTarea(data) {
        try {
            const tarea = new TareasModel(data);

            tarea.save();

            return tarea;
        } catch (error) {
            throw new Error(`Error al crear la tarea: ${error.message}`);
        }
    }
}

module.exports = new TareasService();
