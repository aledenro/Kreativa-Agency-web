const ProyectoService = require("../services/proyectoService");
const lodash = require("lodash");

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

    async getProyectoById(req, res) {
        try {
            const id = req.params.id;
            const proyecto = await ProyectoService.getProyectoById(id);

            if (!proyecto || lodash.isEmpty(proyecto)) {
                return res.status(404).json({
                    error: `No se pudo obtener el proyecto con el id ${id}`,
                });
            }

            return res.json(proyecto);
        } catch (error) {
            console.error(`Error al obtener el proyecto: ${error.message}`);
            return res.status(500).json({
                error: `Error al obtener el proyecto: ${error.message}`,
            });
        }
    }

    async editProyecto(req, res) {
        try {
            const id = req.params.id;
            const data = req.body;

            const proyecto = await ProyectoService.editProyecto(id, data);

            return res.json(proyecto);
        } catch (error) {
            console.error(`Error al editar el proyecto: ${error.message}`);
            return res.status(500).json({
                error: `Error al editar el proyecto: ${error.message}`,
            });
        }
    }
}

module.exports = new ProyectoController();
