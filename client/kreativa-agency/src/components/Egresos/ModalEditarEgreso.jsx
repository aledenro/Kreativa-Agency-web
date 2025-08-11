import { Modal, Form } from "react-bootstrap";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import validTokenActive, { updateSessionStatus } from "../../utils/validateToken";

const ModalEditarEgreso = ({ show, handleClose, egreso, onSave }) => {
	const [egresoEditado, setEgresoEditado] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const navigate = useNavigate();

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

		if (egreso && Object.keys(egreso).length > 0) {
			setEgresoEditado(egreso);
		}
	}, [egreso, show]);

	useEffect(() => {
		if (show) {
			setIsSubmitting(false);
		}
	}, [show]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setEgresoEditado((prev) => ({ ...prev, [name]: value }));
	};

	const validateForm = () => {
		if (!egresoEditado.monto || egresoEditado.monto <= 0) {
			openErrorNotification("El monto debe ser mayor a 0.");
			return false;
		}
		if (!egresoEditado.categoria) {
			openErrorNotification("Debe seleccionar una categoría.");
			return false;
		}
		if (!egresoEditado.descripcion || !egresoEditado.descripcion.trim()) {
			openErrorNotification("La descripción es obligatoria.");
			return false;
		}
		if (!egresoEditado.proveedor || !egresoEditado.proveedor.trim()) {
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

		const enviar = confirm("¿Está seguro de que desea actualizar este egreso?");
		if (!enviar) return;

		setIsSubmitting(true);

		const token = localStorage.getItem("token");
    const user = localStorage.getItem("user_name");

		if (!token) {
			handleUnauthorized("Acceso no autorizado.");
			return;
		}

		try {
			const res = await axios.put(
				`${import.meta.env.VITE_API_URL}/egresos/${egresoEditado._id}`,
				egresoEditado,
				{ headers: { Authorization: `Bearer ${token}`, user: user } }
			);
			if (res.status === 200) {
				openSuccessNotification("Egreso actualizado exitosamente.");
				setTimeout(() => {
					onSave && onSave(egresoEditado);
					handleClose();
				}, 1500);
			}
		} catch (error) {
			if (error.status === 401) {
      await updateSessionStatus();
				handleUnauthorized();
				return;
			}

			const errorMessage =
				error.response?.data?.message ||
				"Error al actualizar el egreso. Por favor, intente nuevamente.";
			openErrorNotification(errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			{contextHolder}
			<Modal
				show={show && egresoEditado && Object.keys(egresoEditado).length > 0}
				onHide={handleClose}
			>
				<Modal.Header closeButton>
					<Modal.Title>Editar Egreso</Modal.Title>
				</Modal.Header>
				<form onSubmit={handleSubmit}>
					<Modal.Body>
						<div className="mb-3">
							<label>Fecha:</label>
							<input
								type="text"
								className="form_input"
								value={new Date(egresoEditado.fecha).toLocaleDateString()}
								disabled
							/>
						</div>
						<div className="mb-3">
							<label>Monto:</label>
							<input
								type="number"
								name="monto"
								className="form_input"
								value={egresoEditado.monto || ""}
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
								value={egresoEditado.categoria || ""}
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
								value={egresoEditado.descripcion || ""}
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
								value={egresoEditado.proveedor || ""}
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
								value={egresoEditado.estado || ""}
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
							{isSubmitting ? "Guardando..." : "Guardar Cambios"}
						</button>
					</Modal.Footer>
				</form>
			</Modal>
		</>
	);
};

ModalEditarEgreso.propTypes = {
	show: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
	egreso: PropTypes.object.isRequired,
	onSave: PropTypes.func,
};

export default ModalEditarEgreso;
