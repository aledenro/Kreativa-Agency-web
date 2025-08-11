import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import Tab from "react-bootstrap/Tab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import lodash from "lodash";
import fileUpload from "../../utils/fileUpload";
import { InboxOutlined } from "@ant-design/icons";
import { ConfigProvider, Upload, notification } from "antd";
import { useNavigate } from "react-router-dom";
import {validTokenActive, updateSessionStatus} from "../../utils/validateToken";

const { Dragger } = Upload;

const ModalAgregar = ({ show, handleClose }) => {
	ModalAgregar.propTypes = {
		show: PropTypes.bool.isRequired,
		handleClose: PropTypes.func.isRequired,
	};
	const [loading, setLoading] = useState(false);
	const [api, contextHolder] = notification.useNotification();
	const [isHovered, setIsHovered] = useState(false);
	const [files, setFiles] = useState([]);
	const [errors, setErrors] = useState({});

	const handleMouseEnter = () => setIsHovered(true);
	const handleMouseLeave = () => setIsHovered(false);
	const navigate = useNavigate();

	const handleFileChange = (info) => {
		if (info.fileList && info.fileList.length > 0) {
			const fileObjects = info.fileList.map((file) => file.originFileObj);
			setFiles(fileObjects);
		} else {
			setFiles([]);
		}
	};

	const showNotification = (type, message) => {
		api[type]({
			message:
				type === "success"
					? "Éxito"
					: type === "error"
						? "Error"
						: "Información",
			description: message,
			placement: "top",
			duration: 3,
		});
	};

	const clearDragger = () => {
		setFiles([]);
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
	});

	const validateForm = (titulo, descripcion) => {
		const newErrors = {};

		if (!titulo || titulo.trim() === "") {
			newErrors.titulo = "El título es obligatorio";
		}

		if (!descripcion || descripcion.trim() === "") {
			newErrors.descripcion = "La descripción es obligatoria";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const clearError = (fieldName) => {
		if (errors[fieldName]) {
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[fieldName];
				return newErrors;
			});
		}
	};

	function construirJsonRequest(titulo, descripcion, urgente) {
		const user_id = localStorage.getItem("user_id");
		return {
			cliente_id: user_id,
			titulo: titulo,
			detalles: descripcion,
			urgente: urgente,
			historial_respuestas: [],
			estado: "Nuevo",
			files: [],
		};
	}

	const fileUploadErrorHandler = async (files, respuestaDbId) => {
		try {
			if (!files || files.length === 0) {
				return;
			}

			await fileUpload(files, "cotizaciones", "cotizacion", respuestaDbId);
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
			showNotification(
				"error",
				"Error al subir los archivos, por favor intente de nuevo o contacte al soporte técnico."
			);
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setLoading(true);

		const formData = new FormData(event.target);
		const titulo = formData.get("titulo");
		const descripcion = formData.get("descripcion");
		const urgente = formData.get("urgente") === "on";

		if (!validateForm(titulo, descripcion)) {
			showNotification(
				"error",
				"Por favor complete todos los campos obligatorios marcados con asterisco (*)"
			);
			setLoading(false);
			return;
		}

		const enviar = confirm("¿Desea enviar su cotización?");
		if (!enviar) {
			setLoading(false);
			return;
		}

		const filesArray = files.filter((file) => file.name && file.size > 0);
		const data = construirJsonRequest(titulo, descripcion, urgente);
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

		try {
			const res = await axios.post(
				`${import.meta.env.VITE_API_URL}/cotizaciones/crear`,
				data,
				{ headers: { 
					Authorization: `Bearer ${token}`,
					user: user
			 	} }
			);

			if (res.status == 201) {
				if (filesArray.length > 0 && !lodash.isEmpty(res.data)) {
					await fileUploadErrorHandler(filesArray, res.data._id);
				}

				showNotification(
					"success",
					"¡Cotización enviada correctamente! Pronto recibirá una respuesta."
				);

				event.target.reset();
				clearDragger();
				setErrors({});

				setTimeout(() => {
					handleClose();
				}, 1000);
			}
		} catch (error) {
			if (error.status === 401) {
				await updateSessionStatus();
				navigate("/error", {
					state: {
						errorCode: 401,
						mensaje: "Debe volver a iniciar sesión para continuar.",
					},
				});
			}
			showNotification(
				"error",
				"Error al enviar su cotización, por favor trate nuevamente o comuníquese con el soporte técnico."
			);
		} finally {
			setLoading(false);
		}
	};

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
				<Modal.Title>Solicitar Cotización</Modal.Title>
			</Modal.Header>
			<Modal.Body className="p-0">
				<div className="proyecto-modal-content">
					<Tab.Container id="proyecto-tabs" defaultActiveKey="detalles">
						<div className="p-4">
							<div className="proyecto-info mb-4">
								<form onSubmit={handleSubmit}>
									<div className="mb-3">
										<label htmlFor="titulo" className="form-label">
											Título <span style={{ color: "red" }}>*</span>
										</label>
										<input
											type="text"
											className={`form_input ${errors.titulo ? "is-invalid" : ""}`}
											id="titulo"
											name="titulo"
											onChange={() => clearError("titulo")}
											style={{
												borderColor: errors.titulo ? "#dc3545" : undefined,
											}}
										/>
										{errors.titulo && (
											<div className="invalid-feedback d-block">
												{errors.titulo}
											</div>
										)}
									</div>
									<div className="mb-3">
										<label htmlFor="descripcion" className="form-label">
											Descripción <span style={{ color: "red" }}>*</span>
										</label>
										<textarea
											name="descripcion"
											className={`form_input form-textarea ${errors.descripcion ? "is-invalid" : ""}`}
											id="descripcion"
											rows={5}
											placeholder="Describa su solicitud"
											onChange={() => clearError("descripcion")}
											style={{
												borderColor: errors.descripcion ? "#dc3545" : undefined,
											}}
										></textarea>
										{errors.descripcion && (
											<div className="invalid-feedback d-block">
												{errors.descripcion}
											</div>
										)}
									</div>
									<div className="mb-3 form-check">
										<input
											type="checkbox"
											className="form-check-input"
											id="urgente"
											name="urgente"
										/>
										<label className="form-check-label" htmlFor="urgente">
											Urgente
										</label>
									</div>
									<div className="form-group mb-3">
										<label className="form-label">Archivos adjuntos</label>
										<ConfigProvider
											theme={{
												components: {
													Upload: {
														lineWidth: "1px",
														lineType: "solid",
														colorBorder: "#8788ab",
														colorBgContainer: "transparent",
													},
												},
											}}
										>
											<Dragger
												name="filesUploaded"
												multiple={true}
												action="#"
												beforeUpload={() => false}
												onChange={handleFileChange}
												className="custom-dragger"
												style={{
													borderRadius: "12px",
													borderColor: isHovered ? "#110d27" : "#8788ab",
													borderWidth: "1px",
													borderStyle: "solid",
													backgroundColor: "transparent",
													transition: "border-color 0.3s",
												}}
												onMouseEnter={handleMouseEnter}
												onMouseLeave={handleMouseLeave}
											>
												<p className="ant-upload-drag-icon custom-icon">
													<InboxOutlined
														style={{
															color: isHovered ? "#110d27" : "#8788ab",
															transition: "color 0.3s",
														}}
													/>
												</p>
												<p className="ant-upload-text">
													Haz clic o arrastra tus archivos aquí para subirlos
												</p>
												<p className="ant-upload-hint">
													Puedes subir múltiples archivos
												</p>
											</Dragger>
										</ConfigProvider>
									</div>
									<div className="d-flex justify-content-end">
										<button
											type="submit"
											className="thm-btn"
											disabled={loading}
										>
											{loading ? "Enviando..." : "Enviar"}
										</button>
									</div>
								</form>
							</div>
						</div>
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

export default ModalAgregar;
