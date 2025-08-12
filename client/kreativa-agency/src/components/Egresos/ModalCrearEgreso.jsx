import { Modal, Form } from "react-bootstrap";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { notification } from "antd";
import {
	validTokenActive,
	updateSessionStatus,
} from "../../utils/validateToken";

const ModalCrearEgreso = ({ show, handleClose, onSave }) => {
	const navigate = useNavigate();

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState({
		fecha: "",
		monto: "",
		categoria: "",
		descripcion: "",
		proveedor: "",
		estado: "Pendiente",
	});
	const today = new Date().toISOString().split("T")[0];

	const [api, contextHolder] = notification.useNotification();

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
				fecha: "",
				monto: "",
				categoria: "",
				descripcion: "",
				proveedor: "",
				estado: "Pendiente",
			});
			setIsSubmitting(false);
		}
	}, [show]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const validateForm = () => {
		if (!formData.fecha) {
			openErrorNotification("La fecha es obligatoria.");
			return false;
		}
		if (!formData.monto || formData.monto <= 0) {
			openErrorNotification("El monto debe ser mayor a 0.");
			return false;
		}
		if (!formData.categoria) {
			openErrorNotification("Debe seleccionar una categoría.");
			return false;
		}
		if (!formData.descripcion.trim()) {
			openErrorNotification("La descripción es obligatoria.");
			return false;
		}
		if (!formData.proveedor.trim()) {
			openErrorNotification("El proveedor es obligatorio.");
			return false;
		}
		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		const enviar = confirm("¿Está seguro de que desea crear este egreso?");
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
				`${import.meta.env.VITE_API_URL}/egresos`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						user: user,
					},
				}
			);
			if (res.status === 201) {
				openSuccessNotification("Egreso creado exitosamente.");
				setTimeout(() => {
					onSave && onSave();
					handleClose();
				}, 1500);
			}
		} catch (error) {
			if (error.status === 401) {
				handleUnauthorized();

				return;
			}

			const errorMessage =
				error.response?.data?.message ||
				"Error al crear el egreso. Por favor, intente nuevamente.";
			openErrorNotification(errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			{contextHolder}
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Crear Egreso</Modal.Title>
				</Modal.Header>
				<form onSubmit={handleSubmit}>
					<Modal.Body>
						<div className="mb-3">
							<label>Fecha:</label>
							<input
								type="date"
								name="fecha"
								className="form_input"
								value={formData.fecha}
								onChange={handleChange}
								disabled={isSubmitting}
								required
								min={today}
							/>
						</div>
						<div className="mb-3">
							<label>Monto:</label>
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
								required
							/>
						</div>
						<div className="mb-3">
							<label>Categoría:</label>
							<Form.Select
								name="categoria"
								value={formData.categoria}
								onChange={handleChange}
								disabled={isSubmitting}
								required
								className="form_input"
							>
								<option value="">Seleccione una categoría</option>
								<option value="Salarios">Salarios</option>
								<option value="Software">Software</option>
								<option value="Servicios de contabilidad">
									Servicios de contabilidad
								</option>
								<option value="Servicios">Servicios</option>
							</Form.Select>
						</div>
						<div className="mb-3">
							<label>Descripción:</label>
							<input
								type="text"
								name="descripcion"
								className="form_input"
								value={formData.descripcion}
								onChange={handleChange}
								disabled={isSubmitting}
								placeholder="Describa el egreso"
								required
							/>
						</div>
						<div className="mb-3">
							<label>Proveedor:</label>
							<input
								type="text"
								name="proveedor"
								className="form_input"
								value={formData.proveedor}
								onChange={handleChange}
								disabled={isSubmitting}
								placeholder="Nombre del proveedor"
								required
							/>
						</div>
						<div className="mb-3">
							<label>Estado:</label>
							<Form.Select
								name="estado"
								value={formData.estado}
								onChange={handleChange}
								disabled={isSubmitting}
								required
								className="form_input"
							>
								<option value="Pendiente">Pendiente</option>
								<option value="Aprobado">Aprobado</option>
								<option value="Rechazado">Rechazado</option>
							</Form.Select>
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
							disabled={isSubmitting}
						>
							{isSubmitting ? "Creando..." : "Crear"}
						</button>
					</Modal.Footer>
				</form>
			</Modal>
		</>
	);
};

ModalCrearEgreso.propTypes = {
	show: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
	onSave: PropTypes.func,
};

export default ModalCrearEgreso;
