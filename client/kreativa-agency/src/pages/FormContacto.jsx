import React, { useState, useEffect } from "react";
import { Form, Spinner } from "react-bootstrap";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import sendEmailExterno from "../utils/sendEmailExterno";
import { notification } from "antd";

const FormContacto = () => {
	const [formData, setFormData] = useState({
		nombre: "",
		apellido: "",
		correo: "",
		telefono: "",
		nombre_negocio: "",
		dedicacion_negocio: "",
		link_sitio_web: "",
		redes_sociales: [""],
		objetivos: "",
		servicios_id: [],
	});

	const [servicios, setServicios] = useState([]);
	const [loading, setLoading] = useState(false);

	const [api, contextHolder] = notification.useNotification();

	const showNotification = (type, message) => {
		api[type]({
			message: type === "success" ? "Éxito" : "Error",
			description: message,
			placement: "bottomRight",
			duration: 4,
		});
	};

	useEffect(() => {
		const fetchServicios = async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/servicios/nombres`
				);

				if (Array.isArray(response.data)) {
					const serviciosActivos = response.data.filter(
						(servicio) => servicio.activo === true
					);
					setServicios(serviciosActivos);
				} else {
					setServicios([]);
				}
			} catch (err) {
				console.error("Error al cargar los servicios:", err);
				showNotification("error", "No se pudieron cargar los servicios.");
			}
		};

		fetchServicios();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleCheckboxChange = (e) => {
		const { value, checked } = e.target;
		setFormData((prevState) => ({
			...prevState,
			servicios_id: checked
				? [...prevState.servicios_id, value]
				: prevState.servicios_id.filter((id) => id !== value),
		}));
	};

	const handleRedesChange = (index, value) => {
		const nuevasRedes = [...formData.redes_sociales];
		nuevasRedes[index] = value;
		setFormData((prevData) => ({
			...prevData,
			redes_sociales: nuevasRedes,
		}));
	};

	const agregarRedSocial = () => {
		setFormData((prevData) => ({
			...prevData,
			redes_sociales: [...prevData.redes_sociales, ""],
		}));
	};

	const eliminarRedSocial = (index) => {
		setFormData((prevData) => {
			if (prevData.redes_sociales.length > 1) {
				const nuevasRedes = prevData.redes_sociales.filter(
					(_, i) => i !== index
				);
				return {
					...prevData,
					redes_sociales: nuevasRedes.length ? nuevasRedes : [""],
				};
			}
			return prevData;
		});
	};

	const handleFocus = (index) => {
		if (index === formData.redes_sociales.length - 1) {
			agregarRedSocial();
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const {
			nombre,
			apellido,
			correo,
			telefono,
			nombre_negocio,
			dedicacion_negocio,
			objetivos,
			servicios_id,
		} = formData;

		if (
			!nombre.trim() ||
			!apellido.trim() ||
			!correo.trim() ||
			!telefono.trim() ||
			!nombre_negocio.trim() ||
			!dedicacion_negocio.trim() ||
			!objetivos.trim() ||
			servicios_id.length === 0
		) {
			showNotification(
				"error",
				"Debes completar todos los campos obligatorios y seleccionar al menos un servicio."
			);
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(correo)) {
			showNotification(
				"error",
				"Por favor ingresa un correo electrónico válido."
			);
			return;
		}

		const phoneRegex = /^[\d\s\+\-\(\)]+$/;
		if (!phoneRegex.test(telefono)) {
			showNotification(
				"error",
				"El teléfono solo debe contener números, espacios y los símbolos + - ( )"
			);
			return;
		}

		setLoading(true);

		try {
			const formDataToSend = {
				...formData,
				redes_sociales: formData.redes_sociales.filter(
					(red) => red.trim() !== ""
				),
			};

			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/contacto`,
				formDataToSend
			);
			showNotification("success", "Formulario enviado exitosamente");

			setFormData({
				nombre: "",
				apellido: "",
				correo: "",
				telefono: "",
				nombre_negocio: "",
				dedicacion_negocio: "",
				link_sitio_web: "",
				redes_sociales: [""],
				objetivos: "",
				servicios_id: [],
			});

			if (response.status === 201) {
				await sendEmailExterno(
					formData.correo,
					"Tu mensaje ha sido enviado. Pronto un miembro del equipo de Kreativa se pondrá en contacto.",
					"Mensaje enviado"
				);
			}
		} catch (error) {
			console.error("Error al enviar el formulario:", error);
			showNotification(
				"error",
				"Hubo un error al enviar el formulario. Inténtalo de nuevo."
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div style={{ position: "relative" }}>
			{contextHolder}
			<img
				src="/src/assets/img/40.svg"
				alt="decoración"
				className="doodle-top-left"
			/>
			<img
				src="/src/assets/img/31.svg"
				alt="decoración"
				className="doodle-bottom-right"
			/>
			<div className="container mt-4">
				<div className="mx-auto align-items-center justify-content-center d-flex">
					<div className="col-lg-8 mx-4 form-container">
						<div className="section-title text-center">
							<h2 className="main-heading">Contactá con nosotros</h2>
							<p className="mb-5 text-center subtitle">
								¡Lleva tu negocio al siguiente nivel! Déjanos tus datos y uno de
								nuestros expertos en marketing digital se pondrá en contacto
								contigo para ofrecerte una solución personalizada.
							</p>
						</div>

						<Form onSubmit={handleSubmit} className="contacto_form" noValidate>
							<div className="row">
								<div className="col">
									<label className="form-label" htmlFor="nombre">
										Nombre <span className="text-danger">*</span>
									</label>
									<input
										type="text"
										name="nombre"
										value={formData.nombre}
										onChange={handleChange}
										aria-label="Nombre"
										className="form_input"
									/>
								</div>
								<div className="col">
									<label className="form-label">
										Apellido <span className="text-danger">*</span>
									</label>
									<input
										className="form_input"
										type="text"
										name="apellido"
										value={formData.apellido}
										onChange={handleChange}
									/>
								</div>
							</div>

							<div className="row">
								<div className="col">
									<label className="form-label">
										Correo Electrónico <span className="text-danger">*</span>
									</label>
									<input
										className="form_input"
										type="text"
										name="correo"
										value={formData.correo}
										onChange={handleChange}
									/>
								</div>
								<div className="col">
									<label className="form-label">
										Teléfono <span className="text-danger">*</span>
									</label>
									<input
										className="form_input"
										type="text"
										name="telefono"
										value={formData.telefono}
										onChange={handleChange}
									/>
								</div>
							</div>

							<div className="row">
								<div className="col">
									<label className="form-label">
										Nombre del Negocio <span className="text-danger">*</span>
									</label>
									<input
										className="form_input"
										type="text"
										name="nombre_negocio"
										value={formData.nombre_negocio}
										onChange={handleChange}
									/>
								</div>
							</div>
							<div className="row">
								<div className="col">
									<label className="form-label">
										Dedicación del Negocio{" "}
										<span className="text-danger">*</span>
									</label>
									<textarea
										className="form_input form-textarea"
										type="text"
										rows="3"
										name="dedicacion_negocio"
										value={formData.dedicacion_negocio}
										onChange={handleChange}
									/>
								</div>
							</div>
							<div className="row">
								<div className="col">
									<label className="form-label">Link del Sitio Web</label>
									<input
										className="form_input"
										type="text"
										placeholder="https://..."
										name="link_sitio_web"
										value={formData.link_sitio_web}
										onChange={handleChange}
									/>
								</div>
							</div>
							<div className="row">
								<div className="col">
									<label className="form-label">Redes Sociales</label>
									{formData.redes_sociales.map((red, index) => (
										<div key={index} className="d-flex align-items-center mb-2">
											<input
												className="form_input"
												type="text"
												placeholder="https://..."
												value={red}
												onChange={(e) =>
													handleRedesChange(index, e.target.value)
												}
												onFocus={() => handleFocus(index)}
											/>
											{index > 0 && (
												<button
													type="button"
													className="icon-btn inline-btn"
													onClick={() => eliminarRedSocial(index)}
												>
													<FontAwesomeIcon icon={faX} />
												</button>
											)}
										</div>
									))}
								</div>
							</div>
							<div className="row">
								<div className="col">
									<label className="form-label">
										Objetivos <span className="text-danger">*</span>
									</label>
									<textarea
										className="form_input form-textarea"
										as="textarea"
										name="objetivos"
										value={formData.objetivos}
										onChange={handleChange}
									/>
								</div>
							</div>
							<div className="row">
								<div className="col">
									<label className="form-label">
										Servicios <span className="text-danger">*</span>
									</label>
									{servicios.length > 0 ? (
										<div className="row">
											<div className="col-12 d-flex flex-wrap">
												{servicios.map((servicio) => (
													<div className="col-6" key={servicio._id}>
														<Form.Check
															type="checkbox"
															label={servicio.nombre}
															value={servicio._id}
															checked={formData.servicios_id.includes(
																servicio._id
															)}
															onChange={handleCheckboxChange}
															className="custom-checkbox"
														/>
													</div>
												))}
											</div>
										</div>
									) : (
										<p>No tenemos servicios disponibles</p>
									)}
								</div>
							</div>

							<div className="d-flex justify-content-center mt-3">
								<button
									className="thm-btn form-btn"
									variant="primary"
									type="submit"
									disabled={loading}
								>
									{loading ? (
										<Spinner animation="border" size="sm" />
									) : (
										"Enviar"
									)}
								</button>
							</div>
						</Form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FormContacto;
