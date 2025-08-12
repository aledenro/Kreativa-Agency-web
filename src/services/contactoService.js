const ContactoModel = require("../models/contactoModel");
const mongoose = require("mongoose");

class ContactoService {
	async nuevoFormContacto(data) {
		try {
			return await new ContactoModel(data).save();
		} catch (error) {
			throw new Error(`Error en el ingreso del formulario: ${error.message}`);
		}
	}

	async getAllForms() {
		try {
			const forms = await ContactoModel.find()
				.populate("servicios_id", "nombre")
				.sort({ fecha_envio: -1 });
			return forms;
		} catch (error) {
			throw new Error(
				`Error al obtener los formularios de contacto: ${error.message}`
			);
		}
	}

	async getFormById(id) {
		try {
			if (!mongoose.Types.ObjectId.isValid(id)) {
				throw new Error(`ID inválido: ${id}`);
			}

			const form = await ContactoModel.findById(id).populate(
				"servicios_id",
				"nombre"
			);
			if (!form) {
				throw new Error(`Formulario con ID ${id} no encontrado`);
			}

			return form;
		} catch (error) {
			throw new Error(
				`Error al obtener el formulario de contacto ${id}: ${error.message}`
			);
		}
	}

	async desactivarRespuestaForm(id) {
		try {
			const form = await ContactoModel.findByIdAndUpdate(
				id,
				{ activo: false },
				{ new: true }
			);

			if (!form) {
				throw new Error(`Formulario con ID ${id} no encontrado`);
			}
		} catch (error) {
			throw new Error(
				`Error al desactivar el formulario de contacto ${id}: ${error.message}`
			);
		}
	}

	async actualizarFormulario(id, datosActualizados) {
		try {
			if (!mongoose.Types.ObjectId.isValid(id)) {
				throw new Error(`ID inválido: ${id}`);
			}

			const formActualizado = await ContactoModel.findByIdAndUpdate(
				id,
				datosActualizados,
				{
					new: true,
					runValidators: true,
				}
			).populate("servicios_id", "nombre");

			if (!formActualizado) {
				throw new Error(`Formulario con ID ${id} no encontrado`);
			}

			return formActualizado;
		} catch (error) {
			throw new Error(
				`Error al actualizar el formulario de contacto ${id}: ${error.message}`
			);
		}
	}
}

module.exports = new ContactoService();
