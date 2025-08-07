const ContactoService = require("../services/contactoService");

class ContactoController {
	async nuevoFormContacto(req, res) {
		try {
			const data = req.body;

			const form = await ContactoService.nuevoFormContacto(data);

			return res.status(201).json({ form });
		} catch (error) {
			console.error(`Error al enviar el formulario: ${error.message}`);
			return res.status(500).json({ error: error.message });
		}
	}

	async getAllForms(req, res) {
		try {
			const forms = await ContactoService.getAllForms();
			return res.status(200).json({ forms });
		} catch (error) {
			console.error(
				`Error al obtener los formularios de contacto: ${error.message}`
			);
			return res.status(500).json({ error: error.message });
		}
	}

	async getFormById(req, res) {
		try {
			const { id } = req.params;

			const form = await ContactoService.getFormById(id);
			return res.status(200).json({ form });
		} catch (error) {
			console.error(`Error al obtener el formulario: ${error.message}`);
			return res.status(500).json({ error: error.message });
		}
	}

	async desactivarRespuestaForm(req, res) {
		try {
			const { id } = req.params;
			const form = await ContactoService.desactivarRespuestaForm(id);
			return res.status(200).json({ mensaje: "Respuesta desactivada", form });
		} catch (error) {
			console.error(
				"Error al desactivar esta respuesta al formlulario: " + error.message
			);
			return res.status(500).json({ error: error.message });
		}
	}

	async actualizarFormulario(req, res) {
		try {
			const { id } = req.params;
			const datosActualizados = req.body;

			const formActualizado = await ContactoService.actualizarFormulario(
				id,
				datosActualizados
			);

			res.status(200).json({
				mensaje: "Formulario actualizado correctamente",
				formulario: formActualizado,
			});
		} catch (error) {
			console.error("Error al actualizar formulario:", error.message);
			res.status(500).json({
				mensaje: "Error interno del servidor",
				error: error.message,
			});
		}
	}
}

module.exports = new ContactoController();
