import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tab from "react-bootstrap/Tab";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import sendEmailExterno from "../../utils/sendEmailExterno";
import {validTokenActive, updateSessionStatus} from "../../utils/validateToken";
import axios from "axios";

const ModalVerContacto = ({ show, handleClose, form, onUpdate }) => {
	const [subject, setSubject] = useState("");
	const [message, setMessage] = useState("");
	const [sending, setSending] = useState(false);
	const [updatingStatus, setUpdatingStatus] = useState(false);
	const [currentForm, setCurrentForm] = useState(form);
	const navigate = useNavigate();

	const [api, contextHolder] = notification.useNotification();

	const showNotification = (type, message) => {
		api[type]({
			message: type === "success" ? "Éxito" : "Error",
			description: message,
			placement: "top",
			duration: 3,
		});
	};

	useEffect(() => {
		setCurrentForm(form);
	}, [form]);

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
	}, [navigate]);

	const handleChangeEstado = async (event) => {
		const nuevoEstado = event.target.value === "true";
		const token = localStorage.getItem("token");
		const user = localStorage.getItem("user_name");

		if (!token) {
			navigate("/error", {
				state: {
					errorCode: 401,
					mensaje: "Acceso no autorizado.",
				},
			});
			return;
		}

		const confirmar = window.confirm(
			`¿Está seguro que desea ${nuevoEstado ? "activar" : "desactivar"} este formulario?`
		);

		if (!confirmar) {
			return;
		}

		try {
			setUpdatingStatus(true);
			await axios.put(
				`${import.meta.env.VITE_API_URL}/contacto/actualizar/${currentForm._id}`,
				{ activo: nuevoEstado },
				{ headers: { 
					Authorization: `Bearer ${token}`,
					user: user
			 	} }
			);

			showNotification("success", "Estado actualizado correctamente.");

			setCurrentForm((prev) => ({ ...prev, activo: nuevoEstado }));

			if (onUpdate) {
				onUpdate();
			}
		} catch (error) {
			if (error.status === 401) {
				await updateSessionStatus();
				localStorage.clear();
				navigate("/error", {
					state: {
						errorCode: 401,
						mensaje: "Debe volver a iniciar sesión para continuar.",
					},
				});
				return;
			}
			showNotification(
				"error",
				"Error al cambiar el estado. Intente nuevamente."
			);
		} finally {
			setUpdatingStatus(false);
		}
	};

	const handleSendEmail = async (event) => {
		event.preventDefault();

		if (!currentForm?.correo) {
			showNotification("error", "El campo de correo es inválido.");
			return;
		}

		if (!subject.trim() || !message.trim()) {
			showNotification("error", "Por favor, complete todos los campos.");
			return;
		}

		const enviar = window.confirm("¿Desea enviar la respuesta?");

		if (!enviar) {
			return;
		}

		setSending(true);

		try {
			const success = await sendEmailExterno(
				currentForm.correo,
				message,
				subject
			);

			if (success) {
				showNotification("success", "Correo enviado con éxito.");
				setSubject("");
				setMessage("");
			} else {
				showNotification(
					"error",
					"Error al enviar el correo. Intente nuevamente."
				);
			}
		} catch (error) {
			console.error("Error al enviar el correo:", error);
			showNotification("error", "Error al enviar el correo.");
		} finally {
			setSending(false);
		}
	};

	if (!currentForm) return null;

	const estadoActual = currentForm.activo !== false;

	return (
		<Modal
			show={show}
			onHide={handleClose}
			size="xl"
			centered
			dialogClassName="proyecto-modal"
			scrollable
		>
			{contextHolder}
			<Modal.Header closeButton>
				<Modal.Title>
					{`${currentForm.nombre} ${currentForm.apellido}` ||
						"Detalles del Contacto"}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body className="p-0">
				<div className="proyecto-modal-content" style={{ maxHeight: "600px" }}>
					<Tab.Container id="contacto-tabs" defaultActiveKey="detalles">
						<div className="tabs-header border-bottom">
							<Nav variant="tabs" className="flex-nowrap">
								<Nav.Item>
									<Nav.Link eventKey="detalles">Detalles</Nav.Link>
								</Nav.Item>
								<Nav.Item>
									<Nav.Link eventKey="responder">Responder</Nav.Link>
								</Nav.Item>
							</Nav>
						</div>

						<Tab.Content>
							<Tab.Pane eventKey="detalles">
								<div className="p-4">
									<div className="d-flex justify-content-between align-items-center mb-3">
										<h5 className="mb-0">Información del Formulario</h5>
									</div>

									<div className="proyecto-info mb-4">
										<div className="row mb-3">
											<div className="col-md-6">
												<div className="info-item">
													<div className="text-muted mb-1">Fecha de Envío</div>
													<div className="fw-medium">
														{new Date(
															currentForm.fecha_envio
														).toLocaleDateString()}
													</div>
												</div>
											</div>
											<div className="col-md-6">
												<div className="info-item">
													<div className="text-muted mb-1">Correo</div>
													<div className="fw-medium">
														<a href={`mailto:${currentForm.correo}`}>
															{currentForm.correo}
														</a>
													</div>
												</div>
											</div>
										</div>

										<div className="row mb-3">
											<div className="col-md-6">
												<div className="info-item">
													<div className="text-muted mb-1">Teléfono</div>
													<div className="fw-medium">
														{currentForm.telefono || "No especificado"}
													</div>
												</div>
											</div>
											<div className="col-md-6">
												<div className="info-item">
													<div className="text-muted mb-1">Negocio</div>
													<div className="fw-medium">
														{currentForm.nombre_negocio || "No especificado"}
													</div>
												</div>
											</div>
										</div>

										<div className="row mb-3">
											<div className="col-md-6">
												<div className="info-item">
													<div className="text-muted mb-1">Estado</div>
													<div className="fw-medium">
														<select
															className="form-select form_input"
															value={estadoActual}
															onChange={handleChangeEstado}
															disabled={updatingStatus}
														>
															<option value={true}>Activo</option>
															<option value={false}>Inactivo</option>
														</select>
														{updatingStatus && (
															<div className="text-muted small mt-1">
																Actualizando...
															</div>
														)}
													</div>
												</div>
											</div>
											{/* <div className="col-md-6">
												<div className="info-item">
													<div className="text-muted mb-1">Estado Actual</div>
													<div className="fw-medium">
														<span
															className={`badge ${estadoActual ? "badge-verde" : "badge-rojo"} `}
														>
															{estadoActual ? "Activo" : "Inactivo"}
														</span>
													</div>
												</div>
											</div> */}
										</div>
									</div>

									<div className="descripcion-section">
										<h6 className="mb-2">Información del Negocio</h6>
										<div className="descripcion-content p-3 bg-light rounded mb-3">
											{currentForm.dedicacion_negocio ? (
												<>
													<p>
														<strong>Dedicación:</strong>{" "}
														{currentForm.dedicacion_negocio}
													</p>
													{currentForm.objetivos && (
														<p>
															<strong>Objetivos:</strong>{" "}
															{currentForm.objetivos}
														</p>
													)}
												</>
											) : (
												<p className="text-muted mb-0">
													Sin información adicional
												</p>
											)}
										</div>

										{currentForm.link_sitio_web && (
											<div className="mb-3">
												<h6 className="mb-2">Página Web</h6>
												<div className="p-3 bg-light rounded">
													<a
														href={currentForm.link_sitio_web}
														target="_blank"
														rel="noopener noreferrer"
														className="text-decoration-none"
													>
														{currentForm.link_sitio_web}
													</a>
												</div>
											</div>
										)}

										{currentForm.redes_sociales &&
											currentForm.redes_sociales.length > 0 && (
												<div className="mb-3">
													<h6 className="mb-2">Redes Sociales</h6>
													<div className="p-3 bg-light rounded">
														{currentForm.redes_sociales.map((red, index) => (
															<div key={index} className="mb-1">
																<a
																	href={red}
																	target="_blank"
																	rel="noopener noreferrer"
																	className="text-decoration-none"
																>
																	{red}
																</a>
															</div>
														))}
													</div>
												</div>
											)}

										{currentForm.servicios_id &&
											currentForm.servicios_id.length > 0 && (
												<div className="mb-3">
													<h6 className="mb-2">Servicios de Interés</h6>
													<div className="p-3 bg-light rounded">
														{currentForm.servicios_id.map((servicio, index) => (
															<span
																key={index}
																className="badge bg-primary me-2 mb-1"
															>
																{servicio.nombre}
															</span>
														))}
													</div>
												</div>
											)}
									</div>
								</div>
							</Tab.Pane>

							<Tab.Pane eventKey="responder">
								<div className="p-4">
									<div className="d-flex justify-content-between align-items-center mb-3">
										<h5 className="mb-0">Responder Formulario</h5>
									</div>

									<form onSubmit={handleSendEmail}>
										<div className="form-group mb-3">
											<label className="form-label">Para</label>
											<input
												className="form-control form_input"
												type="email"
												value={currentForm.correo}
												disabled
											/>
										</div>

										<div className="form-group mb-3">
											<label className="form-label">Asunto</label>
											<input
												className="form-control form_input"
												type="text"
												value={subject}
												onChange={(e) => setSubject(e.target.value)}
												placeholder="Ingrese el asunto"
												required
											/>
										</div>

										<div className="form-group mb-4">
											<label className="form-label">Mensaje</label>
											<textarea
												className="form-control form_input form-textarea"
												rows="6"
												value={message}
												onChange={(e) => setMessage(e.target.value)}
												placeholder="Escriba su mensaje aquí..."
												required
											/>
										</div>

										<div className="d-flex justify-content-end">
											<button
												type="submit"
												className="thm-btn"
												disabled={sending}
											>
												{sending ? "Enviando..." : "Enviar Respuesta"}
											</button>
										</div>
									</form>
								</div>
							</Tab.Pane>
						</Tab.Content>
					</Tab.Container>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<button className="thm-btn btn-gris" onClick={handleClose}>
					Cerrar
				</button>
			</Modal.Footer>
		</Modal>
	);
};

ModalVerContacto.propTypes = {
	show: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
	form: PropTypes.object,
	onUpdate: PropTypes.func,
};

export default ModalVerContacto;
