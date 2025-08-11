import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import Modal from "react-bootstrap/Modal";
import sendEmail from "../../utils/emailSender";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import {validTokenActive, updateSessionStatus} from "../../utils/validateToken";

const estados = [
	"Por Hacer",
	"En Progreso",
	"Cancelado",
	"Finalizado",
	"En Revisión",
];

function construirJsonRequest(
	nombre,
	descripcion,
	cliente,
	urgente,
	fechaEntrega,
	colaboradores
) {
	let fechaFormateada = fechaEntrega;
	if (fechaEntrega) {
		fechaFormateada = fechaEntrega + "T12:00:00.000Z";
	}

	return {
		cliente_id: cliente,
		nombre: nombre,
		descripcion: descripcion,
		urgente: urgente,
		fecha_entrega: fechaFormateada,
		colaboradores: colaboradores,
	};
}

function renderOptionsClientes(cliente, clienteProyecto) {
	if (cliente._id === clienteProyecto._id) {
		return (
			<option key={cliente._id} value={cliente._id} selected>
				{cliente.nombre}
			</option>
		);
	} else {
		return (
			<option key={cliente._id} value={cliente._id}>
				{cliente.nombre}
			</option>
		);
	}
}

function renderOptionsEstados(opcion, estadoProyecto) {
	if (opcion === estadoProyecto) {
		return (
			<option key={estadoProyecto} value={estadoProyecto} selected>
				{estadoProyecto}
			</option>
		);
	} else {
		return (
			<option key={opcion} value={opcion}>
				{opcion}
			</option>
		);
	}
}

const ModalEditarProyecto = ({ show, handleClose, proyectoId, onUpdate }) => {
	const [clientes, setClientes] = useState([]);
	const [proyecto, setProyecto] = useState(null);
	const [estado, setEstado] = useState("");
	const [empleados, setEmpleados] = useState([]);
	const [formRef, setFormRef] = useState(null);
	const [api, contextHolder] = notification.useNotification();
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setProyecto((prevProyecto) => ({ ...prevProyecto, [name]: value }));
	};

	const handleChangeCheckBox = (e) => {
		const { name, checked } = e.target;
		setProyecto((prevProyecto) => ({ ...prevProyecto, [name]: checked }));
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

	const handleSubmit = async (event) => {
		event.preventDefault();

		const formData = new FormData(event.target);

		const nombre = formData.get("nombre");
		const descripcion = formData.get("descripcion");
		const cliente = formData.get("cliente");
		const urgente = formData.get("urgente") === "on";
		const fechaEntrega = formData.get("fecha_entrega");
		const colab = formData.getAll("colab");

		const colabFormateado = colab.map((colaborador) => ({
			colaborador_id: colaborador,
		}));

		if (
			!nombre ||
			!descripcion ||
			!cliente ||
			!fechaEntrega ||
			colabFormateado.length === 0
		) {
			openErrorNotification(
				"Por favor complete todos los campos antes de guardar."
			);
			return;
		}

		const enviar = confirm("¿Desea editar el proyecto?");
		if (!enviar) return;

		const data = construirJsonRequest(
			nombre,
			descripcion,
			cliente,
			urgente,
			fechaEntrega,
			colabFormateado
		);

		const token = localStorage.getItem("token");
		const user = localStorage.getItem("user_name");

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
				`${import.meta.env.VITE_API_URL}/proyectos/editar/${proyectoId}`,
				data,
				{ headers: { 
					Authorization: `Bearer ${token}`,
					user: user
			 	} }
			);

			if (res.status === 200) {
				openSuccessNotification("Proyecto editado correctamente.");
				await addActionLog("Editó el proyecto.");

				const colaboradoresOriginales = proyecto.colaboradores.map((colab) =>
					typeof colab.colaborador_id === "object"
						? colab.colaborador_id._id
						: colab.colaborador_id
				);
				const colaboradoresNuevos = colab;

				const colaboradoresRemovidos = colaboradoresOriginales.filter(
					(original) => !colaboradoresNuevos.includes(original)
				);
				const colaboradoresAgregados = colaboradoresNuevos.filter(
					(nuevo) => !colaboradoresOriginales.includes(nuevo)
				);

				try {
					const fechaEntregaFormatted = new Date(
						fechaEntrega
					).toLocaleDateString("es-ES");

					for (const colaboradorId of colaboradoresRemovidos) {
						try {
							const emailBodyRemovido = `Ha sido removido del proyecto "${nombre}". Ya no tiene asignado este proyecto. Por favor, acceda al sistema para revisar sus proyectos actuales.`;

							await sendEmail(
								colaboradorId,
								emailBodyRemovido,
								"Removido del Proyecto",
								"Acceder al Sistema",
								"dashboard"
							);
						} catch (emailError) {
							console.error(`Error al enviar email`);
						}
					}

					for (const colaboradorId of colaboradoresAgregados) {
						try {
							const emailBodyAgregado = `Ha sido asignado al proyecto "${nombre}" con fecha de entrega al ${fechaEntregaFormatted}. Por favor, acceda al sistema para revisar todos los detalles del proyecto.`;

							await sendEmail(
								colaboradorId,
								emailBodyAgregado,
								"Nuevo Proyecto Asignado",
								"Acceder al Sistema",
								"dashboard"
							);
						} catch (emailError) {
							console.error(`Error al enviar email`);
						}
					}

					const colaboradoresQuePerManecen = colaboradoresNuevos.filter(
						(nuevo) => colaboradoresOriginales.includes(nuevo)
					);

					if (
						colaboradoresQuePerManecen.length > 0 &&
						colaboradoresRemovidos.length === 0 &&
						colaboradoresAgregados.length === 0
					) {
						for (const colaboradorId of colaboradoresQuePerManecen) {
							try {
								const emailBodyActualizado = `El proyecto "${nombre}" en el que está trabajando ha sido actualizado. Por favor, acceda al sistema para revisar los cambios realizados.`;

								await sendEmail(
									colaboradorId,
									emailBodyActualizado,
									"Proyecto Actualizado",
									"Acceder al Sistema",
									"dashboard"
								);
							} catch (emailError) {
								console.error("Error al enviar email");
							}
						}
					}
				} catch (emailError) {
					console.error("Error al enviar email");
				}

				setTimeout(() => {
					if (typeof onUpdate === "function") {
						onUpdate();
					}

					setTimeout(() => {
						handleClose();
					});
				}, 1000);
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
				"Error al editar el proyecto. Intente nuevamente o contacte al soporte."
			);
		}
	};

	const handleChangeEstado = async (event) => {
		event.preventDefault();
		const estadoEdit = event.target.value;
		const token = localStorage.getItem("token");
		const user = localStorage.getItem("user_name");

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
				`${import.meta.env.VITE_API_URL}/proyectos/editar/${proyectoId}`,
				{ estado: estadoEdit },
				{ headers: { 
					Authorization: `Bearer ${token}`,
					user: user
			 	} }
			);

			if (response.status === 200) {
				openSuccessNotification("Estado cambiado correctamente.");
				setEstado(estadoEdit);
				await addActionLog(`Cambió el estado del proyecto a: ${estadoEdit}.`);

				setTimeout(() => {
					if (typeof onUpdate === "function") {
						onUpdate();
					}

					setTimeout(() => {
						handleClose();
					});
				}, 1000);

				try {
					const clienteId =
						typeof proyecto.cliente_id === "object"
							? proyecto.cliente_id._id
							: proyecto.cliente_id;

					if (clienteId) {
						if (estadoEdit !== "Finalizado") {
							await sendEmail(
								clienteId,
								`El estado de su proyecto ha sido actualizado a ${estadoEdit}.`,
								`Actualización en su proyecto ${proyecto.nombre}`,
								"Ver",
								`dashboard`
							);
						} else {
							await sendEmail(
								clienteId,
								`El proyecto fue marcado como Finalizado por un colaborador de Kreativa Agency, ingrese para ver más detalles.`,
								`Actualización en su proyecto ${proyecto.nombre}`,
								"Ver",
								`dashboard`
							);
						}
					}
				} catch (emailError) {
					console.error("Error al enviar email");
				}

				try {
					if (proyecto.colaboradores && proyecto.colaboradores.length > 0) {
						for (const colaborador of proyecto.colaboradores) {
							try {
								const colaboradorId =
									typeof colaborador.colaborador_id === "object"
										? colaborador.colaborador_id._id
										: colaborador.colaborador_id;

								let emailBody;
								let emailSubject;
								switch (estadoEdit) {
									case "Finalizado":
										emailBody = `El proyecto "${proyecto.nombre}" ha sido marcado como Finalizado. Por favor, acceda al sistema para revisar los detalles finales del proyecto.`;
										emailSubject = "Proyecto Finalizado";
										break;
									case "Cancelado":
										emailBody = `El proyecto "${proyecto.nombre}" ha sido cancelado. Por favor, acceda al sistema para revisar la información actualizada.`;
										emailSubject = "Proyecto Cancelado";
										break;
									case "En Revisión":
										emailBody = `El proyecto "${proyecto.nombre}" está ahora en revisión. Por favor, acceda al sistema para revisar los comentarios y realizar los ajustes necesarios.`;
										emailSubject = "Proyecto en Revisión";
										break;
									case "En Progreso":
										emailBody = `El proyecto "${proyecto.nombre}" está ahora en progreso. Por favor, acceda al sistema para continuar con las tareas asignadas.`;
										emailSubject = "Proyecto en Progreso";
										break;
									case "Por Hacer":
										emailBody = `El proyecto "${proyecto.nombre}" ha cambiado su estado a "Por Hacer". Por favor, acceda al sistema para revisar la información actualizada.`;
										emailSubject = "Estado de Proyecto Actualizado";
										break;
									default:
										emailBody = `El estado del proyecto "${proyecto.nombre}" ha sido actualizado a ${estadoEdit}. Por favor, acceda al sistema para revisar los cambios.`;
										emailSubject = "Estado de Proyecto Actualizado";
										break;
								}

								await sendEmail(
									colaboradorId,
									emailBody,
									emailSubject,
									"Acceder al Sistema",
									"dashboard"
								);
							} catch (emailError) {
								console.error(`Error al enviar email`);
							}
						}
					}
				} catch (emailError) {
					console.error("Error general al enviar email");
				}
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
			openErrorNotification("Error al cambiar el estado del proyecto.");
		}
	};

	const addActionLog = async (accion) => {
		try {
			const token = localStorage.getItem("token");
			const user_id = localStorage.getItem("user_id");
			const user = localStorage.getItem("user_name");

			if (!token) {
				navigate("/error", {
					state: {
						errorCode: 401,
						mensaje: "Debe iniciar sesión para continuar.",
					},
				});
			}

			await axios.put(
				`${import.meta.env.VITE_API_URL}/proyectos/actualizarLog/${proyectoId}`,
				{
					usuario_id: user_id,
					accion: accion,
				},
				{ headers: { 
					Authorization: `Bearer ${token}`,
					user: user
			 	} }
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

	function renderColab(colab) {
		const isSelected = proyecto?.colaboradores?.some(
			(proyectoColab) => colab._id === proyectoColab.colaborador_id._id
		);

		return (
			<option key={colab._id} value={colab._id} selected={isSelected}>
				{colab.nombre}
			</option>
		);
	}

	const fetchProyecto = useCallback(async () => {
		if (!proyectoId) return;
		const token = localStorage.getItem("token");
		const user = localStorage.getItem("user_name");

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
				`${import.meta.env.VITE_API_URL}/proyectos/id/${proyectoId}`,
				{
					headers: { 
						Authorization: `Bearer ${token}`,
						user: user
				
					},
				}
			);

			if (response.status === 200) {
				setProyecto(response.data.proyecto);
				setEstado(response.data.proyecto.estado);
			}

			fetchClientes();
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
			console.error(`Error al obtener el proyecto`);
		}
	}, [proyectoId]);

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

		if (show) {
			fetchProyecto();
			fetchEmpleados();
		}
	}, [show, fetchProyecto]);

	async function fetchEmpleados() {
		try {
			const token = localStorage.getItem("token");
			const user = localStorage.getItem("user_name");

			if (!token) {
				navigate("/error", {
					state: {
						errorCode: 401,
						mensaje: "Debe iniciar sesión para continuar.",
					},
				});
			}

			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/usuarios/empleados`,
				{
					headers: { 
						Authorization: `Bearer ${token}`,
						user: user
				
					},
				}
			);

			const empleadosActivos = response.data.filter(
				(empleado) => empleado.estado === "Activo"
			);

			setEmpleados(response.data);
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
			console.error(`Error al obtener los empleados`);
			openErrorNotification("Error al cargar la lista de empleados.");
		}
	}

	async function fetchClientes() {
		try {
			const token = localStorage.getItem("token");
			const user = localStorage.getItem("user_name");

			if (!token) {
				navigate("/error", {
					state: {
						errorCode: 401,
						mensaje: "Debe iniciar sesión para continuar.",
					},
				});
			}

			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/usuarios/clientes`,
				{
					headers: { 
						Authorization: `Bearer ${token}`,
						user: user
				
					},
				}
			);

			setClientes(response.data);
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
			console.error(`Error al obtener los clientes`);
		}
	}

	const handleSaveClick = () => {
		if (formRef) {
			formRef.dispatchEvent(
				new Event("submit", { cancelable: true, bubbles: true })
			);
		}
	};

	const getFechaHoy = () => {
		const today = new Date();
		return today.toISOString().split("T")[0];
	};

	return (
		<Modal
			scrollable
			show={show}
			onHide={handleClose}
			size="xl"
			centered
			dialogClassName="proyecto-modal"
		>
			{contextHolder}
			<Modal.Header closeButton>
				<Modal.Title>{proyecto?.nombre || ""}</Modal.Title>
			</Modal.Header>
			<Modal.Body
				className="p-4"
				style={{ maxHeight: "70vh", overflowY: "auto" }}
			>
				{!proyecto ? (
					<div className="text-center p-5">
						<p>Cargando proyecto...</p>
					</div>
				) : (
					<>
						<div className="d-flex justify-content-between align-items-center mb-3">
							<h5 className="mb-0">Información del Proyecto</h5>
						</div>

						<div className="proyecto-info mb-4">
							<div className="row mb-3">
								<div className="col-md-6">
									<div className="info-item">
										<div className="text-muted mb-1">Fecha de Solicitud</div>
										<div className="fw-medium">
											{new Date(proyecto.fecha_creacion).toLocaleDateString()}
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
											onChange={handleChangeEstado}
										>
											{estados.map((opcion) =>
												renderOptionsEstados(opcion, proyecto.estado)
											)}
										</select>
									</div>
								</div>
							</div>
						</div>

						<form onSubmit={handleSubmit} ref={(el) => setFormRef(el)}>
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
									value={proyecto.nombre}
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
									rows={6}
									placeholder="Describa su solicitud"
									required
									value={proyecto.descripcion}
									onChange={handleChange}
									disabled={estado === "Cancelado" || estado === "Finalizado"}
								></textarea>
							</div>
							<div className="mb-3">
								<label htmlFor="cliente" className="form-label">
									Cliente
								</label>
								<select
									className="form-select form_input"
									name="cliente"
									id="cliente"
									onChange={handleChange}
									disabled={estado === "Cancelado" || estado === "Finalizado"}
								>
									{clientes.map((cliente) =>
										renderOptionsClientes(cliente, proyecto.cliente_id)
									)}
								</select>
							</div>
							<div className="mb-3">
								<label htmlFor="colab" className="form-label ">
									Colaboradores:
								</label>
								<select
									className="form-select"
									name="colab"
									id="colab"
									multiple
								>
									{empleados.map((colab) => renderColab(colab))}
								</select>
							</div>
							<div className="row">
								<div className="col-md-6">
									<div className="mb-3 form-check">
										<input
											type="checkbox"
											className="form-check-input custom-checkbox"
											id="urgente"
											name="urgente"
											checked={proyecto.urgente}
											onChange={handleChangeCheckBox}
											disabled={
												estado === "Cancelado" || estado === "Finalizado"
											}
										/>
										<label className="form-check-label" htmlFor="urgente">
											Urgente
										</label>
									</div>
								</div>
								<div className="col-md-6">
									<div className="mb-3">
										<label htmlFor="fecha_entrega" className="form-label">
											Fecha de Entrega
										</label>
										<input
											type="date"
											className="form-control"
											id="fecha_entrega"
											name="fecha_entrega"
											required
											onChange={handleChange}
											value={
												new Date(proyecto.fecha_entrega)
													.toISOString()
													.split("T")[0]
											}
											min={getFechaHoy()}
											disabled={
												estado === "Cancelado" || estado === "Finalizado"
											}
										/>
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
					disabled={
						!proyecto || estado === "Cancelado" || estado === "Finalizado"
					}
				>
					Guardar
				</button>
			</Modal.Footer>
		</Modal>
	);
};

export default ModalEditarProyecto;
