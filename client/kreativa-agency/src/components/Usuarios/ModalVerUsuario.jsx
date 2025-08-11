import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { User } from "lucide-react";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";

const ModalVerUsuario = ({ show, handleClose, usuarioId }) => {
	const navigate = useNavigate();
	const [api, contextHolder] = notification.useNotification();
	const [usuario, setUsuario] = useState(null);
	const [loading, setLoading] = useState(true);

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

		setLoading(true);
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

		try {
			const { data } = await axios.get(
				`${import.meta.env.VITE_API_URL}/usuarios/${usuarioId}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			setUsuario(data);
		} catch (error) {
			if (error.status === 401) {
				await updateSessionStatus();				navigate("/error", {
					state: {
						errorCode: 401,
						mensaje: "Debe volver a iniciar sesión para continuar.",
					},
				});
				return;
			}
			console.error("Error al obtener usuario:", error);
			openErrorNotification("Error al cargar el usuario.");
		} finally {
			setLoading(false);
		}
	}, [usuarioId, navigate]);

	useEffect(() => {
		if (show && usuarioId) {
			fetchUsuario();
		}
	}, [show, usuarioId, fetchUsuario]);

	const resetModal = () => {
		setUsuario(null);
		setLoading(true);
	};

	return (
		<Modal
			show={show}
			onHide={() => {
				resetModal();
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
						<User
							size={24}
							color="#ff0072"
							strokeWidth={2.5}
							className="me-2"
						/>
						Detalles del Usuario
					</div>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body
				className="p-4"
				style={{ maxHeight: "70vh", overflowY: "auto" }}
			>
				{loading ? (
					<div className="text-center p-5">
						<p>Cargando usuario...</p>
					</div>
				) : usuario ? (
					<div className="kreativa-user-details">
						<div className="row mb-3">
							<div className="col-md-6">
								<div className="info-item">
									<div className="text-muted mb-1">Fecha de Creación</div>
									<div className="fw-medium">
										{new Date(usuario.fecha_creacion).toLocaleDateString(
											"es-ES"
										)}
									</div>
								</div>
							</div>
							<div className="col-md-6">
								<div className="info-item">
									<div className="text-muted mb-1">Estado</div>
									<span
										className={`badge ${
											usuario.estado === "Activo" ? "badge-verde" : "badge-rojo"
										}`}
									>
										{usuario.estado}
									</span>
								</div>
							</div>
						</div>

						<div className="mb-3">
							<strong className="text-muted">Nombre:</strong>
							<p className="mt-1 mb-3">{usuario.nombre}</p>
							<hr className="kreativa-divider" />
						</div>

						<div className="mb-3">
							<strong className="text-muted">Usuario:</strong>
							<p className="mt-1 mb-3">{usuario.usuario}</p>
							<hr className="kreativa-divider" />
						</div>

						<div className="mb-3">
							<strong className="text-muted">Cédula:</strong>
							<p className="mt-1 mb-3">{usuario.cedula}</p>
							<hr className="kreativa-divider" />
						</div>

						<div className="mb-3">
							<strong className="text-muted">Email:</strong>
							<p className="mt-1 mb-3">{usuario.email}</p>
							<hr className="kreativa-divider" />
						</div>

						<div className="mb-3">
							<strong className="text-muted">Tipo de Usuario:</strong>
							<p className="mt-1 mb-3">{usuario.tipo_usuario}</p>
						</div>
					</div>
				) : (
					<div className="text-center p-5">
						<p>No se encontró información del usuario.</p>
					</div>
				)}
			</Modal.Body>
			<Modal.Footer>
				<button
					type="button"
					className="thm-btn btn-gris"
					onClick={() => {
						resetModal();
						handleClose();
					}}
				>
					Cerrar
				</button>
			</Modal.Footer>
		</Modal>
	);
};

export default ModalVerUsuario;
