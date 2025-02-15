const TareasService = require("../services/tareasService");

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
}

module.exports = new TareasController();
