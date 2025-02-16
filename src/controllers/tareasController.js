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
                return res
                    .status(404)
                    .json({
                        error: `Error al obtener la tarea con el id ${id}`,
                    });
            }

            return res.json(tarea);
        } catch (error) {
            console.error(`Error al obtener la tarea: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new TareasController();
