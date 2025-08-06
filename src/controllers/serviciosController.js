const ServiciosService = require("../services/serviciosService");
const lodash = require("lodash");

class ServiciosController {
	async agregarServicio(req, res) {
		try {
			const servicio = await ServiciosService.agregarServicio(
				req.body,
				req.files
			);
			return res.status(201).json(servicio);
		} catch (error) {
			console.error("Error al agregar el servicio: " + error.message);
			return res.status(500).json({ error: error.message });
		}
	}

	async getServicios(req, res) {
		try {
			const servicios = await ServiciosService.getServicios();
			return res.status(200).json(servicios);
		} catch (error) {
			console.error("Error al obtener los servicios: " + error.message);
			return res.status(500).json({ error: error.message });
		}
	}

	async getServicioById(req, res) {
		try {
			const { id } = req.params;
			const servicio = await ServiciosService.getServicioById(id);

			return res.status(200).json(servicio);
		} catch (error) {
			console.error("Error al obtener el servicio: " + error.message);
			return res.status(404).json({ error: error.message });
		}
	}

	async getServiciosNombres(req, res) {
		try {
			const servicios = await ServiciosService.getServiciosNombres();
			res.json(servicios);
		} catch (error) {
			res.status(500).json({ mensaje: error.message });
		}
	}

	async modificarServicioById(req, res) {
		try {
			const id = req.params.id;
			const data = req.body;
			const files = req.files;

			const servicioActualizado = await ServiciosService.modificarServicioById(
				id,
				data,
				files
			);

			return res.status(200).json(servicioActualizado);
		} catch (error) {
			console.error("Error al modificar el servicio: " + error.message);
			return res.status(404).json({ error: error.message });
		}
	}

	async desactivarServicio(req, res) {
		try {
			const { id } = req.params;
			const servicio = await ServiciosService.desactivarServicioById(id);
			return res
				.status(200)
				.json({ mensaje: "Servicio desactivado", servicio });
		} catch (error) {
			console.error("Error al desactivar el servicio: " + error.message);
			return res.status(500).json({ error: error.message });
		}
	}

	async activarServicio(req, res) {
		try {
			const { id } = req.params;
			const servicio = await ServiciosService.activarServicioById(id);
			return res.status(200).json({ mensaje: "Servicio activado", servicio });
		} catch (error) {
			console.error("Error al activar el servicio: " + error.message);
			return res.status(500).json({ error: error.message });
		}
	}

	async getCategorias(req, res) {
		try {
			const categorias = await ServiciosService.getCategorias();
			return res.status(200).json(categorias);
		} catch (error) {
			return res.status(500).json({ error: error.message });
		}
	}

	async agregarCategoria(req, res) {
		try {
			const { nombre } = req.body;
			if (!nombre) {
				return res.status(400).json({ error: "El nombre es obligatorio" });
			}
			const respuesta = await ServiciosService.agregarCategoria(nombre);
			return res.status(201).json(respuesta);
		} catch (error) {
			return res.status(500).json({ error: error.message });
		}
	}

	async agregarPaquete(req, res) {
		try {
			const { id } = req.params;
			const paquete = req.body;

			const servicioActualizado = await ServiciosService.agregarPaquete(
				id,
				paquete
			);
			return res.status(200).json(servicioActualizado);
		} catch (error) {
			console.error("Error al agregar el paquete: " + error.message);
			return res.status(500).json({ error: error.message });
		}
	}

	async modificarPaquete(req, res) {
		try {
			const { id, paqueteId } = req.params;
			const paqueteActualizado = req.body;

			const servicioActualizado = await ServiciosService.modificarPaquete(
				id,
				paqueteId,
				paqueteActualizado
			);

			return res.status(200).json(servicioActualizado);
		} catch (error) {
			console.error("Error al modificar el paquete: " + error.message);
			return res.status(500).json({ error: error.message });
		}
	}

	async desactivarPaquete(req, res) {
		try {
			const { id, paqueteId } = req.params;

			const servicioActualizado = await ServiciosService.desactivarPaquete(
				id,
				paqueteId
			);

			return res.status(200).json(servicioActualizado);
		} catch (error) {
			console.error("Error al desactivar el paquete: " + error.message);
			return res.status(500).json({ error: error.message });
		}
	}

	async activarPaquete(req, res) {
		try {
			const { id, paqueteId } = req.params;

			const servicioActualizado = await ServiciosService.activarPaquete(
				id,
				paqueteId
			);

			return res.status(200).json(servicioActualizado);
		} catch (error) {
			console.error("Error al activar el paquete: " + error.message);
			return res.status(500).json({ error: error.message });
		}
	}

	async getServiciosListado(req, res) {
		try {
			const servicios = await ServiciosService.getServiciosListado();
			res.status(200).json(servicios);
		} catch (error) {
			res.status(500).json({
				mensaje: "Error al obtener el listado de servicios",
				error: error.message,
			});
		}
	}
}

module.exports = new ServiciosController();
