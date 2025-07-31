// src/pages/VerMiPTO.jsx

import "../App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import Swal from "sweetalert2";

const VerMiPTO = () => {
	const [ptoList, setPtoList] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchMisPTO = async () => {
			try {
				const token = localStorage.getItem("token");
				const userId = localStorage.getItem("user_id"); 

				if (!token || !userId) {
					Swal.fire({
						title: "Error",
						text: "No hay sesión activa.",
						icon: "error",
						confirmButtonColor: "#ff0072",
					});
					return;
				}

				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/pto/${userId}`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);

				setPtoList(response.data);
			} catch (err) {
				console.error("Error al obtener PTO:", err);
				setError("No se pudieron cargar tus solicitudes de PTO.");
			} finally {
				setLoading(false);
			}
		};

		fetchMisPTO();
	}, []);

	return (
		<AdminLayout>
			<div className="main-container mx-auto">
				<div className="espacio-top-responsive"></div>
				<h1 className="mb-4">Mis Solicitudes de PTO</h1>

				{loading ? (
					<p className="text-center">Cargando...</p>
				) : error ? (
					<p className="text-danger text-center">{error}</p>
				) : ptoList.length === 0 ? (
					<p className="text-center text-muted">
						Aún no has realizado ninguna solicitud de PTO.
					</p>
				) : (
					<div className="div-table">
						<Table className="main-table">
							<Thead>
								<Tr>
									<Th>Fecha de Inicio</Th>
									<Th>Fecha de Fin</Th>
									<Th>Comentario</Th>
									<Th>Estado</Th>
								</Tr>
							</Thead>
							<Tbody>
								{ptoList.map((pto) => (
									<Tr key={pto._id}>
										<Td>{new Date(pto.fecha_inicio).toLocaleDateString()}</Td>
										<Td>{new Date(pto.fecha_fin).toLocaleDateString()}</Td>
										<Td>{pto.comentario || "Sin comentario"}</Td>
										<Td className={`estado-${pto.estado.toLowerCase()}`}>
											{pto.estado}
										</Td>
									</Tr>
								))}
							</Tbody>
						</Table>
					</div>
				)}

				<div className="text-center mt-4">
					<a href="/dashboard" className="thm-btn thm-btn-small btn-gris">
						Volver
					</a>
				</div>
			</div>
		</AdminLayout>
	);
};

export default VerMiPTO;