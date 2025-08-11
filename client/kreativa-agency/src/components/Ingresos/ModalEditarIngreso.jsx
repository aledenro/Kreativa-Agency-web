import { Modal, Form, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import {validTokenActive, updateSessionStatus} from "../../utils/validateToken";

const ModalEditarIngreso = ({
	show,
	handleClose,
	ingreso,
	categories,
	onSave,
}) => {
	const [ingresoEditado, setIngresoEditado] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const navigate = useNavigate();

	const [api, contextHolder] = notification.useNotification();
	const today = new Date().toISOString().split('T')[0];

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

		if (ingreso && Object.keys(ingreso).length > 0) {
			setIngresoEditado({ ...ingreso });
		}
	}, [ingreso, show]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === "categoria") return; // No permitir cambiar categoría
		setIngresoEditado((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const validateForm = () => {
		if (!ingresoEditado.descripcion?.trim()) {
			openErrorNotification("La descripción es obligatoria.");
			return false;
		}
		if (!ingresoEditado.monto || ingresoEditado.monto <= 0) {
			openErrorNotification("El monto debe ser mayor a 0.");
			return false;
		}
		if (!ingresoEditado.fecha) {
			openErrorNotification("La fecha de vencimiento es obligatoria.");
			return false;
		}
		if (!ingresoEditado.estado) {
			openErrorNotification("Debe seleccionar un estado.");
			return false;
		}

		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		const enviar = confirm(
			"¿Está seguro que desea guardar los cambios en este ingreso?"
		);
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
				`${import.meta.env.VITE_API_URL}/ingresos/${ingresoEditado._id}`,
				ingresoEditado,
				{ headers: { 
					Authorization: `Bearer ${token}`,
					user: user
			 	} }
			);

			if (res.status === 200) {
				openSuccessNotification("Ingreso actualizado exitosamente.");

				setTimeout(() => {
					onSave && onSave(ingresoEditado);
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
				"Error al actualizar el ingreso. Por favor, intente nuevamente.";
			openErrorNotification(errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	};

	const getCategoryName = () => {
		if (!ingresoEditado.categoria) return "";
		const cat = categories.find(
			(cat) => cat._id.toString() === ingresoEditado.categoria.toString()
		);
		return cat ? cat.nombre : ingresoEditado.categoria;
	};

	const formatDateForInput = (dateString) => {
		if (!dateString) return "";
		const date = new Date(dateString);
		return date.toISOString().split("T")[0];
	};

	return (
		<>
			{contextHolder}
			<Modal
				show={show && ingresoEditado && Object.keys(ingresoEditado).length > 0}
				onHide={handleClose}
				size="lg"
			>
				<Modal.Header closeButton>
					<Modal.Title>Editar Ingreso</Modal.Title>
				</Modal.Header>
				<form onSubmit={handleSubmit}>
					<Modal.Body>
						<div className="row">
							<div className="col-md-6">
								<div className="mb-3">
									<label>Fecha Creación:</label>
									<input
										type="text"
										className="form_input"
										value={
											ingresoEditado.fecha_creacion
												? new Date(
														ingresoEditado.fecha_creacion
													).toLocaleDateString()
												: ""
										}
										disabled
									/>
								</div>
							</div>
							<div className="col-md-6">
								<div className="mb-3">
									<label>Cédula:</label>
									<input
										type="text"
										className="form_input"
										value={ingresoEditado.cedula || ""}
										disabled
									/>
								</div>
							</div>
						</div>

						<div className="row">
							<div className="col-md-6">
								<div className="mb-3">
									<label>Nombre Cliente:</label>
									<input
										type="text"
										className="form_input"
										value={ingresoEditado.nombre_cliente || ""}
										disabled
									/>
								</div>
							</div>
							<div className="col-md-6">
								<div className="mb-3">
									<label>Email:</label>
									<input
										type="text"
										className="form_input"
										value={ingresoEditado.email || ""}
										disabled
									/>
								</div>
							</div>
						</div>

						<div className="mb-3">
							<label>Categoría:</label>
							<input
								type="text"
								className="form_input"
								value={getCategoryName()}
								disabled
								title="La categoría no se puede modificar"
							/>
						</div>

						<div className="mb-3">
							<label>Descripción:</label>
							<textarea
								name="descripcion"
								className="form_input"
								value={ingresoEditado.descripcion || ""}
								onChange={handleChange}
								required
								disabled={isSubmitting}
								placeholder="Describa el servicio o producto"
								rows="3"
							/>
						</div>

						<div className="row">
							<div className="col-md-6">
								<div className="mb-3">
									<label>Monto:</label>
									<input
										type="number"
										name="monto"
										className="form_input"
										value={ingresoEditado.monto || ""}
										onChange={handleChange}
										required
										min="1"
										step="0.01"
										disabled={isSubmitting}
										placeholder="Ingrese el monto"
									/>
								</div>
							</div>
							<div className="col-md-6">
								<div className="mb-3">
									<label>Estado:</label>
									<Form.Select
										name="estado"
										value={ingresoEditado.estado || ""}
										onChange={handleChange}
										required
										disabled={isSubmitting}
										className="form_input"
									>
										<option value="Pendiente de pago">Pendiente de pago</option>
										<option value="Pagado">Pagado</option>
									</Form.Select>
								</div>
							</div>
						</div>

						<div className="mb-3">
							<label>Fecha Vencimiento:</label>
							<input
								type="date"
								name="fecha"
								className="form_input"
								value={formatDateForInput(ingresoEditado.fecha)}
								onChange={handleChange}
								required
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

ModalEditarIngreso.propTypes = {
	show: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
	ingreso: PropTypes.object.isRequired,
	categories: PropTypes.array.isRequired,
	onSave: PropTypes.func,
};

export default ModalEditarIngreso;
