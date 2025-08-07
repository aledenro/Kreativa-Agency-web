import React, { useState, useEffect } from "react";
import { Dropdown, Modal } from "react-bootstrap";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPencil,
	faToggleOn,
	faToggleOff,
	faBackward,
	faCaretLeft,
	faCaretRight,
	faForward,
	faSort,
	faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { notification } from "antd";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import { useNavigate } from "react-router-dom";
import TablaPaginacion from "../components/ui/TablaPaginacion";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import Loading from "../components/ui/LoadingComponent";

const GestionPaquetes = () => {
	const [servicios, setServicios] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [api, contextHolder] = notification.useNotification();
	const [itemsPag, setItemsPag] = useState(5);
	const [pagActual, setPagActual] = useState(1);
	const [sortField, setSortField] = useState("nombre");
	const [sortOrder, setSortOrder] = useState("asc");
	const navigate = useNavigate();

	const [showModal, setShowModal] = useState(false);
	const [selectedPaquete, setSelectedPaquete] = useState(null);
	const [modalAction, setModalAction] = useState("");

	const openErrorNotification = (message) => {
		api.error({
			message: "Error",
			description: message,
			placement: "bottomRight",
			duration: 4,
		});
	};

	useEffect(() => {
		const fetchServicios = async () => {
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
					`${import.meta.env.VITE_API_URL}/servicios/con-paquetes`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);

				if (Array.isArray(response.data)) {
					setServicios(response.data);
				} else {
					setServicios([]);
				}
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
				setError("Error al cargar los servicios");
				openErrorNotification("No se pudieron cargar los servicios.");
				setServicios([]);
			} finally {
				setLoading(false);
			}
		};

		fetchServicios();
	}, []);

	const obtenerTodosLosPaquetes = () => {
		const todosPaquetes = [];

		servicios.forEach((servicio) => {
			if (servicio.paquetes && servicio.paquetes.length > 0) {
				servicio.paquetes.forEach((paquete) => {
					todosPaquetes.push({
						...paquete,
						servicioId: servicio._id,
						servicioNombre: servicio.nombre,
					});
				});
			}
		});

		return todosPaquetes;
	};

	const confirmToggleEstadoPaquete = (servicioId, paqueteId, estadoActual) => {
		setSelectedPaquete({ servicioId, paqueteId, estadoActual });
		setModalAction(estadoActual ? "desactivar" : "activar");
		setShowModal(true);
	};

	const toggleEstadoPaquete = async () => {
		if (!selectedPaquete) return;

		const { servicioId, paqueteId, estadoActual } = selectedPaquete;
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
		try {
			const endpoint = estadoActual
				? `${import.meta.env.VITE_API_URL}/servicios/${servicioId}/paquetes/${paqueteId}/desactivar`
				: `${import.meta.env.VITE_API_URL}/servicios/${servicioId}/paquetes/${paqueteId}/activar`;

			const response = await axios.put(endpoint, null, {
				headers: { Authorization: `Bearer ${token}` },
			});

			setServicios((prevServicios) =>
				prevServicios.map((servicio) =>
					servicio._id === servicioId ? response.data : servicio
				)
			);
			setShowModal(false);
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
			console.error("Error al cambiar el estado del paquete");
			openErrorNotification("Error al cambiar el estado del paquete.");
			setShowModal(false);
		}
	};

	const handleEditarPaquete = (paquete) => {
		navigate(`/paquete/modificar/${paquete.servicioId}/${paquete._id}`);
	};

	const handleAgregarPaqueteAServicio = (servicioId) => {
		navigate(`/servicio/agregarPaquete/${servicioId}`);
	};

	const handlePaquete = (servicioId) => {
		navigate(`/servicio/${servicioId}`);
	};

	const paquetes = obtenerTodosLosPaquetes();

	const paquetesOrdenados = [...paquetes].sort((a, b) => {
		let valueA = a[sortField];
		let valueB = b[sortField];

		if (typeof valueA === "string" && typeof valueB === "string") {
			return sortOrder === "asc"
				? valueA.localeCompare(valueB)
				: valueB.localeCompare(valueA);
		}

		return sortOrder === "asc"
			? valueA > valueB
				? 1
				: -1
			: valueB > valueA
				? 1
				: -1;
	});

	const paquetesPaginados = paquetesOrdenados.slice(
		(pagActual - 1) * itemsPag,
		pagActual * itemsPag
	);

	const totalPags = Math.ceil(paquetes.length / itemsPag);

	const handleSort = (field) => {
		if (sortField === field) {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortOrder("asc");
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
		<div>
			<AdminLayout>
				<div className="container mt-4">
					{contextHolder}
					<div style={{ height: "90px" }}></div>
					<div className="d-flex justify-content-between align-items-center mb-4">
						<h1>Gestión de Paquetes</h1>
						<Dropdown>
							<style>
								{`
                                .thm-btn:hover {
                                    border-color: #ff0072 !important;
                                }
                                    .thm-btn:active {
                                    background-color: transparent !important;
                            `}
							</style>
							<Dropdown.Toggle className="thm-btn" id="dropdown-servicios">
								<FontAwesomeIcon icon={faPlus} className="me-2" /> Nuevo Paquete
							</Dropdown.Toggle>

							<Dropdown.Menu
								style={{
									backgroundColor: "white",
								}}
							>
								<style>
									{`
                                    .dropdown-item:active {
                                        background-color: #ff0072 !important;
                                    }
                                    .dropdown-item:hover {
                                        background-color: #ffebf4 !important;
                                        color: #ff0072
                                    }
                                `}
								</style>
								{servicios.length > 0 ? (
									servicios.map((servicio) => (
										<Dropdown.Item
											key={servicio._id}
											onClick={() =>
												handleAgregarPaqueteAServicio(servicio._id)
											}
											style={{
												color: "#110d27",
												backgroundColor: "white",
											}}
										>
											{servicio.nombre}
										</Dropdown.Item>
									))
								) : (
									<Dropdown.Item disabled style={{ backgroundColor: "white" }}>
										No hay servicios disponibles
									</Dropdown.Item>
								)}
							</Dropdown.Menu>
						</Dropdown>
					</div>
					<div className="div-table">
						<Table className="main-table">
							<Thead>
								<Tr>
									<Th
										onClick={() => handleSort("servicioNombre")}
										className="col-nombre"
									>
										Servicio{" "}
										<span className="sort-icon">
											<FontAwesomeIcon icon={faSort} />
										</span>
									</Th>
									<Th
										onClick={() => handleSort("nombre")}
										className="col-proyecto"
									>
										Nombre{" "}
										<span className="sort-icon">
											<FontAwesomeIcon icon={faSort} />
										</span>
									</Th>
									<Th onClick={() => handleSort("nivel")} className="col-nivel">
										Nivel{" "}
										<span className="sort-icon">
											<FontAwesomeIcon icon={faSort} />
										</span>
									</Th>
									<Th
										onClick={() => handleSort("precio")}
										className="col-precio"
									>
										Precio{" "}
										<span className="sort-icon">
											<FontAwesomeIcon icon={faSort} />
										</span>
									</Th>
									<Th
										onClick={() => handleSort("duracion")}
										className="col-fecha"
									>
										Duración{" "}
										<span className="sort-icon">
											<FontAwesomeIcon icon={faSort} />
										</span>
									</Th>
									<Th
										onClick={() => handleSort("activo")}
										className="col-estado"
									>
										Estado{" "}
										<span className="sort-icon">
											<FontAwesomeIcon icon={faSort} />
										</span>
									</Th>
									<Th className="col-acciones">Acciones</Th>
								</Tr>
							</Thead>
							<Tbody>
								{paquetesPaginados.length > 0 ? (
									paquetesPaginados.map((paquete) => (
										<Tr key={paquete._id}>
											<Td
												className="col-nombre"
												onClick={() => handlePaquete(paquete.servicioId)}
											>
												{paquete.servicioNombre || "Sin servicio asignado"}
											</Td>
											<Td className="col-proyecto">{paquete.nombre}</Td>
											<Td className="col-nivel">{paquete.nivel}</Td>
											<Td className="col-precio">${paquete.precio}</Td>
											<Td className="col-fecha">{paquete.duracion}</Td>
											<Td className="col-estado">
												<span
													className={`badge ${paquete.activo ? "badge-verde" : "badge-rojo"}`}
												>
													{paquete.activo ? "Activo" : "Inactivo"}
												</span>
											</Td>
											<Td className="text-center col-acciones">
												<div className="botones-grupo">
													<button
														className="thm-btn thm-btn-small btn-azul"
														onClick={() => handleEditarPaquete(paquete)}
														title="Modificar"
													>
														<FontAwesomeIcon icon={faPencil} />
													</button>
													<button
														className={`thm-btn thm-btn-small ${paquete.activo ? "btn-verde" : "btn-rojo"}`}
														onClick={() =>
															confirmToggleEstadoPaquete(
																paquete.servicioId,
																paquete._id,
																paquete.activo
															)
														}
														title={paquete.activo ? "Desactivar" : "Activar"}
													>
														<FontAwesomeIcon
															icon={paquete.activo ? faToggleOn : faToggleOff}
														/>
													</button>
												</div>
											</Td>
										</Tr>
									))
								) : (
									<Tr>
										<Td colSpan="7" className="text-center">
											No hay paquetes disponibles
										</Td>
									</Tr>
								)}
							</Tbody>
						</Table>
					</div>

					<TablaPaginacion
						totalItems={paquetes.length}
						itemsPorPagina={itemsPag}
						paginaActual={pagActual}
						onItemsPorPaginaChange={(cant) => {
							setItemsPag(cant);
							setPagActual(1);
						}}
						onPaginaChange={(pagina) => setPagActual(pagina)}
					/>

					<Modal show={showModal} onHide={() => setShowModal(false)}>
						<Modal.Header closeButton>
							<Modal.Title>Confirmar Acción</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							¿Seguro que desea {modalAction} este paquete?
						</Modal.Body>
						<Modal.Footer>
							<button
								className="thm-btn thm-btn-small btn-rojo"
								onClick={() => setShowModal(false)}
							>
								No
							</button>
							<button
								className="thm-btn thm-btn-small"
								onClick={toggleEstadoPaquete}
							>
								Sí
							</button>
						</Modal.Footer>
					</Modal>
				</div>
			</AdminLayout>
		</div>
	);
};

export default GestionPaquetes;
