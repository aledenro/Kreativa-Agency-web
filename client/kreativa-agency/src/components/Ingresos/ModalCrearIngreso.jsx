import { Modal, Alert, Form } from "react-bootstrap";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import {validTokenActive, updateSessionStatus} from "../../utils/validateToken";

const ModalCrearIngreso = ({ show, handleClose, categories, onSave }) => {
	const navigate = useNavigate();
	const [nombreCliente, setNombreCliente] = useState("");
	const [emailCliente, setEmailCliente] = useState("");
	const [errorCedula, setErrorCedula] = useState("");
	const [estadoCliente, setEstadoCliente] = useState("Activo");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [clienteEncontrado, setClienteEncontrado] = useState(false);

	const [api, contextHolder] = notification.useNotification();

	const today = new Date().toISOString().split('T')[0];

	const [formData, setFormData] = useState({
		cedula: "",
		categoria: "",
		monto: "",
		descripcion: "",
		estado: "Pendiente de pago",
		fecha: "",
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

	const openWarningNotification = (message) => {
		api.warning({
			message: "Advertencia",
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
	}, [show]);

	useEffect(() => {
		if (show) {
			setFormData({
				cedula: "",
				categoria: "",
				monto: "",
				descripcion: "",
				estado: "Pendiente de pago",
				fecha: "",
			});
			setNombreCliente("");
			setEmailCliente("");
			setErrorCedula("");
			setEstadoCliente("Activo");
			setClienteEncontrado(false);
			setIsSubmitting(false);
		}
	}, [show]);

	const validarCedula = (cedula) => /^[0-9]{8,9}$/.test(cedula);

	const buscarNombreCliente = async () => {
		if (!formData.cedula.trim()) {
			setNombreCliente("");
			setEmailCliente("");
			setErrorCedula("");
			setClienteEncontrado(false);
			setEstadoCliente("Activo");
			return;
		}

		if (!validarCedula(formData.cedula)) {
			setErrorCedula("La cédula debe tener entre 8 y 9 dígitos.");
			setNombreCliente("");
			setEmailCliente("");
			setEstadoCliente("Inactivo");
			setClienteEncontrado(false);
			return;
		}

		try {
			const token = localStorage.getItem("token");
			const user = localStorage.getItem("user_name");

			if (!token) {
				handleUnauthorized("Debe iniciar sesión para continuar.");
				return;
			}

			const res = await axios.get(
				`${import.meta.env.VITE_API_URL}/ingresos/buscarPorCedula/${formData.cedula}`,
				{
					headers: { 
						Authorization: `Bearer ${token}`,
						user: user
				
					},
				}
			);

			if (res.data) {
				setNombreCliente(res.data.nombre);
				setEmailCliente(res.data.email);
				setEstadoCliente(res.data.estado || "Inactivo");
				setClienteEncontrado(true);

				if (res.data.estado !== "Activo") {
					setErrorCedula("El cliente está inactivo.");
					openWarningNotification("El cliente seleccionado está inactivo.");
				} else {
					setErrorCedula("");
				}
			} else {
				setNombreCliente("");
				setEmailCliente("");
				setEstadoCliente("Inactivo");
				setClienteEncontrado(false);
				setErrorCedula("Cliente no encontrado");
				openErrorNotification("Cliente no encontrado en el sistema.");
			}
		} catch (error) {
			if (error.status === 401) {
				await updateSessionStatus();				handleUnauthorized();
				return;
			}

			setNombreCliente("");
			setEmailCliente("");
			setEstadoCliente("Inactivo");
			setClienteEncontrado(false);

			if (error.response?.status === 404) {
				setErrorCedula("Cliente no encontrado");
				openErrorNotification("No se encontró un cliente con esta cédula.");
			} else {
				setErrorCedula("Error al buscar cliente");
				openErrorNotification(
					"Error al buscar el cliente. Por favor, intente nuevamente."
				);
			}
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const validateForm = () => {
		if (!formData.cedula.trim()) {
			openErrorNotification("La cédula es obligatoria.");
			return false;
		}
		if (!validarCedula(formData.cedula)) {
			openErrorNotification("La cédula debe tener entre 8 y 9 dígitos.");
			return false;
		}
		if (!clienteEncontrado) {
			openErrorNotification("Debe buscar y seleccionar un cliente válido.");
			return false;
		}
		if (estadoCliente !== "Activo") {
			openErrorNotification(
				"No se puede crear un ingreso para un cliente inactivo."
			);
			return false;
		}
		if (!formData.categoria) {
			openErrorNotification("Debe seleccionar una categoría.");
			return false;
		}
		if (!formData.monto || formData.monto <= 0) {
			openErrorNotification("El monto debe ser mayor a 0.");
			return false;
		}
		if (!formData.descripcion.trim()) {
			openErrorNotification("La descripción es obligatoria.");
			return false;
		}
		if (!formData.fecha) {
			openErrorNotification("La fecha de vencimiento es obligatoria.");
			return false;
		}

		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		const enviar = confirm("¿Está seguro de que desea crear este ingreso?");
		if (!enviar) return;

		setIsSubmitting(true);

		const token = localStorage.getItem("token");
		const user = localStorage.getItem("user_name");

		if (!token) {
			handleUnauthorized("Acceso no autorizado.");
			return;
		}

		try {
			const res = await axios.post(
				`${import.meta.env.VITE_API_URL}/ingresos`,
				formData,
				{ headers: { 
					Authorization: `Bearer ${token}`,
					user: user
			 	} }
			);

			if (res.status === 201) {
				openSuccessNotification("Ingreso creado exitosamente.");

				setTimeout(() => {
					onSave && onSave();
					handleClose();
				}, 1500);
			}
		} catch (error) {
			if (error.status === 401) {
				await updateSessionStatus();				handleUnauthorized();
				return;
			}

			const errorMessage =
				error.response?.data?.message ||
				"Error al crear el ingreso. Por favor, intente nuevamente.";
			openErrorNotification(errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			{contextHolder}
			<Modal show={show} onHide={handleClose} size="lg">
				<Modal.Header closeButton>
					<Modal.Title>Crear Ingreso</Modal.Title>
				</Modal.Header>
				<form onSubmit={handleSubmit}>
					<Modal.Body>
						<div className="mb-3">
							<label>Cédula</label>
							<input
								type="text"
								name="cedula"
								className="form_input"
								value={formData.cedula}
								onChange={(e) => {
									handleChange(e);
									setNombreCliente("");
									setEmailCliente("");
									setErrorCedula("");
									setClienteEncontrado(false); // Resetear cuando cambia la cédula
									setEstadoCliente("Activo");
								}}
								onBlur={buscarNombreCliente}
								disabled={isSubmitting}
								placeholder="Ingrese la cédula del cliente"
							/>
							{errorCedula && (
								<small className="text-danger">{errorCedula}</small>
							)}
						</div>

						<div className="mb-3">
							<label>Nombre del Cliente</label>
							<input
								type="text"
								className="form_input"
								value={nombreCliente}
								readOnly
								placeholder="Se autocompleta si la cédula es válida"
							/>
						</div>

						<div className="mb-3">
							<label>Email</label>
							<input
								type="text"
								className="form_input"
								value={emailCliente}
								readOnly
								placeholder="Se autocompleta si la cédula es válida"
							/>
						</div>

						<div className="mb-3">
							<label>Categoría</label>
							<Form.Select
								name="categoria"
								value={formData.categoria}
								onChange={handleChange}
								disabled={isSubmitting}
								className="form_input"
							>
								<option value="">Seleccione una categoría</option>
								{categories.map((cat) => (
									<option key={cat._id} value={cat._id}>
										{cat.nombre}
									</option>
								))}
							</Form.Select>
						</div>

						<div className="mb-3">
							<label>Monto</label>
							<input
								type="number"
								name="monto"
								className="form_input"
								value={formData.monto}
								onChange={handleChange}
								min="1"
								step="0.01"
								disabled={isSubmitting}
								placeholder="Ingrese el monto"
							/>
						</div>

						<div className="mb-3">
							<label>Descripción</label>
							<textarea
								name="descripcion"
								className="form_input"
								value={formData.descripcion}
								onChange={handleChange}
								disabled={isSubmitting}
								placeholder="Describa el servicio o producto"
								rows="3"
							/>
						</div>

						<div className="mb-3">
							<label>Estado</label>
							<Form.Select
								name="estado"
								value={formData.estado}
								onChange={handleChange}
								disabled={isSubmitting}
								className="form_input"
							>
								<option value="Pendiente de pago">Pendiente de pago</option>
								<option value="Pagado">Pagado</option>
							</Form.Select>
						</div>

						<div className="mb-3">
							<label>Fecha Vencimiento:</label>
							<input
								type="date"
								name="fecha"
								className="form_input"
								value={formData.fecha}
								onChange={handleChange}
								disabled={isSubmitting}
								min={today}
							/>
						</div>
					</Modal.Body>
					<Modal.Footer>
						<button
							type="button"
							className="thm-btn thm-btn-small btn-gris mx-1"
							onClick={handleClose}
							disabled={isSubmitting}
						>
							Cancelar
						</button>
						<button
							type="submit"
							className="thm-btn thm-btn-small"
							disabled={
								!clienteEncontrado || estadoCliente !== "Activo" || isSubmitting
							}
						>
							{isSubmitting ? "Creando..." : "Crear"}
						</button>
					</Modal.Footer>
				</form>
			</Modal>
		</>
	);
};

ModalCrearIngreso.propTypes = {
	show: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
	categories: PropTypes.array.isRequired,
	onSave: PropTypes.func,
};

export default ModalCrearIngreso;
