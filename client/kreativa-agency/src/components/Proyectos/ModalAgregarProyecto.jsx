import axios from "axios";
import { useEffect, useState, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import {validTokenActive, updateSessionStatus} from "../../utils/validateToken";
import sendEmail from "../../utils/emailSender";

function construirJsonRequest(
	nombre,
	descripcion,
	cliente,
	urgente,
	fechaEntrega,
	colaboradores
) {
	const user_id = localStorage.getItem("user_id");

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
		log: [
			{
				usuario_id: user_id,
				accion: "Crear proyecto.",
			},
		],
		notificiaciones: [],
		estado: "Por Hacer",
		historial_respuestas: [],
		colaboradores: colaboradores,
	};
}

const ModalAgregarProyecto = ({ show, handleClose, onUpdate }) => {
	const [clientes, setClientes] = useState([]);
	const [empleados, setEmpleados] = useState([]);
	const [api, contextHolder] = notification.useNotification();
	const formRef = useRef(null);
	const navigate = useNavigate();

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

		if (
			!nombre ||
			!descripcion ||
			!cliente ||
			!fechaEntrega ||
			colab.length === 0
		) {
			openErrorNotification(
				"Por favor complete todos los campos antes de crear el proyecto."
			);
			return;
		}

		const enviar = confirm("¿Desea crear este proyecto?");

		if (!enviar) {
			return;
		}

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
			const res = await axios.post(
				`${import.meta.env.VITE_API_URL}/proyectos/crear`,
				data,
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			if (res.status === 201 || res.status === 200) {
				if (formRef.current) {
					formRef.current.reset();
				}

				openSuccessNotification("Proyecto creado correctamente.");

				try {
					const fechaEntregaFormatted = new Date(
						fechaEntrega
					).toLocaleDateString("es-ES");
					const prioridadTexto = urgente ? "URGENTE" : "Normal";

					try {
						const emailBodyCliente = `Su proyecto "${nombre}" ha sido creado exitosamente con fecha de entrega al ${fechaEntregaFormatted}. Por favor, acceda al sistema para revisar todos los detalles y seguir el progreso.`;

						await sendEmail(
							cliente,
							emailBodyCliente,
							`Nuevo Proyecto Creado: ${nombre}`,
							"Ver",
							`dashboard`
						);
					} catch (emailError) {
						console.error("Error al enviar email");
					}

					for (const colaboradorId of colab) {
						try {
							const emailBodyColaborador = `Ha sido asignado al nuevo proyecto "${nombre}" con fecha de entrega al ${fechaEntregaFormatted}. Por favor, acceda al sistema para revisar todos los detalles del proyecto.`;

							await sendEmail(
								colaboradorId,
								emailBodyColaborador,
								`Nuevo Proyecto Asignado: ${nombre}`,
								"Ver",
								`dashboard`
							);
						} catch (emailError) {
							console.error(`Error al enviar email`);
						}
					}
				} catch (emailError) {
					console.error("Error general al enviar");
				}

				setTimeout(() => {
					if (typeof onUpdate === "function") {
						onUpdate();
					}

					setTimeout(() => {
						handleClose();
					});
				}, 1000);
			} else {
				openErrorNotification(
					"Error inesperado al crear el proyecto. Status: " + res.status
				);
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
				"Error al crear el proyecto, por favor trate nuevamente o comuníquese con el soporte técnico."
			);
		}
	};
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
			fetchClientes();
			fetchEmpleados();
		}
	}, [show]);

	async function fetchClientes() {
		try {
			const token = localStorage.getItem("token");

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
					headers: { Authorization: `Bearer ${token}` },
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
			openErrorNotification("Error al cargar la lista de clientes.");
		}
	}

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
			}

			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/usuarios/empleados`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			const empleadosActivos = response.data.filter(
				(empleado) => empleado.estado === "Activo"
			);

			setEmpleados(empleadosActivos);
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

	const getFechaHoy = () => {
		const today = new Date();
		return today.toISOString().split("T")[0];
	};

	const handleSaveClick = () => {
		if (formRef.current) {
			formRef.current.dispatchEvent(
				new Event("submit", { cancelable: true, bubbles: true })
			);
		}
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
				<Modal.Title>Agregar Proyecto</Modal.Title>
			</Modal.Header>
			<Modal.Body
				className="p-4"
				style={{ maxHeight: "70vh", overflowY: "auto" }}
			>
				<form onSubmit={handleSubmit} ref={formRef}>
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
						></textarea>
					</div>
					<div className="mb-3">
						<label htmlFor="cliente" className="form-label">
							Cliente
						</label>
						<select
							className="form_input form-select"
							name="cliente"
							id="cliente"
							required
							defaultValue=""
						>
							<option value="" disabled>
								Seleccione un cliente
							</option>
							{clientes.map((cliente) => (
								<option key={cliente._id} value={cliente._id}>
									{cliente.nombre}
								</option>
							))}
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
							required
						>
							{empleados.map((colab) => (
								<option key={colab._id} value={colab._id}>
									{colab.nombre}
								</option>
							))}
						</select>
					</div>
					<div className="row">
						<div className="col-md-6">
							<div className="mb-3 form-check">
								<input
									type="checkbox"
									className="form-check-input form-checkbox"
									id="urgente"
									name="urgente"
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
					Cerrar
				</button>
				<button type="button" className="thm-btn" onClick={handleSaveClick}>
					Crear Proyecto
				</button>
			</Modal.Footer>
		</Modal>
	);
};

export default ModalAgregarProyecto;
