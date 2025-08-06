import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import { UserPlus } from "lucide-react";
import Swal from "sweetalert2";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import validTokenActive from "../utils/validateToken";

const CrearUsuario = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		nombre: "",
		usuario: "",
		cedula: "",
		email: "",
		tipo_usuario: "",
		contraseña: "",
		estado: "Activo",
	});

	const [mostrarContrasena, setMostrarContrasena] = useState(false); // 👈 estado nuevo
	const [errors, setErrors] = useState({});
	const [errorServidor, setErrorServidor] = useState("");

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
						navigate("/error", {
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

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrorServidor("");

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
			alert("Por favor, corrige los errores antes de continuar.");
			return;
		}

		try {
			await axios.post(`${import.meta.env.VITE_API_URL}/usuarios`, formData, {
				headers: { Authorization: `Bearer ${token}` },
			});

			Swal.fire({
				title: "¡Usuario creado!",
				text: "El usuario se ha creado correctamente.",
				icon: "success",
				confirmButtonColor: "#ff7eb3",
				confirmButtonText: "Continuar",
			}).then(() => {
				navigate("/usuarios");
			});
		} catch (error) {
			if (error.status === 401) {
				localStorage.clear();
				navigate("/error", {
					state: {
						errorCode: 401,
						mensaje: "Debe volver a iniciar sesión para continuar.",
					},
				});

				return;
			}
			console.error("Error al crear usuario");
			setErrorServidor(
				"Error al crear el usuario. Asegúrate de que los datos sean válidos."
			);
		}
	};

	return (
		<AdminLayout>
			<div className="kreativa-form-wrapper">
				<div className="kreativa-card">
					<div className="text-center mb-3">
						<UserPlus size={80} color="#ff0072" strokeWidth={2.5} />
					</div>
					<h2 className="kreativa-form-title">Crear Usuario</h2>

					{errorServidor && (
						<div className="alert alert-danger kreativa-alert">
							{errorServidor}
						</div>
					)}

					<form onSubmit={handleSubmit}>
						<div className="form-group mb-3">
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

						<div className="form-group mb-3">
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

						<div className="form-group mb-3">
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

						<div className="form-group mb-3">
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

						<div className="form-group mb-3">
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

						<div className="form-group mb-3">
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

						<div className="form-group mb-3" style={{ position: "relative" }}>
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

						<div className="kreativa-btn-wrapper">
							<button
								type="submit"
								className="thm-btn kreativa-btn-crear"
								disabled={Object.values(errors).some((e) => e !== "")}
							>
								Crear Usuario
							</button>

							<button
								type="button"
								className="thm-btn thm-btn-secondary kreativa-btn-volver"
								onClick={() => navigate("/usuarios")}
							>
								Volver
							</button>
						</div>
					</form>
				</div>
			</div>
		</AdminLayout>
	);
};

export default CrearUsuario;
