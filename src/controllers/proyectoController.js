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

	async getAllProyectos(req, res) {
		try {
			const proyectos = await ProyectoService.getAllProyectos();

			if (!proyectos || lodash.isEmpty(proyectos)) {
				return res.status(404).json({
					error: `No se encontraron proyectos disponibles`,
				});
			}

			return res.json(proyectos);
		} catch (error) {
			console.error(`Error al obtener todos los proyectos: ${error.message}`);
			return res.status(500).json({
				error: `Error al obtener todos los proyectos: ${error.message}`,
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

			return res.json({ proyecto: proyecto });
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

	async editEstado(req, res) {
		try {
			const id = req.params.id;
			const data = req.body;

			const proyecto = await ProyectoService.editEstado(id, data);

			return res.json(proyecto);
		} catch (error) {
			console.error(
				`Error al cambiar el estado del proyecto: ${error.message}`
			);
			return res.status(500).json({
				error: `Error al cambiar el estado del proyecto: ${error.message}`,
			});
		}
	}

	async getAllProyectosLimitedData(req, res) {
		try {
			const proyectos = await ProyectoService.getAllProyectosLimitedData();

			if (!proyectos || lodash.isEmpty(proyectos)) {
				return res.status(404).json({
					error: `No se pudo obtener ningun proyecto`,
				});
			}

			return res.json({ proyectos: proyectos });
		} catch (error) {
			return res.status(500).json({
				error: `Error al obtener los proyectos: ${error.message}`,
			});
		}
	}

	async actualizarLog(req, res) {
		try {
			const id = req.params.id;
			const data = req.body;
			const proyecto = await ProyectoService.actualizarLog(id, data);

			if (!proyecto || lodash.isEmpty(proyecto)) {
				return res.status(404).json({
					error: `No se encontro el proyecto.`,
				});
			}

			return res.json(proyecto);
		} catch (error) {
			console.log(error);
			return res.status(500).json({
				error: `Error al actualizar el log del proyecto: ${error.message}`,
			});
		}
	}

	async addRespuesta(req, res) {
		try {
			const id = req.params.id;
			const respuesta = req.body;

			const respuestaDb = await ProyectoService.addRespuesta(id, respuesta);

			return res.json({ respuesta: respuestaDb });
		} catch (error) {
			console.error(
				"Error al agregar una respuesta al proyecto: " + error.message
			);
			return res.status(500).json({ error: error.message });
		}
	}

	async getProyectosByCliente(req, res) {
		try {
			const clienteId = req.params.clienteId;
			const proyectos = await ProyectoService.getProyectosByCliente(clienteId);

			if (!proyectos || lodash.isEmpty(proyectos)) {
				return res.status(404).json({
					error: `No se encontraron proyectos para el cliente con ID ${clienteId}`,
				});
			}

			return res.json(proyectos);
		} catch (error) {
			console.error(`Error al obtener proyectos del cliente: ${error.message}`);
			return res.status(500).json({
				error: `Error al obtener proyectos del cliente: ${error.message}`,
			});
		}
	}
}

module.exports = new ProyectoController();
