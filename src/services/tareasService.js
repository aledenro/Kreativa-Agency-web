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

    async getTareaById(id) {
        try {
            return TareasModel.findById(id);
        } catch (error) {
            throw new Error(`Error al obtener la tarea: ${error.message}`);
        }
    }

    async editTarea(id, data) {
        try {
            const tarea = await TareasModel.findByIdAndUpdate(id, data, {
                new: true,
            });

            return tarea;
        } catch (error) {
            throw new Error(`Error al editar la tarea: ${error.message}`);
        }
    }
}

module.exports = new TareasService();
