import axios from "axios";
import { useEffect, useState, useRef } from "react";
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
	const user_id = localStorage.getItem("user_id");

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
		log: [
			{
				usuario_id: user_id,
				accion: "Crear tarea.",
			},
		],
		comentarios: [],
		estado: "Por Hacer",
	};
}

const ModalAgregarTarea = ({
	show,
	handleClose,
	onUpdate,
	proyectoId = null,
}) => {
	const [empleados, setEmpleados] = useState([]);
	const [proyectos, setProyectos] = useState([]);
	const [colaboradoresFiltrados, setColaboradoresFiltrados] = useState([]);
	const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
	const [api, contextHolder] = notification.useNotification();
	const prioridades = ["Baja", "Media", "Alta"];
	const formRef = useRef(null);
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		proyecto: proyectoId || "",
		nombre: "",
		descripcion: "",
		colab: "",
		prioridad: "",
		fecha_entrega: "",
	});

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

	const handleUnauthorized = (
		errorMessage = "Debe volver a iniciar sesión para continuar."
	) => {
		localStorage.clear();
		navigate("/error", {
			state: {
				errorCode: 401,
				mensaje: errorMessage,
			},
		});
	};

	const validateTokenAndRedirect = () => {
		const token = localStorage.getItem("token");

		if (!token) {
			navigate("/error", {
				state: {
					errorCode: 401,
					mensaje: "Acceso no autorizado.",
				},
			});
			return false;
		}

		if (!validTokenActive()) {
			navigate("/error", {
				state: {
					errorCode: 401,
					mensaje: "Debe volver a iniciar sesión para continuar.",
				},
			});
			return false;
		}

		return true;
	};

	const handleChange = async (e) => {
		const { name, value } = e.target;

		if (name === "proyecto") {
			setFormData((prevData) => ({
				...prevData,
				[name]: value,
				colab: "",
				fecha_entrega: "",
			}));
			await filtrarColaboradores(value);
		} else {
			setFormData((prevData) => ({
				...prevData,
				[name]: value,
			}));
		}
	};

	const resetForm = () => {
		setFormData({
			proyecto: proyectoId || "",
			nombre: "",
			descripcion: "",
			colab: "",
			prioridad: "",
			fecha_entrega: "",
		});
		setProyectoSeleccionado(null);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!validateTokenAndRedirect()) {
			return;
		}

		const { proyecto, nombre, descripcion, colab, prioridad, fecha_entrega } =
			formData;

		if (
			!proyecto ||
			!nombre ||
			!descripcion ||
			!colab ||
			!prioridad ||
			!fecha_entrega
		) {
			openErrorNotification("Todos los campos son obligatorios.");
			return;
		}

		if (proyectoSeleccionado && proyectoSeleccionado.fecha_entrega) {
			const fechaTarea = new Date(fecha_entrega + "T00:00:00");
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

		const token = localStorage.getItem("token");
		const enviar = confirm("¿Desea enviar su tarea?");

		if (!enviar) {
			return;
		}

		const data = construirJsonRequest(
			proyecto,
			nombre,
			descripcion,
			colab,
			prioridad,
			fecha_entrega
		);

		try {
			const res = await axios.post(
				`${import.meta.env.VITE_API_URL}/tareas/crear`,
				data,
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			if (res.status === 201) {
				openSuccessNotification("Tarea creada correctamente.");
				resetForm();

				const fechaEntregaFormatted = new Date(
					fecha_entrega
				).toLocaleDateString("es-ES");
				const nombreProyecto =
					proyectoSeleccionado?.nombre || "Proyecto no especificado";

				const emailBody = `Se le ha asignado una nueva tarea "${nombre}" con los siguientes detalles al proyecto ${nombreProyecto} con fecha de entrega al ${fechaEntregaFormatted}. Por favor, acceda al sistema para revisar todos los detalles.`;

				try {
					await sendEmail(
						colab,
						emailBody,
						`Nueva Tarea Asignada`,
						"Acceder al Sistema",
						`tareas`
					);
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
				openErrorNotification("Error al crear la tarea.");
			}
		} catch (error) {
			console.error(error.message);

			if (error.response?.status === 401) {
				handleUnauthorized();
				return;
			}

			openErrorNotification(
				"Error al crear la tarea, por favor trate nuevamente o comuníquese con el soporte técnico."
			);
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
				if (error.response?.status === 401) {
					handleUnauthorized();
					return;
				}
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

			if (colaboradoresDelProyecto.length > 0) {
				setFormData((prev) => ({
					...prev,
					colab: colaboradoresDelProyecto[0]._id,
				}));
			} else {
				setFormData((prev) => ({
					...prev,
					colab: "",
				}));
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

				if (colaboradoresDelProyecto.length > 0) {
					setFormData((prev) => ({
						...prev,
						colab: colaboradoresDelProyecto[0]._id,
					}));
				} else {
					setFormData((prev) => ({
						...prev,
						colab: "",
					}));
				}
			} catch (error) {
				if (error.response?.status === 401) {
					handleUnauthorized();
					return;
				}

				setColaboradoresFiltrados(empleados);

				if (empleados.length > 0) {
					setFormData((prev) => ({
						...prev,
						colab: empleados[0]._id,
					}));
				}
			}
		}
	};

	useEffect(() => {
		if (!validateTokenAndRedirect()) {
			return;
		}

		if (show) {
			fetchEmpleados();
			fetchProyectos();
			resetForm();
		}
	}, [show, proyectoId]);

	useEffect(() => {
		if (formData.proyecto && empleados.length > 0) {
			filtrarColaboradores(formData.proyecto);
		}
	}, [empleados, formData.proyecto]);

	async function fetchEmpleados() {
		try {
			const token = localStorage.getItem("token");

			if (!token) {
				navigate("/error", {
					state: {
						errorCode: 401,
						mensaje: "Debe iniciar sesión para continuar.",
					},
				});
				return;
			}

			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/usuarios/empleados`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			setEmpleados(response.data);
		} catch (error) {
			console.error(`Error al obtener los empleados`);
			if (error.response?.status === 401) {
				handleUnauthorized();
				return;
			}
		}
	}

	async function fetchProyectos() {
		const token = localStorage.getItem("token");
		const rol = localStorage.getItem("tipo_usuario");
		const userId = localStorage.getItem("user_id");

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
			let url = `${import.meta.env.VITE_API_URL}/proyectos`;

			if (rol === "Cliente") {
				url += `/cliente/${userId}`;
			} else if (rol === "Colaborador") {
				url += `/colaborador/${userId}`;
			}

			const response = await axios.get(url, {
				headers: { Authorization: `Bearer ${token}` },
			});

			setProyectos(response.data);

			if (response.data.length > 0 && !formData.proyecto && !proyectoId) {
				setFormData((prev) => ({
					...prev,
					proyecto: response.data[0]._id,
				}));
			}
		} catch (error) {
			console.error(`Error al obtener los proyectos`);
			if (error.response?.status === 401) {
				handleUnauthorized();
				return;
			}
		}
	}

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
				<Modal.Title>Agregar Tarea</Modal.Title>
			</Modal.Header>
			<Modal.Body
				className="p-4"
				style={{ maxHeight: "70vh", overflowY: "auto" }}
			>
				<form onSubmit={handleSubmit} ref={formRef}>
					<div className="mb-3">
						<label htmlFor="proyecto" className="form-label">
							Proyecto
						</label>
						<select
							className="form-select form_input"
							name="proyecto"
							id="proyecto"
							value={formData.proyecto}
							onChange={handleChange}
							required
							disabled={proyectoId !== null}
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
							value={formData.nombre}
							onChange={handleChange}
							required
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
							placeholder="Describa la tarea"
							value={formData.descripcion}
							onChange={handleChange}
							required
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
							value={formData.colab}
							onChange={handleChange}
							required
							disabled={!formData.proyecto}
						>
							<option value="">
								{formData.proyecto
									? "Seleccione un colaborador"
									: "Primero seleccione un proyecto"}
							</option>
							{colaboradoresFiltrados.map((colab) => (
								<option key={colab._id} value={colab._id}>
									{colab.nombre}
								</option>
							))}
						</select>
						{formData.proyecto && colaboradoresFiltrados.length === 0 && (
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
									value={formData.prioridad}
									onChange={handleChange}
									required
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
									className="form-control"
									id="fecha_entrega"
									name="fecha_entrega"
									value={formData.fecha_entrega}
									onChange={handleChange}
									required
									min={getFechaHoy()}
									max={getFechaMaxima()}
									disabled={!formData.proyecto}
								/>
								{proyectoSeleccionado && proyectoSeleccionado.fecha_entrega && (
									<small className="text-muted">
										Fecha máxima:{" "}
										{new Date(
											proyectoSeleccionado.fecha_entrega
										).toLocaleDateString("es-ES")}
									</small>
								)}
								{!formData.proyecto && (
									<small className="text-muted">
										Primero seleccione un proyecto
									</small>
								)}
							</div>
						</div>
					</div>
				</form>
			</Modal.Body>
			<Modal.Footer>
				<button
					type="button"
					className="thm-btn btn-gris me-2"
					onClick={handleClose}
				>
					Cancelar
				</button>
				<button type="button" className="thm-btn" onClick={handleSubmit}>
					Crear Tarea
				</button>
			</Modal.Footer>
		</Modal>
	);
};

export default ModalAgregarTarea;
