import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Alert from "react-bootstrap/Alert";
import sendEmail from "../utils/emailSender";

function construirJsonRequest(
	proyecto,
	nombre,
	descripcion,
	colaborador,
	prioridad,
	fechaEntrega
) {
	return {
		proyecto_id: proyecto,
		nombre: nombre,
		descripcion: descripcion,
		colaborador_id: colaborador,
		prioridad: prioridad,
		fecha_vencimiento: fechaEntrega,
	};
}

function renderProyectos(proyecto, proyectoTareaId) {
	if (proyecto._id === proyectoTareaId) {
		return (
			<option key={proyecto._id} value={proyecto._id} selected>
				{proyecto.nombre}
			</option>
		);
	} else {
		return (
			<option key={proyecto._id} value={proyecto._id}>
				{proyecto.nombre}
			</option>
		);
	}
}

function renderColab(colab, proyectoColabId) {
	if (colab._id === proyectoColabId) {
		return (
			<option key={colab._id} value={colab._id} selected>
				{colab.nombre}
			</option>
		);
	} else {
		return (
			<option key={colab._id} value={colab._id}>
				{colab.nombre}
			</option>
		);
	}
}

function renderPrioridades(prioridad, tareaPrioridad) {
	if (prioridad === tareaPrioridad) {
		return (
			<option key={prioridad} defaultValue={prioridad} selected>
				{prioridad}
			</option>
		);
	} else {
		return (
			<option key={prioridad} value={prioridad}>
				{prioridad}
			</option>
		);
	}
}

function renderOptionsEstados(opcion, estadoTarea) {
	if (opcion === estadoTarea) {
		return (
			<option key={estadoTarea} value={estadoTarea} selected>
				{estadoTarea}
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

const EditarTarea = () => {
	const { id } = useParams();
	const [empleados, setEmpleados] = useState([]);
	const [proyectos, setProyectos] = useState([]);
	const [showAlert, setShowAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");
	const [alertVariant, setAlertVariant] = useState("danger");
	const [tarea, setTarea] = useState(null);
	const [estado, setEstado] = useState("");
	const [colaboradorOriginal, setColaboradorOriginal] = useState("");

	const prioridades = ["Baja", "Media", "Alta"];
	const estados = [
		"Por Hacer",
		"En Progreso",
		"Cancelado",
		"Finalizado",
		"En Revisión",
	];

	const handleChange = (e) => {
		const { name, value } = e.target;
		setTarea((prevTarea) => ({ ...prevTarea, [name]: value }));
	};

	const handleChangeEstado = async (event) => {
		event.preventDefault();
		const estadoEdit = event.target.value;
		const token = localStorage.getItem("token");
		const user = localStorage.getItem("user_name");

		try {
			const response = await axios.put(
				`${import.meta.env.VITE_API_URL}/tareas/editar/${id}`,
				{ estado: estadoEdit },
				{
					headers: {
						Authorization: `Bearer ${token}`,
						user: user,
					},
				}
			);

			if (response.status === 200) {
				setAlertMessage("Estado cambiado  correctamente.");
				setAlertVariant("success");
				setShowAlert(true);
				setEstado(estadoEdit);
				await addActionLog(`Cambió el estado de la tarea a: ${estadoEdit}.`);
			}
		} catch (error) {
			console.error(error.message);
			setAlertMessage(
				"Error al editar el estado de su tarea, por favor trate nuevamente o comuniquese con el soporte técnico."
			);
			setAlertVariant("danger");
			setShowAlert(true);
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		const enviar = confirm("¿Desea enviar su tarea?");

		if (!enviar) {
			return;
		}

		const formData = new FormData(event.target);

		const nombre = formData.get("nombre").trim();
		const descripcion = formData.get("descripcion").trim();
		const colab = formData.get("colab");
		const prioridad = formData.get("prioridad");
		const proyecto = formData.get("proyecto");
		const fechaEntrega = formData.get("fecha_entrega");

		const data = construirJsonRequest(
			proyecto,
			nombre,
			descripcion,
			colab,
			prioridad,
			fechaEntrega
		);
		const token = localStorage.getItem("token");
		const user = localStorage.getItem("user_name");

		try {
			const res = await axios.put(
				`${import.meta.env.VITE_API_URL}/tareas/editar/${id}`,
				data,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						user: user,
					},
				}
			);

			if (res.status == 200) {
				setAlertMessage("Tarea editada correctamente.");
				setAlertVariant("success");
				setShowAlert(true);
				await addActionLog("Editó la tarea.");

				if (colaboradorOriginal !== colab) {
					await sendEmail(
						colab,
						"Se le ha asignado una nueva tarea.",
						"Nueva Asignación de Trabajo",
						"Ver",
						"login"
					);
				}
			}
		} catch (error) {
			console.error(error.message);

			setAlertMessage(
				"Error al editar la tarea, por favor trate nuevamente o comuniquese con el soporte técnico."
			);
			setAlertVariant("danger");
			setShowAlert(true);
		}
	};

	const addActionLog = async (accion) => {
		const token = localStorage.getItem("token");

		try {
			const user_id = localStorage.getItem("user_id");
			const user = localStorage.getItem("user_name");

			await axios.put(
				`${import.meta.env.VITE_API_URL}/tareas/actualizarLog/${id}`,
				{
					usuario_id: user_id,
					accion: accion,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
						user: user,
					},
				}
			);
		} catch (error) {
			console.error(error.message);
		}
	};

	useEffect(() => {
		async function fetchEmpleados() {
			const token = localStorage.getItem("token");
			const user = localStorage.getItem("user_name");

			try {
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/usuarios/empleados`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
							user: user,
						},
					}
				);
				setEmpleados(response.data);
			} catch (error) {
				console.error(`Error al obtener los empleados: ${error.message}`);
			}
		}

		async function fetchProyectos() {
			const token = localStorage.getItem("token");
			const user = localStorage.getItem("user_name");

			try {
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/proyectos/getAllProyectosLimitedData`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
							user: user,
						},
					}
				);

				setProyectos(response.data.proyectos);
			} catch (error) {
				console.error(`Error al obtener los proyectos: ${error.message}`);
			}
		}

		async function fetchTarea() {
			const token = localStorage.getItem("token");
			const user = localStorage.getItem("user_name");

			try {
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/tareas/id/${id}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
							user: user,
						},
					}
				);

				setTarea(response.data);
				setEstado(response.data.estado);
				setColaboradorOriginal(response.data.colaborador_id._id);
			} catch (error) {
				console.error(`Error al obtener la tarea: ${error.message}`);
			}
		}

		fetchTarea();
		fetchProyectos();
		fetchEmpleados();
	}, [id]);

	if (!tarea) {
		return (
			<div className="container d-flex align-items-center justify-content-center">
				<p>Cargando tarea...</p>
			</div>
		);
	}

	return (
		<div>
			<Navbar></Navbar>
			<div className="container d-flex align-items-center justify-content-center">
				<div className="card p-4 shadow-lg w-50">
					<h3 className="text-center section-title">Editar Tarea</h3>
					<div className="row mb-3">
						<div className="col mx-3">
							Fecha de Solicitud:{" "}
							<small>
								{new Date(tarea.fecha_creacion).toLocaleDateString()}
							</small>
						</div>
						<div className="col mx-3">
							<label htmlFor="estado" className="form-label">
								Estado
							</label>
							<select
								className="form-select form_input"
								name="estado"
								id="estado"
								onChange={handleChangeEstado}
							>
								{estados.map((opcion) =>
									renderOptionsEstados(opcion, tarea.estado)
								)}
							</select>
						</div>
					</div>
					<form onSubmit={handleSubmit}>
						{showAlert && (
							<Alert
								variant={alertVariant}
								onClose={() => setShowAlert(false)}
								dismissible
							>
								{alertMessage}
							</Alert>
						)}
						<div className="mb-3">
							<label htmlFor="proyecto" className="form-label">
								Proyecto
							</label>
							<select
								className="form-select form_input"
								name="proyecto"
								id="proyecto"
								disabled={estado === "Cancelado" || estado === "Finalizado"}
							>
								{proyectos.map((proyecto) =>
									renderProyectos(proyecto, tarea.proyecto_id)
								)}
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
								rows={7}
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
								disabled={estado === "Cancelado" || estado === "Finalizado"}
							>
								{empleados.map((colab) =>
									renderColab(colab, tarea.colaborador_id)
								)}
							</select>
						</div>
						<div className="row">
							<div className="col">
								<div className="mb-3">
									<label className="form-label" htmlFor="prioridad">
										Prioridad
									</label>
									<select
										className="form-select form_input"
										name="prioridad"
										id="prioridad"
										disabled={estado === "Cancelado" || estado === "Finalizado"}
									>
										{prioridades.map((prioridad) =>
											renderPrioridades(prioridad, tarea.prioridad)
										)}
									</select>
								</div>
							</div>
							<div className="col">
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
										value={
											new Date(tarea.fecha_vencimiento)
												.toISOString()
												.split("T")[0]
										}
										onChange={handleChange}
										disabled={estado === "Cancelado" || estado === "Finalizado"}
									/>
								</div>
							</div>
						</div>
						<button
							type="submit"
							className="thm-btn"
							disabled={estado === "Cancelado" || estado === "Finalizado"}
						>
							Guardar
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default EditarTarea;
