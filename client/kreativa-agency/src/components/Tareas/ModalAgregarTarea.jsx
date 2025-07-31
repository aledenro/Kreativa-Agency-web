import axios from "axios";
import { useEffect, useState, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import sendEmail from "../../utils/emailSender";
import { notification } from "antd";

function construirJsonRequest(
	proyecto,
	nombre,
	descripcion,
	colaborador,
	prioridad,
	fechaEntrega
) {
	const user_id = localStorage.getItem("user_id");

	return {
		proyecto_id: proyecto,
		nombre: nombre,
		descripcion: descripcion,
		colaborador_id: colaborador,
		prioridad: prioridad,
		fecha_vencimiento: fechaEntrega,
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
	const [api, contextHolder] = notification.useNotification();
	const prioridades = ["Baja", "Media", "Alta"];
	const formRef = useRef(null);

	const [formData, setFormData] = useState({
		proyecto: proyectoId || "",
		nombre: "",
		descripcion: "",
		colab: "",
		prioridad: "",
		fecha_entrega: "",
	});

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
			setFormData((prevData) => ({
				...prevData,
				[name]: value,
				colab: "",
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
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

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

		const token = localStorage.getItem("token");

		const enviar = confirm("¿Desea enviar su tarea?");

		const data = construirJsonRequest(
			proyecto,
			nombre,
			descripcion,
			colab,
			prioridad,
			fecha_entrega
		);

		if (!enviar) {
			return;
		}

		try {
			const res = await axios.post(
				`${import.meta.env.VITE_API_URL}/tareas/crear`,
				data,
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			if (res.status === 201) {
				openSuccessNotification("Tarea creada correctamente.");

				resetForm();

				await sendEmail(
					colab,
					"Se le ha asignado una nueva tarea.",
					"Nueva Asignación de Trabajo",
					"Ver",
					"test"
				);

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

			openErrorNotification(
				"Error al crear la tarea, por favor trate nuevamente o comuníquese con el soporte técnico."
			);
		}
	};

	const getFechaHoy = () => {
		const today = new Date();
		return today.toISOString().split("T")[0];
	};

	const filtrarColaboradores = async (proyectoSeleccionado) => {
		if (!proyectoSeleccionado) {
			setColaboradoresFiltrados([]);
			return;
		}

		const proyectoEncontrado = proyectos.find(
			(proyecto) => proyecto._id === proyectoSeleccionado
		);

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
					`${import.meta.env.VITE_API_URL}/proyectos/id/${proyectoSeleccionado}`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);

				const proyectoData = response.data.proyecto || response.data;

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

			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/usuarios/empleados`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			setEmpleados(response.data);
		} catch (error) {
			console.error(`Error al obtener los empleados: ${error.message}`);
		}
	}

	async function fetchProyectos() {
		const token = localStorage.getItem("token");
		const rol = localStorage.getItem("tipo_usuario");
		const userId = localStorage.getItem("user_id");

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
			console.error(`Error al obtener los proyectos: ${error.message}`);
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
								/>
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
