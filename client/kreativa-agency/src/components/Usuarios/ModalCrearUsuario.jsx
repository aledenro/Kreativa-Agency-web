import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { UserPlus } from "lucide-react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import {validTokenActive, updateSessionStatus} from "../../utils/validateToken";

const ModalCrearUsuario = ({ show, handleClose, onUpdate }) => {
	const navigate = useNavigate();
	const [api, contextHolder] = notification.useNotification();
	const [formData, setFormData] = useState({
		nombre: "",
		usuario: "",
		cedula: "",
		email: "",
		tipo_usuario: "",
		contraseña: "",
		estado: "Activo",
	});

	const [mostrarContrasena, setMostrarContrasena] = useState(false);
	const [errors, setErrors] = useState({});
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

	const handleChange = async (e) => {
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
			if (name === "contraseña" && value.length < 6) {
				errorMsg = "La contraseña debe tener al menos 6 caracteres";
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
							headers: { Authorization: `Bearer ${token}` },
						}
					);

					const existe = response.data.some((user) => user[name] === value);
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

		setErrors((prev) => ({ ...prev, [name]: errorMsg }));
	};

	const resetForm = () => {
		setFormData({
			nombre: "",
			usuario: "",
			cedula: "",
			email: "",
			tipo_usuario: "",
			contraseña: "",
			estado: "Activo",
		});
		setErrors({});
		setMostrarContrasena(false);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

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

		const camposConError = Object.values(errors).some((error) => error !== "");
		if (camposConError) {
			openErrorNotification(
				"Por favor, corrige los errores antes de continuar."
			);
			return;
		}

		try {
			await axios.post(`${import.meta.env.VITE_API_URL}/usuarios`, formData, {
				headers: { Authorization: `Bearer ${token}` },
			});

			openSuccessNotification("Usuario creado correctamente.");

			if (typeof onUpdate === "function") {
				onUpdate();
			}

			setTimeout(() => {
				resetForm();
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
			console.error("Error al crear usuario");
			openErrorNotification(
				"Error al crear el usuario. Asegúrate de que los datos sean válidos."
			);
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
			onHide={() => {
				resetForm();
				handleClose();
			}}
			size="lg"
			centered
			dialogClassName="usuario-modal"
		>
			{contextHolder}
			<Modal.Header closeButton>
				<Modal.Title>
					<div className="d-flex align-items-center">
						<UserPlus
							size={24}
							color="#ff0072"
							strokeWidth={2.5}
							className="me-2"
						/>
						Crear Usuario
					</div>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body
				className="p-4"
				style={{ maxHeight: "70vh", overflowY: "auto" }}
			>
				<form onSubmit={handleSubmit} ref={(el) => setFormRef(el)}>
					<div className="mb-3">
						<label className="form-label">Nombre Completo</label>
						<input
							type="text"
							name="nombre"
							placeholder="Nombre completo"
							value={formData.nombre}
							onChange={handleChange}
							className="form_input"
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
							placeholder="Usuario"
							value={formData.usuario}
							onChange={handleChange}
							className="form_input"
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
							placeholder="Cédula"
							value={formData.cedula}
							onChange={handleChange}
							className="form_input"
							required
						/>
						{errors.cedula && (
							<small className="text-danger">{errors.cedula}</small>
						)}
					</div>

					<div className="mb-3">
						<label className="form-label">Correo Electrónico</label>
						<input
							type="email"
							name="email"
							placeholder="Correo electrónico"
							value={formData.email}
							onChange={handleChange}
							className="form_input"
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
							value={formData.tipo_usuario}
							onChange={handleChange}
							className="form_input"
							required
						>
							<option value="">Seleccionar tipo de usuario</option>
							<option value="Administrador">Administrador</option>
							<option value="Colaborador">Colaborador</option>
							<option value="Cliente">Cliente</option>
						</select>
						{errors.tipo_usuario && (
							<small className="text-danger">{errors.tipo_usuario}</small>
						)}
					</div>

					<div className="mb-3">
						<label className="form-label">Estado</label>
						<select
							name="estado"
							value={formData.estado}
							onChange={handleChange}
							className="form_input"
							required
						>
							<option value="Activo">Activo</option>
							<option value="Inactivo">Inactivo</option>
						</select>
					</div>

					<div className="mb-3" style={{ position: "relative" }}>
						<label className="form-label">Contraseña</label>
						<input
							type={mostrarContrasena ? "text" : "password"}
							name="contraseña"
							placeholder="Contraseña"
							value={formData.contraseña}
							onChange={handleChange}
							className="form_input"
							required
							style={{ paddingRight: "2.5rem" }}
						/>
						<span
							onClick={() => setMostrarContrasena(!mostrarContrasena)}
							style={{
								position: "absolute",
								top: "50px",
								right: "10px",
								transform: "translateY(-50%)",
								cursor: "pointer",
								zIndex: 2,
							}}
						>
							{mostrarContrasena ? (
								<EyeSlashIcon
									style={{
										width: "22px",
										height: "22px",
										stroke: "#666",
										fill: "none",
									}}
								/>
							) : (
								<EyeIcon
									style={{
										width: "22px",
										height: "22px",
										stroke: "#666",
										fill: "none",
									}}
								/>
							)}
						</span>

						{errors.contraseña && (
							<small className="text-danger">{errors.contraseña}</small>
						)}
					</div>
				</form>
			</Modal.Body>
			<Modal.Footer>
				<button
					type="button"
					className="thm-btn btn-gris me-2"
					onClick={() => {
						resetForm();
						handleClose();
					}}
				>
					Cancelar
				</button>
				<button
					type="button"
					className="thm-btn"
					onClick={handleSaveClick}
					disabled={Object.values(errors).some((e) => e !== "")}
				>
					Crear Usuario
				</button>
			</Modal.Footer>
		</Modal>
	);
};

export default ModalCrearUsuario;
