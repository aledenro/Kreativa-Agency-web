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

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
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

	useEffect(() => {
		if (show) {
			fetchEmpleados();
			fetchProyectos();
			resetForm();
		}
	}, [show, proyectoId]);

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

			if (response.data.length > 0 && !formData.colab) {
				setFormData((prev) => ({
					...prev,
					colab: response.data[0]._id,
				}));
			}
		} catch (error) {
			console.error(`Error al obtener los empleados: ${error.message}`);
		}
	}

	async function fetchProyectos() {
		const token = localStorage.getItem("token");

		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/proyectos/getAllProyectosLimitedData`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			setProyectos(response.data.proyectos);

			if (
				response.data.proyectos.length > 0 &&
				!formData.proyecto &&
				!proyectoId
			) {
				setFormData((prev) => ({
					...prev,
					proyecto: response.data.proyectos[0]._id,
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
						>
							<option value="">Seleccione un colaborador</option>
							{empleados.map((colab) => (
								<option key={colab._id} value={colab._id}>
									{colab.nombre}
								</option>
							))}
						</select>
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
