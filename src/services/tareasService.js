const TareasModel = require("../models/tareasModel");
const lodash = require("lodash");

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

    async actualizarLog(id, data) {
        try {
            const tarea = await TareasModel.findById(id);

            if (tarea && !lodash.isEmpty(tarea)) {
                tarea.log.push(data);

                await tarea.save();
            }

            return tarea;
        } catch (error) {
            throw new Error(
                `Error al actualizar el log de la tarea con el id: ${id}`
            );
        }
    }
}

module.exports = new TareasService();
