import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import { useNavigate } from "react-router-dom";
import Loading from "../components/ui/LoadingComponent";

const JerarquiaUsuarios = () => {
	const [jerarquia, setJerarquia] = useState({
		Administrador: [],
		Colaborador: [],
		Cliente: [],
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchJerarquia = async () => {
			const token = localStorage.getItem("token");

			if (!token) {
				navigate("/error", {
					state: {
						errorCode: 401,
						mensaje: "Debe iniciar sesión para continuar.",
					},
				});
			}

			try {
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/usuarios/jerarquia`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setJerarquia(response.data);
			} catch (err) {
				if (err.status === 401) {
					navigate("/error", {
						state: {
							errorCode: 401,
							mensaje: "Debe volver a iniciar sesión para continuar.",
						},
					});
					return;
				}
				setError("Error al obtener los usuarios.");
			} finally {
				setLoading(false);
			}
		};
		fetchJerarquia();
	}, []);

	const obtenerTituloRol = (rol) => {
		switch (rol) {
			case "Administrador":
				return "Administradores";
			case "Colaborador":
				return "Colaboradores";
			case "Cliente":
				return "Clientes";
			default:
				return rol;
		}
	};

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
		<AdminLayout>
			<div className="kreativa-jerarquia-wrapper">
				<h2 className="kreativa-title text-center">
					Organigrama Kreativa Agency
				</h2>

				{error ? (
					<p className="text-danger text-center">{error}</p>
				) : (
					<div className="jerarquia-section">
						{Object.entries(jerarquia).map(([rol, usuarios]) => (
							<div key={rol} className="jerarquia-group">
								<h4 className={`jerarquia-title kreativa-${rol.toLowerCase()}`}>
									{obtenerTituloRol(rol)}
								</h4>
								{usuarios.length > 0 ? (
									usuarios.map((usuario) => (
										<div
											key={usuario._id}
											className="kreativa-card animate-box"
										>
											<p className="kreativa-card-title">{usuario.nombre}</p>
											<p className="kreativa-card-text">
												Email: {usuario.email}
											</p>
											<p className="kreativa-card-text">
												Tipo de Usuario: {obtenerTituloRol(rol)}
											</p>
											<p className="kreativa-card-text">
												Estado: {usuario.estado}
											</p>
										</div>
									))
								) : (
									<p className="text-muted text-center">
										No hay {obtenerTituloRol(rol).toLowerCase()}.
									</p>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		</AdminLayout>
	);
};

export default JerarquiaUsuarios;
