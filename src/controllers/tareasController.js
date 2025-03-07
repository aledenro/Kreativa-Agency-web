const tareasService = require("../services/tareasService");
const TareasService = require("../services/tareasService");
const lodash = require("lodash");

class TareasController {
    async createTarea(req, res) {
        try {
            const data = req.body;

            const tarea = await TareasService.createTarea(data);

            return res.status(201).json(tarea);
        } catch (error) {
            console.error(`Error al crear la tarea: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }
    }

    async getTareaById(req, res) {
        try {
            const id = req.params.id;

            const tarea = await TareasService.getTareaById(id);

            if (!tarea || lodash.isEmpty(tarea)) {
                return res.status(404).json({
                    error: `Error al obtener la tarea con el id ${id}`,
                });
            }

            return res.json(tarea);
        } catch (error) {
            console.error(`Error al obtener la tarea: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }
    }

    async editTarea(req, res) {
        try {
            const id = req.params.id;
            const data = req.body;

            const tarea = await TareasService.editTarea(id, data);

            return res.json(tarea);
        } catch (error) {
            console.error(`Error al editar la tarea: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }
    }

    async actualizarLog(req, res) {
        try {
            const id = req.params.id;
            const data = req.body;
            const tarea = await TareasService.actualizarLog(id, data);

            if (!tarea || lodash.isEmpty(tarea)) {
                return res.status(404).json({
                    error: `No se encontro la tarea.`,
                });
            }

            return res.json(tarea);
        } catch (error) {
            return res.status(500).json({
                error: `Error al actualizar el log de la tarea: ${error.message}`,
            });
        }
    }

    async getAllTareas(req, res) {
        try {
            const tareas = await tareasService.getAllTareas();

            if (!tareas || lodash.isEmpty(tareas)) {
                return res.status(404).json({
                    error: `No se encontraron tareas.`,
                });
            }

            return res.json({ tareas: tareas });
        } catch (error) {
            return res.status(500).json({
                error: `Error al obtener las tareas: ${error.message}`,
            });
        }
    }

    async getAllTareasByColab(req, res) {
        try {
            const id = req.params.id;

            const tareas = await tareasService.getAllTareasByColab(id);

            if (!tareas || lodash.isEmpty(tareas)) {
                return res.status(404).json({
                    error: `No se encontraron tareas.`,
                });
            }

            return res.json({ tareas: tareas });
        } catch (error) {
            return res.status(500).json({
                error: `Error al obtener las tareas: ${error.message}`,
            });
        }
    }
}

module.exports = new TareasController();
