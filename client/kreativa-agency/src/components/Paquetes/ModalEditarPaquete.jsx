import React, { useState, useEffect, useRef } from "react";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import validTokenActive from "../../utils/validateToken";

const ModalEditarPaquete = ({ show, onHide, paquete, onPaqueteEditado }) => {
	const navigate = useNavigate();
	const formRef = useRef(null);
	const [api, contextHolder] = notification.useNotification();

	const [formData, setFormData] = useState({
		nombre: "",
		descripcion: "",
		nivel: "",
		duracionNumero: "",
		duracionUnidad: "días",
		beneficios: [""],
		precio: "",
	});

	const [loading, setLoading] = useState(false);

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

	const validateTokenAndRedirect = () => {
		const token = localStorage.getItem("token");

		if (!token) {
			navigate("/error", {
				state: {
					errorCode: 401,
					mensaje: "Acceso no autorizado.",
				},
			});
			return false;
		}

		if (!validTokenActive()) {
			navigate("/error", {
				state: {
					errorCode: 401,
					mensaje: "Debe volver a iniciar sesión para continuar.",
				},
			});
			return false;
		}

		return true;
	};

	useEffect(() => {
		if (show && paquete) {
			cargarDatosPaquete();
		}
	}, [show, paquete]);

	const cargarDatosPaquete = () => {
		if (!paquete) return;

		const duracionParts = paquete.duracion?.split(" ") || ["1", "días"];
		const duracionNumero = duracionParts[0] || "1";
		const duracionUnidad = duracionParts[1] || "días";

		setFormData({
			nombre: paquete.nombre || "",
			descripcion: paquete.descripcion || "",
			nivel: paquete.nivel || "",
			duracionNumero: duracionNumero,
			duracionUnidad: duracionUnidad,
			beneficios:
				paquete.beneficios?.length > 0 ? [...paquete.beneficios] : [""],
			precio: paquete.precio || "",
		});
	};

	const resetForm = () => {
		setFormData({
			nombre: "",
			descripcion: "",
			nivel: "",
			duracionNumero: "",
			duracionUnidad: "días",
			beneficios: [""],
			precio: "",
		});
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleBeneficioChange = (index, value) => {
		const nuevosBeneficios = [...formData.beneficios];
		nuevosBeneficios[index] = value;
		setFormData((prevData) => ({
			...prevData,
			beneficios: nuevosBeneficios,
		}));
	};

	const agregarBeneficio = () => {
		setFormData((prevData) => ({
			...prevData,
			beneficios: [...prevData.beneficios, ""],
		}));
	};

	const eliminarBeneficio = (index) => {
		if (formData.beneficios.length > 1) {
			const nuevosBeneficios = formData.beneficios.filter(
				(_, i) => i !== index
			);
			setFormData((prevData) => ({
				...prevData,
				beneficios: nuevosBeneficios,
			}));
		}
	};

	const handleFocus = (index) => {
		if (index === formData.beneficios.length - 1) {
			agregarBeneficio();
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!validateTokenAndRedirect()) {
			return;
		}

		const {
			nombre,
			descripcion,
			nivel,
			duracionNumero,
			duracionUnidad,
			beneficios,
			precio,
		} = formData;

		if (
			!nombre ||
			!descripcion ||
			!nivel ||
			!duracionNumero ||
			!duracionUnidad ||
			!precio
		) {
			openErrorNotification("Todos los campos son obligatorios.");
			return;
		}

		const duracionNumeroValue = Number(duracionNumero);
		if (isNaN(duracionNumeroValue) || duracionNumeroValue < 1) {
			openErrorNotification(
				"Por favor ingrese una duración válida (mayor o igual a 1)"
			);
			return;
		}

		const beneficiosFiltrados = beneficios.filter((b) => b.trim() !== "");
		if (beneficiosFiltrados.length === 0) {
			openErrorNotification("Debe agregar al menos un beneficio.");
			return;
		}

		const enviar = confirm("¿Desea guardar los cambios en este paquete?");
		if (!enviar) {
			return;
		}

		setLoading(true);

		const duracion = `${duracionNumeroValue} ${duracionUnidad}`;
		const paqueteEditado = {
			nombre,
			descripcion,
			nivel,
			duracion,
			beneficios: beneficiosFiltrados,
			precio: parseFloat(precio),
		};

		const token = localStorage.getItem("token");

		try {
			const res = await axios.put(
				`${import.meta.env.VITE_API_URL}/servicios/${paquete.servicioId}/paquetes/${paquete._id}`,
				paqueteEditado,
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			if (res.status === 200) {
				openSuccessNotification("Paquete editado exitosamente");

				if (typeof onPaqueteEditado === "function") {
					onPaqueteEditado(res.data);
				}

				setTimeout(() => {
					onHide();
				}, 2000);
			} else {
				openErrorNotification("Error al editar el paquete.");
			}
		} catch (error) {
			console.error(error.message);

			if (error.response?.status === 401) {
				handleUnauthorized();
				return;
			}

			openErrorNotification(
				"Error al editar el paquete, por favor trate nuevamente o comuníquese con el soporte técnico."
			);
		} finally {
			setLoading(false);
		}
	};

	const handleClose = () => {
		if (!loading) {
			onHide();
		}
	};

	if (!paquete) return null;

	return (
		<Modal
			scrollable
			show={show}
			onHide={handleClose}
			size="lg"
			centered
			dialogClassName="paquete-modal"
			backdrop={loading ? "static" : true}
			keyboard={!loading}
		>
			{contextHolder}
			<Modal.Header closeButton={!loading}>
				<Modal.Title>{paquete.nombre}</Modal.Title>
			</Modal.Header>
			<Modal.Body
				className="p-4"
				style={{ maxHeight: "70vh", overflowY: "auto" }}
			>
				<form onSubmit={handleSubmit} ref={formRef}>
					<div className="row">
						<div className="col-md-6">
							<div className="mb-3">
								<label htmlFor="nombre" className="form-label">
									Nombre del paquete
								</label>
								<input
									type="text"
									name="nombre"
									id="nombre"
									className="form_input"
									value={formData.nombre}
									onChange={handleChange}
									required
									disabled={loading}
								/>
							</div>
						</div>
						<div className="col-md-6">
							<div className="mb-3">
								<label htmlFor="nivel" className="form-label">
									Nivel
								</label>
								<input
									type="text"
									name="nivel"
									id="nivel"
									className="form_input"
									value={formData.nivel}
									onChange={handleChange}
									required
									disabled={loading}
								/>
							</div>
						</div>
					</div>

					<div className="row">
						<div className="col-md-6">
							<div className="mb-3">
								<label className="form-label">Duración</label>
								<div className="d-flex gap-2">
									<input
										type="number"
										name="duracionNumero"
										className="form_input"
										value={formData.duracionNumero}
										onChange={(e) => {
											const valor = parseFloat(e.target.value);
											if (valor >= 1 || e.target.value === "") {
												setFormData((prev) => ({
													...prev,
													duracionNumero: valor || "",
												}));
											}
										}}
										required
										min="1"
										placeholder="Duración"
										disabled={loading}
										style={{ flex: 1 }}
									/>
									<select
										className="form-select form_input"
										name="duracionUnidad"
										value={formData.duracionUnidad}
										onChange={handleChange}
										disabled={loading}
										style={{ flex: 1 }}
									>
										<option value="días">Días</option>
										<option value="semanas">Semanas</option>
										<option value="meses">Meses</option>
									</select>
								</div>
							</div>
						</div>
						<div className="col-md-6">
							<div className="mb-3">
								<label htmlFor="precio" className="form-label">
									Precio
								</label>
								<input
									type="number"
									name="precio"
									id="precio"
									className="form_input"
									value={formData.precio}
									onChange={handleChange}
									required
									disabled={loading}
									step="0.01"
									min="0"
								/>
							</div>
						</div>
					</div>

					<div className="mb-3">
						<label htmlFor="descripcion" className="form-label">
							Descripción
						</label>
						<textarea
							name="descripcion"
							id="descripcion"
							className="form_input form_textarea"
							rows="3"
							value={formData.descripcion}
							onChange={handleChange}
							required
							disabled={loading}
							placeholder="Describa el paquete"
						/>
					</div>

					<div className="mb-3">
						<label className="form-label">Beneficios</label>
						{formData.beneficios.map((beneficio, index) => (
							<div key={index} className="d-flex align-items-center mb-2">
								<input
									type="text"
									className="form_input"
									value={beneficio}
									onChange={(e) => handleBeneficioChange(index, e.target.value)}
									onFocus={() => handleFocus(index)}
									required
									disabled={loading}
									placeholder={`Beneficio ${index + 1}`}
								/>
								{index > 0 && (
									<button
										type="button"
										className="icon-btn ms-2"
										onClick={() => eliminarBeneficio(index)}
										disabled={loading}
										title="Eliminar beneficio"
									>
										<FontAwesomeIcon icon={faX} />
									</button>
								)}
							</div>
						))}
						<small className="text-muted">
							Haga clic en el último campo para agregar más beneficios
						</small>
					</div>
				</form>
			</Modal.Body>
			<Modal.Footer>
				<button
					type="button"
					className="thm-btn btn-gris me-2"
					onClick={handleClose}
					disabled={loading}
				>
					Cancelar
				</button>
				<button
					type="button"
					className="thm-btn"
					onClick={handleSubmit}
					disabled={loading}
				>
					{loading ? "Guardando..." : "Guardar Cambios"}
				</button>
			</Modal.Footer>
		</Modal>
	);
};

export default ModalEditarPaquete;
