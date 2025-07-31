const tareasModel = require("../models/tareasModel");
const TareasModel = require("../models/tareasModel");
const lodash = require("lodash");

class TareasService {
	async createTarea(data) {
		try {
			const tarea = new TareasModel(data);

			tarea.save();

			return tarea;
		} catch (error) {
			throw new Error(`Error al crear la tarea: ${error.message}`);
		}
	}

	async getTareaById(id) {
		try {
			return TareasModel.findById(id);
		} catch (error) {
			throw new Error(`Error al obtener la tarea: ${error.message}`);
		}
	}

	async editTarea(id, data) {
		try {
			const tarea = await TareasModel.findByIdAndUpdate(id, data, {
				new: true,
			});

			return tarea;
		} catch (error) {
			throw new Error(`Error al editar la tarea: ${error.message}`);
		}
	}

	async actualizarLog(id, data) {
		try {
			const tarea = await TareasModel.findById(id);

			if (tarea && !lodash.isEmpty(tarea)) {
				tarea.log.push(data);

				await tarea.save();
			}

			return tarea;
		} catch (error) {
			throw new Error(
				`Error al actualizar el log de la tarea con el id: ${id}`
			);
		}
	}

	async getAllTareas() {
		try {
			return await tareasModel
				.find()
				.select({
					nombre: 1,
					descripcion: 1,
					colaborador_id: 1,
					estado: 1,
					prioridad: 1,
					fecha_asignacion: 1,
					fecha_vencimiento: 1,
					fecha_creacion: 1,
					comentarios: 1,
				})
				.populate("colaborador_id", "nombre")
				.populate("proyecto_id", "nombre estado")
				.populate("comentarios.usuario_id", "nombre");
		} catch (error) {
			throw new Error(`Error al obetener todas las tareas: ${error.message}`);
		}
	}

	async getAllTareasByColab(id) {
		try {
			return await tareasModel
				.find({ colaborador_id: id })
				.select({
					nombre: 1,
					descripcion: 1,
					colaborador_id: 1,
					estado: 1,
					prioridad: 1,
					fecha_asignacion: 1,
					fecha_vencimiento: 1,
					fecha_creacion: 1,
					comentarios: 1,
				})
				.populate("colaborador_id", "nombre")
				.populate("proyecto_id", "nombre estado")
				.populate("comentarios.usuario_id", "nombre");
		} catch (error) {
			throw new Error(`Error al obetener todas las tareas: ${error.message}`);
		}
	}

	async commentTarea(id, comment) {
		try {
			const tarea = await TareasModel.findById(id)
				.populate("colaborador_id", "nombre")
				.populate("proyecto_id", "nombre estado");

			if (tarea && !lodash.isEmpty(tarea)) {
				tarea.comentarios.push(comment);

				await tarea.save();
			}

			await tarea.populate("comentarios.usuario_id", "nombre");

			return tarea;
		} catch (error) {
			console.error(`Error al agregar el comentario: ${error.message}`);

			throw new Error(`Error al agregar un comentario: ${id}`);
		}
	}

	async editComment(id, comment) {
		try {
			const tarea = await TareasModel.findById(id)
				.populate("colaborador_id", "nombre")
				.populate("proyecto_id", "nombre estado");

			if (tarea && !lodash.isEmpty(tarea) && tarea.comentarios) {
				const commUpdated = [];

				tarea.comentarios.forEach((comentario) => {
					if (comentario._id.toString() === comment._id) {
						comentario.contenido = comment.contenido;
					}

					commUpdated.push(comentario);
				});

				tarea.comentarios = commUpdated;

				await tarea.save();
			}

			await tarea.populate("comentarios.usuario_id", "nombre");

			return tarea;
		} catch (error) {
			console.error(`Error  al editar el comentario: ${error.message}`);
			throw new Error("Error  al editar el comentario");
		}
	}

	async actualizarEstado(id, estado, userId) {
		try {
			const tarea = await TareasModel.findById(id).populate("colaborador_id");

			if (!tarea) {
				throw new Error("Tarea no encontrada.");
			}

			if (
				tarea.colaborador_id &&
				tarea.colaborador_id._id.toString() !== userId
			) {
				throw new Error("No tiene permisos para actualizar esta tarea.");
			}

			tarea.estado = estado;
			await tarea.save();

			return await TareasModel.findById(id)
				.populate("colaborador_id", "nombre")
				.populate("proyecto_id", "nombre estado")
				.populate("comentarios.usuario_id", "nombre");
		} catch (error) {
			throw new Error(`Error al actualizar el estado: ${error.message}`);
		}
	}
}

module.exports = new TareasService();
