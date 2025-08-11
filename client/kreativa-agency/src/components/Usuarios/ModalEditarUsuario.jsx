import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { UserCog } from "lucide-react";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import {validTokenActive, updateSessionStatus} from "../../utils/validateToken";

const ModalEditarUsuario = ({ show, handleClose, usuarioId, onUpdate }) => {
	const navigate = useNavigate();
	const [api, contextHolder] = notification.useNotification();
	const [formData, setFormData] = useState({
		nombre: "",
		usuario: "",
		email: "",
		tipo_usuario: "",
		cedula: "",
	});

	const [errors, setErrors] = useState({});
	const [usuario, setUsuario] = useState(null);
	const [formRef, setFormRef] = useState(null);

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

	const fetchUsuario = useCallback(async () => {
		if (!usuarioId) return;

		const token = localStorage.getItem("token");
		const user = localStorage.getItem("user_name");
		if (!token) {
			navigate("/error", {
				state: {
					errorCode: 401,
					mensaje: "Debe iniciar sesión para continuar.",
				},
			});
			return;
		}

		try {
			const { data } = await axios.get(
				`${import.meta.env.VITE_API_URL}/usuarios/${usuarioId}`,
				{
					headers: { 
						Authorization: `Bearer ${token}`,
						user: user
				
					},
				}
			);

			setUsuario(data);
			setFormData({
				nombre: data.nombre,
				usuario: data.usuario,
				email: data.email,
				tipo_usuario: data.tipo_usuario,
				cedula: data.cedula,
			});
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
			console.error("Error al obtener usuario:", error.response?.data || error);
			openErrorNotification("Error al cargar los datos del usuario.");
		}
	}, [usuarioId, navigate]);

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

		if (show && usuarioId) {
			fetchUsuario();
		}
	}, [show, usuarioId, fetchUsuario]);

	const handleInputChange = async (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
		validarCampo(name, value);
	};

	const validarCampo = async (name, value) => {
		let errorMsg = "";

		if (!value) {
			errorMsg = "Este campo es obligatorio";
		} else {
			if (
				name === "email" &&
				!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
			) {
				errorMsg = "Correo no válido";
			}
			if (name === "cedula" && !/^\d{8,9}$/.test(value)) {
				errorMsg = "La cédula debe tener entre 8 y 9 dígitos";
			}
			if (["usuario", "email", "cedula"].includes(name)) {
				try {
					const token = localStorage.getItem("token");
					if (!token) {
						navigate("/error", {
							state: {
								errorCode: 401,
								mensaje: "Debe iniciar sesión para continuar.",
							},
						});
						return;
					}

					const response = await axios.get(
						`${import.meta.env.VITE_API_URL}/usuarios`,
						{
							headers: { 
						Authorization: `Bearer ${token}`,
						user: user
				
					},
						}
					);

					const existe = response.data.some(
						(user) => user[name] === value && user._id !== usuarioId
					);

					if (existe) {
						errorMsg =
							name === "usuario"
								? "Este usuario ya está en uso"
								: name === "email"
									? "Este correo ya está registrado"
									: "Esta cédula ya está registrada";
					}
				} catch (error) {
					if (error.status === 401) {
				await updateSessionStatus();						navigate("/error", {
							state: {
								errorCode: 401,
								mensaje: "Debe volver a iniciar sesión para continuar.",
							},
						});
						return;
					}
					console.error("Error al verificar disponibilidad:", error);
				}
			}
		}

		setErrors({ ...errors, [name]: errorMsg });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const camposConError = Object.values(errors).some((error) => error !== "");
		if (camposConError) {
			openErrorNotification(
				"Por favor, corrige los errores antes de continuar."
			);
			return;
		}

		try {
			const token = localStorage.getItem("token");
			const user = localStorage.getItem("user_name");
			
			if (!token) {
				navigate("/error", {
					state: {
						errorCode: 401,
						mensaje: "Debe iniciar sesión para continuar.",
					},
				});
				return;
			}

			await axios.put(
				`${import.meta.env.VITE_API_URL}/usuarios/${usuarioId}`,
				formData,
				{
					headers: { 
						Authorization: `Bearer ${token}`,
						user: user
				
					},
				}
			);

			openSuccessNotification("Usuario actualizado correctamente.");

			if (typeof onUpdate === "function") {
				onUpdate();
			}

			setTimeout(() => {
				handleClose();
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
			console.error(
				"Error al actualizar usuario:",
				error.response?.data || error
			);
			openErrorNotification("Error al actualizar el usuario.");
		}
	};

	const handleSaveClick = () => {
		if (formRef) {
			formRef.dispatchEvent(
				new Event("submit", { cancelable: true, bubbles: true })
			);
		}
	};

	return (
		<Modal
			show={show}
			onHide={handleClose}
			size="lg"
			centered
			dialogClassName="usuario-modal"
		>
			{contextHolder}
			<Modal.Header closeButton>
				<Modal.Title>
					<div className="d-flex align-items-center">
						<UserCog
							size={24}
							color="#ff0072"
							strokeWidth={2.5}
							className="me-2"
						/>
						Editar Usuario
					</div>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body
				className="p-4"
				style={{ maxHeight: "70vh", overflowY: "auto" }}
			>
				{!usuario ? (
					<div className="text-center p-5">
						<p>Cargando usuario...</p>
					</div>
				) : (
					<form onSubmit={handleSubmit} ref={(el) => setFormRef(el)}>
						<div className="mb-3">
							<label className="form-label">Nombre Completo</label>
							<input
								type="text"
								name="nombre"
								className="form_input"
								value={formData.nombre}
								onChange={handleInputChange}
								required
							/>
							{errors.nombre && (
								<small className="text-danger">{errors.nombre}</small>
							)}
						</div>

						<div className="mb-3">
							<label className="form-label">Usuario</label>
							<input
								type="text"
								name="usuario"
								className="form_input"
								value={formData.usuario}
								onChange={handleInputChange}
								required
							/>
							{errors.usuario && (
								<small className="text-danger">{errors.usuario}</small>
							)}
						</div>

						<div className="mb-3">
							<label className="form-label">Cédula</label>
							<input
								type="text"
								name="cedula"
								className="form_input"
								value={formData.cedula}
								disabled
							/>
						</div>

						<div className="mb-3">
							<label className="form-label">Correo Electrónico</label>
							<input
								type="email"
								name="email"
								className="form_input"
								value={formData.email}
								onChange={handleInputChange}
								required
							/>
							{errors.email && (
								<small className="text-danger">{errors.email}</small>
							)}
						</div>

						<div className="mb-3">
							<label className="form-label">Tipo de Usuario</label>
							<select
								name="tipo_usuario"
								className="form_input"
								value={formData.tipo_usuario}
								onChange={handleInputChange}
								required
							>
								<option value="">Seleccione...</option>
								<option value="Administrador">Administrador</option>
								<option value="Colaborador">Colaborador</option>
								<option value="Cliente">Cliente</option>
							</select>
							{errors.tipo_usuario && (
								<small className="text-danger">{errors.tipo_usuario}</small>
							)}
						</div>
					</form>
				)}
			</Modal.Body>
			<Modal.Footer>
				<button
					type="button"
					className="thm-btn btn-gris me-2"
					onClick={handleClose}
				>
					Cancelar
				</button>
				<button
					type="button"
					className="thm-btn"
					onClick={handleSaveClick}
					disabled={!usuario || Object.values(errors).some((e) => e !== "")}
				>
					Guardar Cambios
				</button>
			</Modal.Footer>
		</Modal>
	);
};

export default ModalEditarUsuario;
