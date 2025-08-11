import React, { useState, useEffect } from "react";
import { Form, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { ConfigProvider, Upload, Image, notification } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import fileUpload from "../utils/fileUpload";
import { useNavigate } from "react-router-dom";
import Loading from "../components/ui/LoadingComponent";
import TokenUtils, { updateSessionStatus } from "../utils/validateToken";

const AgregarServicio = () => {
	const [categorias, setCategorias] = useState([]);
	const [selectedCategoria, setSelectedCategoria] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [nuevaCategoria, setNuevaCategoria] = useState("");

	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState("");
	const [fileList, setFileList] = useState([]);
	const [isHovered, setIsHovered] = useState(false);
	const navigate = useNavigate();

	const [api, contextHolder] = notification.useNotification();

	const handleMouseEnter = () => setIsHovered(true);
	const handleMouseLeave = () => setIsHovered(false);

	const [loading, setLoading] = useState(true);

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

	const fetchCategorias = async () => {
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
			const res = await axios.get(
				`${import.meta.env.VITE_API_URL}/servicios/categorias`,
				{
					headers: { 
						Authorization: `Bearer ${token}`,
						user: user
				
					},
				}
			);
			setCategorias(res.data);
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
			console.error("Error cargando categorias:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCategorias();
	}, []);

	const getBase64 = (file) =>
		new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});

	const handlePreview = async (file) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}
		setPreviewImage(file.url || file.preview);
		setPreviewOpen(true);
	};

	const handleChange = ({ fileList: newFileList }) => {
		setFileList(newFileList);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		const nombre = event.target.nombre.value.trim();
		const descripcion = event.target.descripcion.value.trim();

		if (
			!nombre ||
			!descripcion ||
			!selectedCategoria ||
			fileList.length === 0
		) {
			const camposFaltantes = [];
			if (!nombre) camposFaltantes.push("Nombre del servicio");
			if (!descripcion) camposFaltantes.push("Descripción");
			if (!selectedCategoria) camposFaltantes.push("Categoría");
			if (fileList.length === 0) camposFaltantes.push("Imagen del servicio");

			openErrorNotification(
				`Los siguientes campos son obligatorios: ${camposFaltantes.join(", ")}`
			);
			return;
		}

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
			let imagenes = [];
			try {
				const file = fileList[0].originFileObj;

				if (file) {
					imagenes = await fileUpload(
						[file],
						"landingpage",
						"servicios",
						"temp"
					);
				}
			} catch (error) {
				console.error("Error al subir archivos:", error);
				openErrorNotification("No se pudieron subir las imágenes.");
				return;
			}

			const res = await axios.post(
				`${import.meta.env.VITE_API_URL}/servicios/agregar`,
				{
					nombre,
					descripcion,
					categoria_id: selectedCategoria,
					imagenes: imagenes,
				},
				{ headers: { 
					Authorization: `Bearer ${token}`,
					user: user
			 	} }
			);

			const servicioId = res.data._id;

			let imagenes = [];
			if (fileList.length > 0) {
				try {
					const file = fileList[0].originFileObj;

					if (file) {
						imagenes = await fileUpload(
							[file],
							"landingpage",
							"servicios",
							servicioId
						);
					}

					const token = localStorage.getItem("token");

					if (!token) {
						navigate("/error", {
							state: {
								errorCode: 401,
								mensaje: "Debe iniciar sesión para continuar.",
							},
						});
					}

					await axios.put(
						`${import.meta.env.VITE_API_URL}/servicios/modificar/${servicioId}`,
						imagenes,
						{ headers: { 
					Authorization: `Bearer ${token}`,
					user: user
			 	} }
					);
				} catch (error) {
					if (error.status === 401) {
				await updateSessionStatus();						
				navigate("/error", {
							state: {
								errorCode: 401,
								mensaje: "Debe volver a iniciar sesión para continuar.",
							},
						});
						return;
					}
					console.error("Error al subir archivos:", error);
					openErrorNotification("No se pudieron subir las imágenes.");
					return;
				}
			}

			openSuccessNotification("Servicio agregado exitosamente.");

			event.target.reset();
			setSelectedCategoria("");
			setFileList([]);

			setTimeout(() => {
				navigate("/admin/servicios");
			}, 2000);
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
			console.error("Error al agregar el servicio:", error);

			const mensaje =
				error.response?.data?.error || "Hubo un error al agregar el servicio";

			if (mensaje.includes("Ya existe un servicio con ese nombre")) {
				openErrorNotification("Ya existe un servicio con este nombre.");
			} else {
				openErrorNotification(mensaje);
			}
		}
	};

	const handleAgregarCategoria = async () => {
		if (!nuevaCategoria.trim()) {
			openErrorNotification("Debes agregar un nombre a la categoría");
			return;
		}
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
			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/servicios/categorias`,
				{
					nombre: nuevaCategoria,
				},
				{ headers: { 
					Authorization: `Bearer ${token}`,
					user: user
			 	} }
			);

			await fetchCategorias();

			setSelectedCategoria(response.data._id);
			setShowModal(false);
			setNuevaCategoria("");
		} catch (error) {
			console.error("Error al agregar la categoria:", error);
			if (error.response) {
				if (error.status === 401) {
				await updateSessionStatus();					navigate("/error", {
						state: {
							errorCode: 401,
							mensaje: "Debe volver a iniciar sesión para continuar.",
						},
					});
					return;
				}
				console.error("Detalles del error:", error.response.data);
				openErrorNotification(
					`Error del servidor: ${
						error.response.data.message || "No se pudo agregar la categoría"
					}`
				);
			} else {
				openErrorNotification("Error de conexión con el servidor.");
			}
		}
	};

	const uploadButton = (
		<button style={{ border: 0, background: "none" }} type="button">
			<PlusOutlined />
			<div style={{ marginTop: 8 }}>Subir</div>
		</button>
	);

	if (loading) {
		return (
			<AdminLayout>
				<div className="main-container mx-auto">
					<Loading />
				</div>
			</AdminLayout>
		);
	}

	return (
		<div>
			<AdminLayout>
				<div className="container main-container">
					<div className="section-title text-center">
						<h2>Agregar nuevo servicio</h2>
					</div>
					<div className="mx-auto align-items-center justify-content-center d-flex">
						<div className="col-xl-8">
							{contextHolder}
							<Form onSubmit={handleSubmit} className="servicio_form">
								<div className="row">
									<div className="">
										<label htmlFor="nombre" className="form-label">
											Nombre del servicio *
										</label>
										<input
											type="text"
											name="nombre"
											className="form_input"
											required
										/>
									</div>
								</div>
								<div className="row">
									<div className="col">
										<div className="flex-grow-1">
											<label htmlFor="categoria" className="form-label">
												Categoría del servicio *
											</label>
											<div className="d-flex align-items-center gap-2">
												<Form.Select
													name="categoria"
													className="form_input"
													value={selectedCategoria}
													onChange={(e) => setSelectedCategoria(e.target.value)}
													required
												>
													<option value="">Seleccione una categoría</option>
													{categorias.map((cat) => (
														<option key={cat._id} value={cat._id}>
															{cat.nombre}
														</option>
													))}
												</Form.Select>
												<button
													type="button"
													className="inline-btn btn-verde"
													onClick={() => setShowModal(true)}
												>
													Nueva
												</button>
											</div>
										</div>
									</div>
								</div>
								<div className="row">
									<div className="col">
										<label className="form-label" htmlFor="descripcion">
											Descripción *
										</label>
										<textarea
											placeholder="Describa la información del paquete aquí..."
											name="descripcion"
											className="form_input form-textarea"
											required
										/>
									</div>
								</div>
								<div className="row">
									<div className="col">
										<label className="form-label" htmlFor="imagenes">
											Imagen del servicio * (solo PNG o JPG)
										</label>
										<div className="mt-2">
											<ConfigProvider
												theme={{
													components: {
														Upload: {
															lineWidth: "1px",
															lineType: "solid",
															colorBorder:
																fileList.length === 0 ? "#ff4d4f" : "#8788ab",
															colorBgContainer: "transparent",
														},
													},
												}}
											>
												<Upload
													listType="picture-card"
													fileList={fileList}
													onPreview={handlePreview}
													onChange={handleChange}
													beforeUpload={(file) => {
														const isJpgOrPng =
															file.type === "image/jpeg" ||
															file.type === "image/png";
														if (!isJpgOrPng) {
															openErrorNotification(
																"Solo puedes subir archivos JPG o PNG"
															);
														}
														return isJpgOrPng ? false : Upload.LIST_IGNORE;
													}}
													maxCount={1}
													onMouseEnter={handleMouseEnter}
													onMouseLeave={handleMouseLeave}
													style={{
														borderRadius: "12px",
														borderColor:
															fileList.length === 0
																? "#ff4d4f"
																: isHovered
																	? "#110d27"
																	: "#8788ab",
														borderWidth: "1px",
														borderStyle: "solid",
														backgroundColor: "transparent",
														transition: "border-color 0.3s",
													}}
												>
													{fileList.length >= 1 ? null : uploadButton}
												</Upload>
												{previewImage && (
													<Image
														wrapperStyle={{
															display: "none",
														}}
														preview={{
															visible: previewOpen,
															onVisibleChange: (visible) =>
																setPreviewOpen(visible),
															afterOpenChange: (visible) =>
																!visible && setPreviewImage(""),
														}}
														src={previewImage}
													/>
												)}
											</ConfigProvider>
											{fileList.length === 0 && (
												<small
													style={{
														color: "#ff4d4f",
														marginTop: "5px",
														display: "block",
													}}
												>
													* La imagen es obligatoria
												</small>
											)}
										</div>
									</div>
								</div>
								<div className="d-flex justify-content-center gap-3 mt-3">
									<button
										type="button"
										className="thm-btn btn-rojo form-btn"
										onClick={() => navigate("/admin/servicios")}
									>
										Cancelar
									</button>
									<button type="submit" className="thm-btn form-btn">
										Agregar
									</button>
								</div>
							</Form>
						</div>
					</div>
				</div>

				<Modal show={showModal} onHide={() => setShowModal(false)}>
					<Modal.Header closeButton>
						<Modal.Title>Crear nueva categoría</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form>
							<label className="form-label">Nombre de la nueva categoría</label>
							<input
								type="text"
								className="form_input"
								value={nuevaCategoria}
								onChange={(e) => setNuevaCategoria(e.target.value)}
							/>
						</Form>
					</Modal.Body>
					<Modal.Footer>
						<button
							className="thm-btn thm-btn-small btn-rojo"
							onClick={() => setShowModal(false)}
						>
							Cancelar
						</button>
						<button
							className="thm-btn thm-btn-small"
							onClick={handleAgregarCategoria}
						>
							Guardar
						</button>
					</Modal.Footer>
				</Modal>
			</AdminLayout>
		</div>
	);
};

export default AgregarServicio;
