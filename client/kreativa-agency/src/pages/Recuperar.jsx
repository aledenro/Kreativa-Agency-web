import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import sendEmailExterno from "../utils/sendEmailExterno";

const Recuperar = () => {
	const [email, setEmail] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/recuperar`,
				{ email }
			);

			const { token } = response.data;

			const resetLink = `${window.location.origin}/restablecer/${token}`;

			await sendEmailExterno(
				email,
				"Para restablecer tu contraseña haz clic en el botón a continuación:",
				"Recupera tu contraseña",
				"Restablecer",
				resetLink
			);

			Swal.fire({
				title: "¡Éxito!",
				text: "Correo de recuperación enviado con éxito. Revisa tu bandeja de entrada.",
				icon: "success",
				confirmButtonText: "Aceptar",
				customClass: {
					confirmButton: "swal-button-kreativa",
				},
				confirmButtonColor: "#ff0072",
			}).then((result) => {
				if (result.isConfirmed) {
					navigate("/login");
				}
			});
		} catch (error) {
			let mensaje = "No se pudo enviar el correo de recuperación";

			if (error.response?.status === 404) {
				mensaje = "Usuario o correo no registrado";
			} else if (error.response?.data?.mensaje) {
				mensaje = error.response.data.mensaje;
			}

			Swal.fire({
				title: "Error",
				text: mensaje,
				icon: "error",
				confirmButtonText: "Intentar de nuevo",
				customClass: {
					confirmButton: "swal-button-kreativa",
				},
				confirmButtonColor: "#ff0072",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="login-split-container">
			<div className="login-left">
				<div className="logo-container">
					<img
						src="https://kreativa-public.s3.us-east-2.amazonaws.com/landing/logo.png"
						alt="Logo Kreativa"
						className="logo-kreativa"
					/>
				</div>
				<h2 className="login-title">Recuperar Contraseña</h2>
				<p className="login-subtitle">
					Ingresá tu correo electrónico para recibir un enlace de recuperación
				</p>
				<form className="login-form" onSubmit={handleSubmit}>
					<div className="form-group input-icon-wrapper">
						<EnvelopeIcon className="input-icon-min" />
						<input
							type="email"
							className="form-input"
							placeholder="Correo electrónico"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div className="login-buttons">
						<button
							type="button"
							className="thm-btn btn-volver-login"
							onClick={() => navigate("/login")}
						>
							Volver
						</button>
						<button type="submit" className="thm-btn btn-kreativa">
							Enviar
						</button>
					</div>
				</form>
			</div>
			<div className="login-right">
				<h2 className="welcome-text">¿OLVIDASTE TU CONTRASEÑA?</h2>
				<p className="slogan-text">Te ayudamos a recuperarla rápidamente</p>
			</div>
		</div>
	);
};

export default Recuperar;
