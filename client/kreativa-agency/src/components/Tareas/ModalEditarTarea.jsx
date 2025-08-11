import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import sendEmail from "../../utils/emailSender";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import {validTokenActive, updateSessionStatus} from "../../utils/validateToken";

function construirJsonRequest(
	proyecto,
	nombre,
	descripcion,
	colaborador,
	prioridad,
	fechaEntrega
) {
	let fechaFormateada = fechaEntrega;
	if (fechaEntrega) {
		fechaFormateada = fechaEntrega + "T12:00:00.000Z";
	}
	return {
		proyecto_id: proyecto,
		nombre: nombre,
		descripcion: descripcion,
		colaborador_id: colaborador,
		prioridad: prioridad,
		fecha_vencimiento: fechaFormateada,
	};
}

const ModalEditarTarea = ({ show, handleClose, tareaId, onUpdate }) => {
	const [empleados, setEmpleados] = useState([]);
	const [proyectos, setProyectos] = useState([]);
	const [colaboradoresFiltrados, setColaboradoresFiltrados] = useState([]);
	const [tarea, setTarea] = useState(null);
	const [estado, setEstado] = useState("");
	const [colaboradorOriginal, setColaboradorOriginal] = useState("");
	const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
	const [formRef, setFormRef] = useState(null);
	const [api, contextHolder] = notification.useNotification();
	const navigate = useNavigate();

	const prioridades = ["Baja", "Media", "Alta"];
	const estados = [
		"Por Hacer",
		"En Progreso",
		"Cancelado",
		"Finalizado",
		"En Revisión",
	];

	const formatearFechaParaInput = (fechaString) => {
		if (!fechaString) return "";

		const fecha = new Date(fechaString);
		const year = fecha.getFullYear();
		const month = String(fecha.getMonth() + 1).padStart(2, "0");
		const day = String(fecha.getDate()).padStart(2, "0");

		return `${year}-${month}-${day}`;
	};

	const getFechaHoy = () => {
		const today = new Date();
		const year = today.getFullYear();
		const month = String(today.getMonth() + 1).padStart(2, "0");
		const day = String(today.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	};

	const getFechaMaxima = () => {
		if (proyectoSeleccionado && proyectoSeleccionado.fecha_entrega) {
			return formatearFechaParaInput(proyectoSeleccionado.fecha_entrega);
		}
		return null;
	};

	const openSuccessNotification = (message) => {
		api.success({
			message: "Éxito",
			description: message,
			placement: "top",
			duration: 4,
		});
	};

	const openErrorNotification = (message) => {
		api.error({
			message: "Error",
			description: message,
			placement: "top",
			duration: 4,
		});
	};

	const handleChange = async (e) => {
		const { name, value } = e.target;

		if (name === "proyecto") {
			setTarea((prevTarea) => ({
				...prevTarea,
				proyecto_id: value,
				colaborador_id: "",
				fecha_vencimiento: "",
			}));
			await filtrarColaboradores(value);
		} else if (name === "fecha_entrega") {
			setTarea((prevTarea) => ({
				...prevTarea,
				fecha_vencimiento: value,
			}));
		} else if (name === "colab") {
			setTarea((prevTarea) => ({
				...prevTarea,
				colaborador_id: value,
			}));
		} else {
			setTarea((prevTarea) => ({ ...prevTarea, [name]: value }));
		}
	};

	const filtrarColaboradores = async (proyectoSeleccionadoId) => {
		if (!proyectoSeleccionadoId) {
			setColaboradoresFiltrados([]);
			setProyectoSeleccionado(null);
			return;
		}

		let proyectoEncontrado = proyectos.find(
			(proyecto) => proyecto._id === proyectoSeleccionadoId
		);

		if (!proyectoEncontrado) {
			try {
				const token = localStorage.getItem("token");
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/proyectos/id/${proyectoSeleccionadoId}`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				proyectoEncontrado = response.data.proyecto || response.data;
			} catch (error) {
				console.error("Error al obtener proyecto");
			}
		}

		setProyectoSeleccionado(proyectoEncontrado);

		if (
			proyectoEncontrado &&
			proyectoEncontrado.colaboradores &&
			proyectoEncontrado.colaboradores.length > 0
		) {
			const colaboradoresAsignados = proyectoEncontrado.colaboradores.map(
				(colab) => {
					const id =
						typeof colab.colaborador_id === "object"
							? colab.colaborador_id._id
							: colab.colaborador_id;
					return id;
				}
			);

			const colaboradoresDelProyecto = empleados.filter((empleado) => {
				const estaAsignado = colaboradoresAsignados.includes(empleado._id);
				return estaAsignado;
			});

			setColaboradoresFiltrados(colaboradoresDelProyecto);

			if (tarea && !colaboradoresAsignados.includes(tarea.colaborador_id)) {
				if (colaboradoresDelProyecto.length > 0) {
					setTarea((prev) => ({
						...prev,
						colaborador_id: colaboradoresDelProyecto[0]._id,
					}));
				} else {
					setTarea((prev) => ({
						...prev,
						colaborador_id: "",
					}));
				}
			}
		} else {
			try {
				const token = localStorage.getItem("token");

				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/proyectos/id/${proyectoSeleccionadoId}`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);

				const proyectoData = response.data.proyecto || response.data;
				setProyectoSeleccionado(proyectoData);

				const colaboradoresAsignados = proyectoData.colaboradores
					? proyectoData.colaboradores.map((colab) => {
							const id =
								typeof colab.colaborador_id === "object"
									? colab.colaborador_id._id
									: colab.colaborador_id;
							return id;
						})
					: [];

				const colaboradoresDelProyecto = empleados.filter((empleado) => {
					const estaAsignado = colaboradoresAsignados.includes(empleado._id);
					return estaAsignado;
				});

				setColaboradoresFiltrados(colaboradoresDelProyecto);

				if (tarea && !colaboradoresAsignados.includes(tarea.colaborador_id)) {
					if (colaboradoresDelProyecto.length > 0) {
						setTarea((prev) => ({
							...prev,
							colaborador_id: colaboradoresDelProyecto[0]._id,
						}));
					} else {
						setTarea((prev) => ({
							...prev,
							colaborador_id: "",
						}));
					}
				}
			} catch (error) {
				setColaboradoresFiltrados(empleados);

				if (empleados.length > 0 && tarea && !tarea.colaborador_id) {
					setTarea((prev) => ({
						...prev,
						colaborador_id: empleados[0]._id,
					}));
				}
			}
		}
	};

	const handleChangeEstado = async (event) => {
		event.preventDefault();
		const estadoEdit = event.target.value;
		const token = localStorage.getItem("token");

		if (!token) {
			navigate("/error", {
				state: {
					errorCode: 401,
					mensaje: "Acceso no autorizado.",
				},
			});
			return;
		}

		try {
			const response = await axios.put(
				`${import.meta.env.VITE_API_URL}/tareas/editar/${tareaId}`,
				{ estado: estadoEdit },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			if (response.status === 200) {
				openSuccessNotification("Estado cambiado correctamente.");
				setEstado(estadoEdit);
				await addActionLog(`Cambió el estado de la tarea a: ${estadoEdit}.`);

				try {
					const colaboradorId =
						typeof tarea.colaborador_id === "object"
							? tarea.colaborador_id._id
							: tarea.colaborador_id;

					const nombreProyecto =
						proyectoSeleccionado?.nombre || "Proyecto no especificado";
					const nombreTarea = tarea?.nombre || "Tarea";

					const emailBody = `El estado de su tarea "${nombreTarea}" del proyecto "${nombreProyecto}" ha sido actualizado a ${estadoEdit}. Por favor, acceda al sistema para revisar los detalles.`;

					await sendEmail(
						colaboradorId,
						emailBody,
						`Estado de Tarea Actualizado`,
						"Acceder al Sistema",
						`tareas`
					);
				} catch (emailError) {
					console.error("Error al enviar email");
				}

				if (typeof onUpdate === "function") {
					onUpdate();
				}
			} else {
				openErrorNotification("Error al cambiar el estado.");
			}
		} catch (error) {
			if (error.status === 401) {
				await updateSessionStatus();				localStorage.clear();
				navigate("/error", {
					state: {
						errorCode: 401,
						mensaje: "Debe volver a iniciar sesión para continuar.",
					},
				});

				return;
			}
			openErrorNotification(
				"Error al editar el estado de su tarea, por favor trate nuevamente o comuníquese con el soporte técnico."
			);
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		const formData = new FormData(event.target);

		const nombre = formData.get("nombre").trim();
		const descripcion = formData.get("descripcion").trim();
		const colab = formData.get("colab");
		const prioridad = formData.get("prioridad");
		const proyecto = formData.get("proyecto");
		const fechaEntrega = formData.get("fecha_entrega");

		if (
			!nombre ||
			!descripcion ||
			!colab ||
			!prioridad ||
			!proyecto ||
			!fechaEntrega
		) {
			openErrorNotification("Todos los campos son obligatorios.");
			return;
		}

		if (proyectoSeleccionado && proyectoSeleccionado.fecha_entrega) {
			const fechaTarea = new Date(fechaEntrega + "T00:00:00");
			const fechaProyecto = new Date(proyectoSeleccionado.fecha_entrega);

			const fechaTareaSoloFecha = new Date(
				fechaTarea.getFullYear(),
				fechaTarea.getMonth(),
				fechaTarea.getDate()
			);
			const fechaProyectoSoloFecha = new Date(
				fechaProyecto.getFullYear(),
				fechaProyecto.getMonth(),
				fechaProyecto.getDate()
			);

			if (fechaTareaSoloFecha > fechaProyectoSoloFecha) {
				const fechaMaximaFormatted =
					fechaProyectoSoloFecha.toLocaleDateString("es-ES");
				openErrorNotification(
					`La fecha de entrega de la tarea no puede ser posterior a la fecha de entrega del proyecto (${fechaMaximaFormatted}).`
				);
				return;
			}
		}

		const enviar = confirm("¿Desea guardar los cambios en la tarea?");
		if (!enviar) return;

		const data = construirJsonRequest(
			proyecto,
			nombre,
			descripcion,
			colab,
			prioridad,
			fechaEntrega
		);

		const token = localStorage.getItem("token");

		if (!token) {
			navigate("/error", {
				state: {
					errorCode: 401,
					mensaje: "Acceso no autorizado.",
				},
			});
			return;
		}

		try {
			const res = await axios.put(
				`${import.meta.env.VITE_API_URL}/tareas/editar/${tareaId}`,
				data,
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			if (res.status === 200) {
				openSuccessNotification("Tarea editada correctamente.");
				await addActionLog("Editó la tarea.");

				const colaboradorCambio = colaboradorOriginal !== colab;

				try {
					const nombreProyecto =
						proyectoSeleccionado?.nombre || "Proyecto no especificado";
					const fechaEntregaFormatted = new Date(
						fechaEntrega
					).toLocaleDateString("es-ES");

					if (colaboradorCambio) {
						try {
							const emailBodyAnterior = `La tarea "${nombre}" del proyecto ${nombreProyecto} ya no está asignada a usted. Ha sido reasignada a otro colaborador. Por favor, acceda al sistema para revisar sus tareas actuales.`;

							await sendEmail(
								colaboradorOriginal,
								emailBodyAnterior,
								"Tarea Reasignada",
								"Acceder al Sistema",
								"tareas"
							);
						} catch (emailError) {
							console.error("Error al enviar email");
						}

						try {
							const emailBodyNuevo = `Se le ha asignado la tarea "${nombre}" del proyecto ${nombreProyecto} con fecha de entrega al ${fechaEntregaFormatted}. Por favor, acceda al sistema para revisar todos los detalles.`;

							await sendEmail(
								colab,
								emailBodyNuevo,
								"Nueva Tarea Asignada",
								"Acceder al Sistema",
								"tareas"
							);
						} catch (emailError) {
							console.error("Error al enviar email");
						}
					} else {
						try {
							const emailBody = `Su tarea ${nombre} del proyecto ${nombreProyecto} ha sido actualizada. Por favor, acceda al sistema para revisar los cambios realizados.`;

							await sendEmail(
								colab,
								emailBody,
								"Tarea Actualizada",
								"Acceder al Sistema",
								"tareas"
							);
						} catch (emailError) {
							console.error("Error al enviar email");
						}
					}
				} catch (emailError) {
					console.error("Error al enviar email");
				}

				if (typeof onUpdate === "function") {
					onUpdate();
				}

				setTimeout(() => {
					handleClose();
				}, 2000);
			} else {
				openErrorNotification("Error al editar la tarea.");
			}
		} catch (error) {
			if (error.status === 401) {
				await updateSessionStatus();				localStorage.clear();
				navigate("/error", {
					state: {
						errorCode: 401,
						mensaje: "Debe volver a iniciar sesión para continuar.",
					},
				});

				return;
			}

			openErrorNotification(
				"Error al editar la tarea, por favor trate nuevamente o comuníquese con el soporte técnico."
			);
		}
	};

	const addActionLog = async (accion) => {
		const token = localStorage.getItem("token");

		if (!token) {
			navigate("/error", {
				state: {
					errorCode: 401,
					mensaje: "Acceso no autorizado.",
				},
			});
			return;
		}

		try {
			const user_id = localStorage.getItem("user_id");
			await axios.put(
				`${import.meta.env.VITE_API_URL}/tareas/actualizarLog/${tareaId}`,
				{
					usuario_id: user_id,
					accion: accion,
				},
				{ headers: { Authorization: `Bearer ${token}` } }
			);
		} catch (error) {
			if (error.status === 401) {
				await updateSessionStatus();				localStorage.clear();
				navigate("/error", {
					state: {
						errorCode: 401,
						mensaje: "Debe volver a iniciar sesión para continuar.",
					},
				});

				return;
			}
		}
	};

	const fetchTarea = useCallback(async () => {
		if (!tareaId) return;
		const token = localStorage.getItem("token");

		if (!token) {
			navigate("/error", {
				state: {
					errorCode: 401,
					mensaje: "Acceso no autorizado.",
				},
			});
			return;
		}

		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/tareas/id/${tareaId}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			setTarea(response.data);
			setEstado(response.data.estado);
			setColaboradorOriginal(
				typeof response.data.colaborador_id === "object"
					? response.data.colaborador_id._id
					: response.data.colaborador_id
			);
		} catch (error) {
			if (error.status === 401) {
				await updateSessionStatus();				localStorage.clear();
				navigate("/error", {
					state: {
						errorCode: 401,
						mensaje: "Debe volver a iniciar sesión para continuar.",
					},
				});

				return;
			}
			console.error(`Error al obtener la tarea`);
		}
	}, [tareaId]);

	useEffect(() => {
		const token = localStorage.getItem("token");

		if (!token) {
			navigate("/error", {
				state: {
					errorCode: 401,
					mensaje: "Acceso no autorizado.",
				},
			});
			return;
		}

		if (!validTokenActive()) {
			navigate("/error", {
				state: {
					errorCode: 401,
					mensaje: "Debe volver a iniciar sesión para continuar.",
				},
			});
			return;
		}

		if (show && tareaId) {
			fetchTarea();
			fetchProyectos();
			fetchEmpleados();
		}
	}, [show, tareaId, fetchTarea]);

	useEffect(() => {
		if (tarea && empleados.length > 0) {
			filtrarColaboradores(tarea.proyecto_id);
		}
	}, [empleados, tarea?.proyecto_id]);

	async function fetchEmpleados() {
		const token = localStorage.getItem("token");

		if (!token) {
			navigate("/error", {
				state: {
					errorCode: 401,
					mensaje: "Acceso no autorizado.",
				},
			});
			return;
		}

		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/usuarios/empleados`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setEmpleados(response.data);
		} catch (error) {
			console.error(`Error al obtener los empleados`);
			if (error.status === 401) {
				await updateSessionStatus();				localStorage.clear();
				navigate("/error", {
					state: {
						errorCode: 401,
						mensaje: "Debe volver a iniciar sesión para continuar.",
					},
				});

				return;
			}
		}
	}

	async function fetchProyectos() {
		const token = localStorage.getItem("token");

		if (!token) {
			navigate("/error", {
				state: {
					errorCode: 401,
					mensaje: "Acceso no autorizado.",
				},
			});
			return;
		}
		const rol = localStorage.getItem("tipo_usuario");
		const userId = localStorage.getItem("user_id");

		try {
			let url = `${import.meta.env.VITE_API_URL}/proyectos`;

			if (rol === "Cliente") {
				url += `/cliente/${userId}`;
			} else if (rol === "Colaborador") {
				url += `/colaborador/${userId}`;
			} else {
				url += `/getAllProyectosLimitedData`;
			}

			const response = await axios.get(url, {
				headers: { Authorization: `Bearer ${token}` },
			});

			setProyectos(response.data.proyectos);
		} catch (error) {
			console.error(`Error al obtener los proyectos`);
			if (error.status === 401) {
				await updateSessionStatus();				localStorage.clear();
				navigate("/error", {
					state: {
						errorCode: 401,
						mensaje: "Debe volver a iniciar sesión para continuar.",
					},
				});

				return;
			}
		}
	}

	const handleSaveClick = () => {
		if (formRef) {
			formRef.dispatchEvent(
				new Event("submit", { cancelable: true, bubbles: true })
			);
		}
	};

	return (
		<Modal
			scrollable
			show={show}
			onHide={handleClose}
			size="lg"
			centered
			dialogClassName="tarea-modal"
		>
			{contextHolder}
			<Modal.Header closeButton>
				<Modal.Title>{tarea?.nombre || ""}</Modal.Title>
			</Modal.Header>
			<Modal.Body
				className="p-4"
				style={{ maxHeight: "70vh", overflowY: "auto" }}
			>
				{!tarea ? (
					<div className="text-center p-5">
						<p>Cargando tarea...</p>
					</div>
				) : (
					<>
						<div className="row mb-3">
							<div className="col-md-6">
								<div className="info-item">
									<div className="text-muted mb-1">Fecha de Solicitud</div>
									<div className="fw-medium">
										{new Date(tarea.fecha_creacion).toLocaleDateString()}
									</div>
								</div>
							</div>
							<div className="col-md-6">
								<div className="info-item">
									<div className="text-muted mb-1">Estado</div>
									<select
										className="form-select form_input"
										name="estado"
										id="estado"
										value={estado}
										onChange={handleChangeEstado}
									>
										{estados.map((opcion) => (
											<option key={opcion} value={opcion}>
												{opcion}
											</option>
										))}
									</select>
								</div>
							</div>
						</div>

						<form onSubmit={handleSubmit} ref={(el) => setFormRef(el)}>
							<div className="mb-3">
								<label htmlFor="proyecto" className="form-label">
									Proyecto
								</label>
								<select
									className="form-select form_input"
									name="proyecto"
									id="proyecto"
									value={tarea.proyecto_id}
									onChange={handleChange}
									disabled={estado === "Cancelado" || estado === "Finalizado"}
									required
								>
									<option value="">Seleccione un proyecto</option>
									{proyectos.map((proyecto) => (
										<option key={proyecto._id} value={proyecto._id}>
											{proyecto.nombre}
										</option>
									))}
								</select>
							</div>
							<div className="mb-3">
								<label htmlFor="nombre" className="form-label">
									Nombre
								</label>
								<input
									type="text"
									className="form_input"
									id="nombre"
									name="nombre"
									required
									value={tarea.nombre}
									onChange={handleChange}
									disabled={estado === "Cancelado" || estado === "Finalizado"}
								/>
							</div>
							<div className="mb-3">
								<label htmlFor="descripcion" className="form-label">
									Descripción
								</label>
								<textarea
									name="descripcion"
									className="form_input form-textarea"
									id="descripcion"
									rows={5}
									placeholder="Describa su solicitud"
									required
									value={tarea.descripcion}
									onChange={handleChange}
									disabled={estado === "Cancelado" || estado === "Finalizado"}
								></textarea>
							</div>
							<div className="mb-3">
								<label htmlFor="colab" className="form-label">
									Colaborador
								</label>
								<select
									className="form-select form_input"
									name="colab"
									id="colab"
									value={tarea.colaborador_id._id || tarea.colaborador_id}
									onChange={handleChange}
									required
									disabled={
										estado === "Cancelado" ||
										estado === "Finalizado" ||
										!tarea.proyecto_id
									}
								>
									<option value="">
										{tarea.proyecto_id
											? "Seleccione un colaborador"
											: "Primero seleccione un proyecto"}
									</option>
									{colaboradoresFiltrados.map((colab) => (
										<option key={colab._id} value={colab._id}>
											{colab.nombre}
										</option>
									))}
								</select>
								{tarea.proyecto_id && colaboradoresFiltrados.length === 0 && (
									<small className="text-muted">
										No hay colaboradores asignados a este proyecto.
									</small>
								)}
							</div>
							<div className="row">
								<div className="col-md-6">
									<div className="mb-3">
										<label className="form-label" htmlFor="prioridad">
											Prioridad
										</label>
										<select
											className="form-select form_input"
											name="prioridad"
											id="prioridad"
											value={tarea.prioridad}
											onChange={handleChange}
											required
											disabled={
												estado === "Cancelado" || estado === "Finalizado"
											}
										>
											<option value="">Seleccione prioridad</option>
											{prioridades.map((prioridad) => (
												<option key={prioridad} value={prioridad}>
													{prioridad}
												</option>
											))}
										</select>
									</div>
								</div>
								<div className="col-md-6">
									<div className="mb-3">
										<label htmlFor="fecha_entrega" className="form-label">
											Fecha de Entrega
										</label>
										<input
											type="date"
											className="form-control form_input"
											id="fecha_entrega"
											name="fecha_entrega"
											required
											value={formatearFechaParaInput(tarea.fecha_vencimiento)}
											min={getFechaHoy()}
											max={getFechaMaxima()}
											onChange={handleChange}
											disabled={
												estado === "Cancelado" ||
												estado === "Finalizado" ||
												!tarea.proyecto_id
											}
										/>
										{proyectoSeleccionado &&
											proyectoSeleccionado.fecha_entrega && (
												<small className="text-muted">
													Fecha máxima:{" "}
													{new Date(
														proyectoSeleccionado.fecha_entrega
													).toLocaleDateString("es-ES")}
												</small>
											)}
										{!tarea.proyecto_id && (
											<small className="text-muted">
												Primero seleccione un proyecto
											</small>
										)}
									</div>
								</div>
							</div>
						</form>
					</>
				)}
			</Modal.Body>
			<Modal.Footer>
				<button
					type="button"
					className="thm-btn btn-gris me-2"
					onClick={handleClose}
				>
					Cerrar
				</button>
				<button
					type="button"
					className="thm-btn"
					onClick={handleSaveClick}
					disabled={!tarea || estado === "Cancelado" || estado === "Finalizado"}
				>
					Guardar
				</button>
			</Modal.Footer>
		</Modal>
	);
};

export default ModalEditarTarea;
