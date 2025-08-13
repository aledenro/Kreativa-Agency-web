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
							user: user,
						},
					}
				);

				setPtoList(Array.isArray(response.data) ? response.data : []);
			} catch (err) {
				console.error("Error al obtener PTO");
				setError("No se pudieron cargar tus solicitudes de PTO.");
				setPtoList([]);
			} finally {
				setLoading(false);
			}
		};

		fetchMisPTO();
	}, []);

	const handleSort = () => {
		setSortOrder(sortOrder === "asc" ? "desc" : "asc");
	};

	const ptoListSeguro = Array.isArray(ptoList) ? ptoList : [];

	const ptoFiltrado =
		estadoFiltro === "todos"
			? ptoListSeguro
			: ptoListSeguro.filter(
					(pto) => pto.estado.toLowerCase() === estadoFiltro
				);

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

				{error ? (
					<p className="text-danger text-center">{error}</p>
				) : ptoListSeguro.length === 0 ? (
					<div className="text-end">
						<div className="mb-4">
							<a href="/agregar-pto" className="thm-btn">
								Solicitar PTO
							</a>
						</div>
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
									<Tr>
										<Td colSpan="4" className="text-center text-muted">
											No hay solicitudes de PTO para mostrar
										</Td>
									</Tr>
								</Tbody>
							</Table>
						</div>
					</div>
				) : (
					<>
						{/* Filtro por estado */}
						<div className="modal-filtro-container mb-3">
							<div className="modal-select-container col-3">
								<select
									className="form_input "
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

						{ptoFiltrado.length === 0 ? (
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
										<Tr>
											<Td colSpan="4" className="text-center text-muted">
												No hay solicitudes de PTO con el estado seleccionado
											</Td>
										</Tr>
									</Tbody>
								</Table>
							</div>
						) : (
							<>
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
													<Td>
														{new Date(pto.fecha_inicio).toLocaleDateString()}
													</Td>
													<Td>
														{new Date(pto.fecha_fin).toLocaleDateString()}
													</Td>
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
					</>
				)}
			</div>
		</AdminLayout>
	);
};

export default VerMiPTO;
