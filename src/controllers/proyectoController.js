const ProyectoService = require("../services/proyectoService");

class ProyectoController {
    async createProyecto(req, res) {
        try {
            const data = req.body;

            const proyecto = await ProyectoService.createProyecto(data);

            return res.status(201).json({ proyecto: proyecto });
        } catch (error) {
            console.error(`Error al crear el proyecto: ${error.message}`);
            return res.status(500).json({
                error: `Error al crear el proyecto: ${error.message}`,
            });
        }
    }
}

module.exports = new ProyectoController();
