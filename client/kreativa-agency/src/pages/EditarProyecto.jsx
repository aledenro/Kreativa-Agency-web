import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import Alert from "react-bootstrap/Alert";
import sendEmail from "../utils/emailSender";

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
	return {
		cliente_id: cliente,
		nombre: nombre,
		descripcion: descripcion,
		urgente: urgente,
		fecha_entrega: fechaEntrega,
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

const AgregarProyecto = () => {
	const { id } = useParams();
	const [clientes, setClientes] = useState([]);
	const [proyecto, setProyecto] = useState(null);
	const [estado, setEstado] = useState("");
	const [showAlert, setShowAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");
	const [alertVariant, setAlertVariant] = useState("danger");
	const [empleados, setEmpleados] = useState([]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setProyecto((prevProyecto) => ({ ...prevProyecto, [name]: value }));
	};

	const handleChangeCheckBox = (e) => {
		const { name, checked } = e.target;
		setProyecto((prevProyecto) => ({ ...prevProyecto, [name]: checked }));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		const enviar = confirm("¿Desea editar el proyecto?");

		if (!enviar) {
			return;
		}

		const formData = new FormData(event.target);

		const nombre = formData.get("nombre");
		const descripcion = formData.get("descripcion");
		const cliente = formData.get("cliente");
		const urgente = formData.get("urgente") === "on";
		const fechaEntrega = formData.get("fecha_entrega");
		const colab = formData.getAll("colab");

		const colabFormateado = [];

		colab.forEach((colaborador) => {
			colabFormateado.push({ colaborador_id: colaborador });
		});

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

		try {
			const res = await axios.put(
				`${import.meta.env.VITE_API_URL}/proyectos/editar/${id}`,
				data,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						user: user,
					},
				}
			);

			if (res.status == 200) {
				setAlertMessage("Proyecto editado correctamente.");
				setAlertVariant("success");
				setShowAlert(true);
				await addActionLog("Editó el proyecto.");
				fetchProyecto();
			}
		} catch (error) {
			console.error(error.message);
			setAlertMessage(
				"Error al editar su proyecto, por favor trate nuevamente o comuniquese con el soporte técnico."
			);
			setAlertVariant("danger");
			setShowAlert(true);
		}
	};

	const handleChangeEstado = async (event) => {
		event.preventDefault();
		const estadoEdit = event.target.value;

		const token = localStorage.getItem("token");
		const user = localStorage.getItem("user_name");

		try {
			const response = await axios.put(
				`${import.meta.env.VITE_API_URL}/proyectos/editar/${id}`,
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
				await addActionLog(`Cambió el estado del proyecto a: ${estadoEdit}.`);

				if (estadoEdit !== "Finalizado") {
					await sendEmail(
						proyecto.cliente_id,
						`El estado de su proyecto ha sido actualizado a ${estadoEdit}.`,
						`Actualización en su proyecto ${proyecto.nombre}`,
						"Ver",
						"login"
					);
				} else {
					await sendEmail(
						proyecto.cliente_id,
						`El proyecto fue marcado como Finalizado por un colaborador de Kreativa Agency, ingresse para ver más detalles.`,
						`Actualización en su proyecto ${proyecto.nombre}`,
						"Ver",
						"login"
					);
				}
			}
		} catch (error) {
			console.error(error.message);
			setAlertMessage(
				"Error al editar el estado de su proyecto, por favor trate nuevamente o comuniquese con el soporte técnico."
			);
			setAlertVariant("danger");
			setShowAlert(true);
		}
	};

	const addActionLog = async (accion) => {
		try {
			const user_id = localStorage.getItem("user_id");
			const token = localStorage.getItem("token");
			const user = localStorage.getItem("user_name");

			await axios.put(
				`${import.meta.env.VITE_API_URL}/proyectos/actualizarLog/${id}`,
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

	function renderColab(colab) {
		const isSelected = proyecto.colaboradores.some(
			(proyectoColab) => colab._id === proyectoColab.colaborador_id._id
		);

		return (
			<option key={colab._id} value={colab._id} selected={isSelected}>
				{colab.nombre}
			</option>
		);
	}

	const fetchProyecto = useCallback(async () => {
		const token = localStorage.getItem("token");
		const user = localStorage.getItem("user_name");

		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/proyectos/id/${id}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						user: user,
					},
				}
			);

			if (response.status === 200) {
				setProyecto(response.data.proyecto);
				setEstado(response.data.estado);
			}

			fetchClientes();
		} catch (error) {
			console.error(`Error al obtener el proyecto: ${error.message}`);
		}
	}, [id]);

	useEffect(() => {
		fetchProyecto();
		async function fetchEmpleados() {
			try {
				const token = localStorage.getItem("token");
				const user = localStorage.getItem("user_name");

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

		fetchEmpleados();
	}, [fetchProyecto]);

	async function fetchClientes() {
		try {
			const token = localStorage.getItem("token");
			const user = localStorage.getItem("user_name");

			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/usuarios/clientes`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						user: user,
					},
				}
			);

			setClientes(response.data);
		} catch (error) {
			console.error(`Error al obtener los clientes: ${error.message}`);
		}
	}

	if (!proyecto) {
		return (
			<div className="container d-flex align-items-center justify-content-center">
				<p>Cargando proyecto...</p>
			</div>
		);
	}

	return (
		<div>
			<AdminLayout>
				<div className="container align-items-center justify-content-center">
					<div style={{ height: "90px" }}></div>
					<div className=" p-4">
						<h1 className="text-center section-title">Editar Proyecto</h1>
						{showAlert && (
							<Alert
								variant={alertVariant}
								onClose={() => setShowAlert(false)}
								dismissible
							>
								{alertMessage}
							</Alert>
						)}
						<div className="row mb-3">
							<div className="col mx-3">
								Fecha de Solicitud:{" "}
								<small>
									{new Date(proyecto.fecha_creacion).toLocaleDateString()}
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
										renderOptionsEstados(opcion, proyecto.estado)
									)}
								</select>
							</div>
						</div>
						<form onSubmit={handleSubmit}>
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
									rows={15}
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
									className="form-select form_input"
									name="colab"
									id="colab"
									multiple
								>
									{empleados.map((colab) => renderColab(colab))}
								</select>
							</div>
							<div className="row">
								<div className="col">
									<div className="mb-3 form-check">
										<input
											type="checkbox"
											className="form-check-input"
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
								<div className="col">
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
											disabled={
												estado === "Cancelado" || estado === "Finalizado"
											}
										/>
									</div>
								</div>
							</div>
							<button
								type="submit"
								className="thm-btn"
								disabled={estado === "Cancelado" || estado === "Finalizado"}
							>
								Enviar
							</button>
						</form>
					</div>
				</div>
			</AdminLayout>
		</div>
	);
};

export default AgregarProyecto;
