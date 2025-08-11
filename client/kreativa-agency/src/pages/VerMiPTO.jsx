// src/pages/VerMiPTO.jsx

import "../App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import TablaPaginacion from "../components/ui/TablaPaginacion";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import Loading from "../components/ui/LoadingComponent";

const VerMiPTO = () => {
	const [ptoList, setPtoList] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [estadoFiltro, setEstadoFiltro] = useState("todos");

	const [itemsPag, setItemsPag] = useState(5);
	const [pagActual, setPagActual] = useState(1);
	const [sortOrder, setSortOrder] = useState("asc");

	useEffect(() => {
		const fetchMisPTO = async () => {
			try {
				const token = localStorage.getItem("token");
				const userId = localStorage.getItem("user_id");
				const user = localStorage.getItem("user_name");

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
						headers: { 
						Authorization: `Bearer ${token}`,
						user: user
				
					},
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

	const handleSort = () => {
		setSortOrder(sortOrder === "asc" ? "desc" : "asc");
	};

	const ptoFiltrado =
		estadoFiltro === "todos"
			? ptoList
			: ptoList.filter((pto) => pto.estado.toLowerCase() === estadoFiltro);

	const ptoOrdenado = [...ptoFiltrado].sort((a, b) => {
		const dateA = new Date(a.fecha_inicio);
		const dateB = new Date(b.fecha_inicio);
		return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
	});

	const ptoPaginado = ptoOrdenado.slice(
		(pagActual - 1) * itemsPag,
		pagActual * itemsPag
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
					<>
						{/* Filtro por estado */}
						<div className="modal-filtro-container mb-3">
							<div className="modal-select-container">
								<select
									className="modal-select-input"
									value={estadoFiltro}
									onChange={(e) => {
										setEstadoFiltro(e.target.value);
										setPagActual(1);
									}}
								>
									<option value="todos">Todos</option>
									<option value="pendiente">Pendiente</option>
									<option value="aprobado">Aprobado</option>
								</select>
							</div>
						</div>

						{/* Tabla de resultados */}
						<div className="div-table">
							<Table className="main-table">
								<Thead>
									<Tr>
										<Th onClick={handleSort} style={{ cursor: "pointer" }}>
											Fecha de Inicio <FontAwesomeIcon icon={faSort} />
										</Th>
										<Th>Fecha de Fin</Th>
										<Th>Comentario</Th>
										<Th>Estado</Th>
									</Tr>
								</Thead>
								<Tbody>
									{ptoPaginado.map((pto) => (
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

						<TablaPaginacion
							totalItems={ptoFiltrado.length}
							itemsPorPagina={itemsPag}
							paginaActual={pagActual}
							onItemsPorPaginaChange={(cant) => {
								setItemsPag(cant);
								setPagActual(1);
							}}
							onPaginaChange={(pagina) => setPagActual(pagina)}
						/>
					</>
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
