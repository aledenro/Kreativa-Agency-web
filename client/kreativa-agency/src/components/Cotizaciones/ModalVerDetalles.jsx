import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tab from "react-bootstrap/Tab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowDown, faTrash } from "@fortawesome/free-solid-svg-icons";
import lodash from "lodash";
import fileUpload from "../../utils/fileUpload";
import deleteFile from "../../utils/fileDelete";
import sendEmail from "../../utils/emailSender";
import { InboxOutlined } from "@ant-design/icons";
import { ConfigProvider, Upload, notification } from "antd";
import Loading from "../../components/ui/LoadingComponent";

const { Dragger } = Upload;

const ModalVerCotizacion = ({ show, handleClose, cotizacionId }) => {
	const [cotizacion, setCotizacion] = useState(null);
	const opciones = ["Nuevo", "Aceptado", "Cancelado"];
	const [files, setFiles] = useState([]);
	const [isHovered, setIsHovered] = useState(false);
	const [loading, setLoading] = useState(false);
	const user_id = localStorage.getItem("user_id");

	const [api, contextHolder] = notification.useNotification();

	const handleMouseEnter = () => setIsHovered(true);
	const handleMouseLeave = () => setIsHovered(false);

	const showNotification = (type, message) => {
		api[type]({
			message: type === "success" ? "Éxito" : "Error",
			description: message,
			placement: "top",
			duration: 3,
		});
	};

	const fetchCotizacion = useCallback(async (cotizacionId) => {
		const token = localStorage.getItem("token");
		try {
			setLoading(true);
			const res = await axios.get(
				`${import.meta.env.VITE_API_URL}/cotizaciones/id/${cotizacionId}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			setCotizacion(res.data.cotizacion);
		} catch (error) {
			console.error("Error al obtener la cotizacion: " + error.message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		if (cotizacionId) {
			fetchCotizacion(cotizacionId);
		}
	}, [cotizacionId, fetchCotizacion]);

	const handleFileChange = (info) => {
		if (info.fileList && info.fileList.length > 0) {
			const fileObjects = info.fileList.map((file) => file.originFileObj);
			setFiles(fileObjects);
		} else {
			setFiles([]);
		}
	};

	const clearDragger = () => {
		setFiles([]);
	};

	const fileUploadErrorHandler = async (files, respuestaDbId) => {
		try {
			if (!files || files.length === 0) {
				return;
			}

			await fileUpload(files, "cotizaciones", cotizacionId, respuestaDbId);
		} catch (error) {
			console.error(`Error al subir los archivos: ${error.message}`);
			showNotification(
				"error",
				"Error al subir los archivos, por favor intente de nuevo o contacte al soporte técnico."
			);
		}
	};

	async function handleSubmit(event) {
		event.preventDefault();

		const enviar = confirm("¿Desea enviar su respuesta?");

		if (!enviar) {
			return;
		}

		const formData = new FormData(event.target);
		const content = formData.get("message");

		const filesArray = files.filter((file) => file.name && file.size > 0);

		const data = {
			usuario_id: user_id,
			contenido: content,
			files: [],
			fecha_envio: Date.now(),
		};

		const token = localStorage.getItem("token");

		try {
			const res = await axios.put(
				`${import.meta.env.VITE_API_URL}/cotizaciones/agregarRespuesta/${cotizacionId}`,
				data,
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			showNotification("success", "Respuesta enviada correctamente.");

			if (
				filesArray.length > 0 &&
				res.status === 200 &&
				!lodash.isEmpty(res.data)
			) {
				await fileUploadErrorHandler(filesArray, res.data._id);
			}
			event.target.reset();
			clearDragger();
			fetchCotizacion(cotizacionId);
		} catch (error) {
			console.error(`Error al enviar la respuesta: ${error.message}`);
			showNotification(
				"error",
				"Error al enviar su respuesta, por favor intente de nuevo o contacte al soporte técnico."
			);
		}

		try {
			await sendEmail(
				cotizacion.cliente_id._id,
				`Un colaborador de Kreativa Agency ha respondido a su cotización, ingrese para ver los detalles.`,
				`Actualización en su cotización ${cotizacion.titulo}`,
				"Ver",
				"test"
			);
		} catch (error) {
			console.error(`Error al enviar la notificacion: ${error.message}`);
			showNotification(
				"error",
				"Error al enviar la notificación, por favor intente de nuevo o contacte al soporte técnico."
			);
			return;
		}
	}

	const handleDelete = async (key) => {
		try {
			const msg = await deleteFile(key);

			if (msg) {
				showNotification("success", msg);
				fetchCotizacion();
			}
		} catch (error) {
			showNotification("error", error.message);
		}
	};

	function renderOpciones(opcion, cotizacionEstado) {
		if (opcion === cotizacionEstado) {
			return (
				<option value={opcion} selected>
					{opcion}
				</option>
			);
		} else {
			return <option value={opcion}>{opcion}</option>;
		}
	}

	function handleChangeEstado(event) {
		const estado = event.target.value;
		const token = localStorage.getItem("token");

		try {
			axios.put(
				`${import.meta.env.VITE_API_URL}/cotizaciones/cambiarEstado/${cotizacionId}`,

				{ estado: estado },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			showNotification("success", "Estado cambiado correctamente.");
		} catch (error) {
			console.error(
				`Error al cambiar el estado de la cotizacion: ${error.message}`
			);

			showNotification(
				"error",
				"Error al cambiar el estado de la cotizacion, por favor intente de nuevo o contacte al soporte tecnico."
			);
		}
	}

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
					{cotizacion?.nombre || "Detalles del Cotización"}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body className="p-0">
				{loading ? (
					<div className="text-center p-5">
						<Loading />
					</div>
				) : !cotizacion ? (
					<div className="text-center p-5">
						<p>No se pudo cargar la cotización.</p>
					</div>
				) : (
					<div
						className="proyecto-modal-content"
						style={{ maxHeight: "600px" }}
					>
						<Tab.Container id="proyecto-tabs" defaultActiveKey="detalles">
							<div className="tabs-header border-bottom">
								<Nav variant="tabs" className="flex-nowrap">
									<Nav.Item>
										<Nav.Link eventKey="detalles">Detalles</Nav.Link>
									</Nav.Item>
									<Nav.Item>
										<Nav.Link eventKey="actualizaciones">
											Actualizaciones
										</Nav.Link>
									</Nav.Item>
								</Nav>
							</div>

							<Tab.Content>
								<Tab.Pane eventKey="detalles">
									<div className="p-4">
										<div className="d-flex justify-content-between align-items-center mb-3">
											<h5 className="mb-0">Información de la Cotización</h5>
										</div>

										<div className="proyecto-info mb-4">
											<div className="row mb-3">
												<div className="col-md-6">
													<div className="info-item">
														<div className="text-muted mb-1">
															Fecha de Solicitud
														</div>
														<div className="fw-medium">
															{new Date(
																cotizacion.fecha_solicitud
															).toLocaleDateString()}
														</div>
													</div>
												</div>
												<div className="col-md-6">
													<select
														className="form-select"
														onChange={handleChangeEstado}
													>
														{opciones.map((opcion) =>
															renderOpciones(opcion, cotizacion.estado)
														)}
													</select>
												</div>
											</div>

											<div className="row mb-3">
												<div className="col-md-6">
													<div className="info-item">
														<div className="text-muted mb-1">Urgente</div>
														<div className="urgente-badge fw-medium">
															<span
																className={`badge ${cotizacion.urgente ? "badge-rojo" : "badge-gris"}`}
															>
																{cotizacion.urgente ? "Sí" : "No"}
															</span>
														</div>
													</div>
												</div>
											</div>
										</div>

										<div className="descripcion-section">
											<h6 className="mb-2">Descripción</h6>
											<div className="descripcion-content p-3 bg-light rounded">
												{cotizacion.detalles ? (
													<p className="mb-0">{cotizacion.detalles}</p>
												) : (
													<p className="text-muted mb-2">Sin detalles</p>
												)}
											</div>
											<h6 className="mb-2 mt-4">Archivos</h6>
											{cotizacion.files && cotizacion.files.length > 0 && (
												<div className="archivos-adjuntos">
													{cotizacion.files.map((file) => (
														<div
															className="archivo-item d-inline-block me-2 mb-2"
															key={file.key}
														>
															<a
																href={file.url}
																target="_blank"
																rel="noopener noreferrer"
																className="thm-btn thm-btn-small"
															>
																{file.fileName.length > 15
																	? file.fileName.substring(0, 12) + "..."
																	: file.fileName}
																<FontAwesomeIcon
																	icon={faFileArrowDown}
																	className="ms-1"
																/>
															</a>
														</div>
													))}
												</div>
											)}
										</div>
									</div>
								</Tab.Pane>

								<Tab.Pane eventKey="actualizaciones">
									<div className="actualizaciones-container">
										<div className="comentarios-panel p-4">
											{cotizacion.historial_respuestas.length > 0 ? (
												<div className="comentarios-list">
													<h5 className="mb-4">Respuestas</h5>
													{cotizacion.historial_respuestas.map((respuesta) => (
														<div
															className="comentario-item mb-4 border-bottom pb-3"
															key={respuesta._id}
														>
															<div className="d-flex justify-content-between mb-2">
																<div className="usuario fw-bold">
																	{respuesta.usuario_id.nombre}
																</div>
																<div className="fecha text-muted small">
																	{new Date(
																		respuesta.fecha_envio
																	).toLocaleDateString()}
																</div>
															</div>
															<div className="contenido mb-2">
																{respuesta.contenido}
															</div>

															{respuesta.files &&
																respuesta.files.length > 0 && (
																	<div className="archivos-adjuntos">
																		{respuesta.files.map((file) => (
																			<div
																				className="archivo-item d-inline-block me-2 mb-2"
																				key={file.key}
																			>
																				<a
																					href={file.url}
																					target="_blank"
																					rel="noopener noreferrer"
																					className="thm-btn thm-btn-small"
																				>
																					{file.fileName.length > 15
																						? file.fileName.substring(0, 12) +
																							"..."
																						: file.fileName}
																					<FontAwesomeIcon
																						icon={faFileArrowDown}
																						className="ms-1"
																					/>
																				</a>

																				{Date.now() -
																					new Date(
																						respuesta.fecha_envio
																					).getTime() <=
																					3600000 &&
																					user_id ===
																						respuesta.usuario_id._id && (
																						<button
																							className="thm-btn thm-btn-small btn-rojo ms-1"
																							onClick={() =>
																								handleDelete(file.key)
																							}
																						>
																							<FontAwesomeIcon icon={faTrash} />
																						</button>
																					)}
																			</div>
																		))}
																	</div>
																)}
														</div>
													))}
												</div>
											) : (
												<div className="text-muted">
													No hay respuestas todavía.
												</div>
											)}

											<div className="responder-form">
												<form onSubmit={handleSubmit}>
													<h6 className="mb-3">Responder:</h6>
													<div className="form-group mb-3">
														<textarea
															name="message"
															className="form-control form_input form-textarea"
															rows="3"
															placeholder="Por favor escriba su respuesta"
															required
														></textarea>
													</div>

													{/* Implementación del Dragger */}
													<div className="form-group mb-3">
														<label className="form-label">
															Archivos adjuntos
														</label>
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
																	borderColor: isHovered
																		? "#110d27"
																		: "#8788ab",
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
																	Haz clic o arrastra tus archivos aquí para
																	subirlos
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
									</div>
								</Tab.Pane>
							</Tab.Content>
						</Tab.Container>
					</div>
				)}
			</Modal.Body>
			<Modal.Footer>
				<button className="thm-btn btn-gris" onClick={handleClose}>
					Cerrar
				</button>
			</Modal.Footer>
		</Modal>
	);
};

ModalVerCotizacion.propTypes = {
	show: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
	cotizacionId: PropTypes.string.isRequired,
};

export default ModalVerCotizacion;
