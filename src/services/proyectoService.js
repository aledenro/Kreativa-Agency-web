const ProyectoModel = require("../models/proyectoModel");
const lodash = require("lodash");
const awsS3Connect = require("../utils/awsS3Connect");

class ProyectoService {
	async createProyecto(data) {
		try {
			const proyecto = new ProyectoModel(data);
			return await proyecto.save();
		} catch (error) {
			throw new Error(`Error al crear el proyecto: ${error.message}`);
		}
	}

	async getAllProyectos() {
		try {
			const proyectos = await ProyectoModel.find()
				.populate("cliente_id", "nombre")
				.populate("colaboradores.colaborador_id", "nombre")
				.sort({ fecha_creacion: -1 });

			return proyectos;
		} catch (error) {
			throw new Error(`Error al obtener todos los proyectos: ${error.message}`);
		}
	}

	async getProyectoById(id) {
		try {
			const proyecto = await ProyectoModel.findById(id)
				.populate("cliente_id", "nombre")
				.populate("historial_respuestas.usuario_id", "nombre")
				.populate("colaboradores.colaborador_id", "nombre");

			if (proyecto && !lodash.isEmpty(proyecto)) {
				if (proyecto.historial_respuestas.length > 0) {
					for (let i = 0; i < proyecto.historial_respuestas.length; i++) {
						const respuesta = proyecto.historial_respuestas.at(i);

						const files = await awsS3Connect.generateUrls({
							folder: "proyectos",
							parent: proyecto._id,
							parent_id: respuesta._id,
						});

						proyecto.historial_respuestas.at(i).files = files;
					}
				}
			}

			return proyecto;
		} catch (error) {
			throw new Error(`Error al obtener el proyecto: ${error.message}`);
		}
	}

	async editProyecto(id, data) {
		try {
			const proyecto = await ProyectoModel.findByIdAndUpdate(id, data, {
				new: true,
			});

			return proyecto;
		} catch (error) {
			throw new Error(`Error al editar el proyecto: ${error.message}`);
		}
	}

	async editEstado(id, estado) {
		try {
			const proyecto = await ProyectoModel.findByIdAndUpdate(id, estado, {
				new: true,
			});

			return proyecto;
		} catch (error) {
			throw new Error(`Error al editar el proyecto: ${error.message}`);
		}
	}

	async getAllProyectosLimitedData() {
		try {
			return ProyectoModel.find().select("nombre");
		} catch (error) {
			throw new Error(`Error al buscar todos los proyectos`);
		}
	}

	async actualizarLog(id, data) {
		try {
			const proyecto = await ProyectoModel.findById(id);
			if (proyecto && !lodash.isEmpty(proyecto)) {
				proyecto.log.push(data);
				await proyecto.save();
			}

			return proyecto;
		} catch (error) {
			console.error.message;
			throw new Error(
				`Error al actualizar el  log del proyecto con el id: ${id}`
			);
		}
	}

	async addRespuesta(id, respuesta) {
		try {
			const resultado = await ProyectoModel.findByIdAndUpdate(
				id,
				{ $push: { historial_respuestas: respuesta } },
				{ new: true, runValidators: false }
			);

			if (!resultado) {
				throw new Error("Proyecto no encontrado");
			}

			return resultado.historial_respuestas.at(-1);
		} catch (error) {
			throw new Error("Error al agregar la respuesta: " + error.message);
		}
	}

	async getProyectosByCliente(clienteId) {
		try {
			const proyectos = await ProyectoModel.find({
				cliente_id: clienteId,
			})
				.populate("cliente_id", "nombre")
				.populate("colaboradores.colaborador_id", "nombre")
				.sort({ fecha_creacion: -1 });

			return proyectos;
		} catch (error) {
			throw new Error(
				`Error al obtener los proyectos del cliente: ${error.message}`
			);
		}
	}
}

module.exports = new ProyectoService();
