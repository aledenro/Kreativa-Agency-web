import { useEffect, useState } from "react";
import axios from "axios";
import lodash from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faEye,
	faPencil,
	faToggleOn,
	faToggleOff,
	faSort,
	faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Modal } from "react-bootstrap";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import { useNavigate } from "react-router-dom";
import TablaPaginacion from "../components/ui/TablaPaginacion";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import Loading from "../components/ui/LoadingComponent";

const GestionServicios = () => {
	const [servicios, setServicios] = useState([]);
	const [itemsPag, setItemsPag] = useState(5);
	const [pagActual, setPagActual] = useState(1);
	const [sortField, setSortField] = useState("nombre");
	const [sortOrder, setSortOrder] = useState("asc");
	const navigate = useNavigate();

	const [loading, setLoading] = useState(true);

	const [showModal, setShowModal] = useState(false);
	const [selectedServicio, setSelectedServicio] = useState(null);
	const [modalAction, setModalAction] = useState(""); // "activar" or "desactivar"

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
					`${import.meta.env.VITE_API_URL}/servicios/listado`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				if (Array.isArray(response.data)) {
					setServicios(response.data);
				} else {
					setServicios([]);
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
				console.error("Error al obtener los servicios");
				setServicios([]);
			} finally {
				setLoading(false);
			}
		};

		fetchServicios();
	}, []);

	const handleVerServicio = (id) => {
		navigate(`/servicio/${id}`);
	};

	const handleModificarServicio = (id) => {
		navigate(`/servicio/modificar/${id}`);
	};

	const handleAgregarServicio = () => {
		navigate(`/servicio/agregar`);
	};

	const confirmToggleEstadoServicio = (id, estadoActual) => {
		setSelectedServicio({ id, estadoActual });
		setModalAction(estadoActual ? "desactivar" : "activar");
		setShowModal(true);
	};

	const toggleEstadoServicio = async () => {
		if (!selectedServicio) return;

		const { id, estadoActual } = selectedServicio;

		try {
			const endpoint = estadoActual
				? `${import.meta.env.VITE_API_URL}/servicios/${id}/desactivar`
				: `${import.meta.env.VITE_API_URL}/servicios/${id}/activar`;

			const token = localStorage.getItem("token");

			if (!token) {
				navigate("/error", {
					state: {
						errorCode: 401,
						mensaje: "Debe iniciar sesión para continuar.",
					},
				});
			}

			const response = await axios.put(endpoint, {
				headers: { Authorization: `Bearer ${token}` },
			});

			setServicios(
				servicios.map((servicio) =>
					servicio._id === id
						? { ...servicio, activo: !estadoActual }
						: servicio
				)
			);

			setShowModal(false);
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
			console.error("Error al cambiar el estado del servicio");
			setShowModal(false);
		}
	};

	const serviciosOrdenados = [...servicios].sort((a, b) => {
		let valueA = lodash.get(a, sortField);
		let valueB = lodash.get(b, sortField);

		if (sortField === "fecha_creacion" || sortField === "fecha_modificacion") {
			return sortOrder === "asc"
				? new Date(valueA) - new Date(valueB)
				: new Date(valueB) - new Date(valueA);
		}

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

	const serviciosPaginados = serviciosOrdenados.slice(
		(pagActual - 1) * itemsPag,
		pagActual * itemsPag
	);

	const totalPags = Math.ceil(servicios.length / itemsPag);

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
		<AdminLayout>
			<div className="main-container mx-auto">
				<div className="espacio-top-responsive"></div>
				<div className="d-flex justify-content-between align-items-center mb-4">
					<h1>Gestión de Servicios</h1>
					<button className="thm-btn" onClick={handleAgregarServicio}>
						<FontAwesomeIcon icon={faPlus} className="me-2" /> Nuevo Servicio
					</button>
				</div>

				<div className="div-table">
					<Table className="main-table">
						<Thead>
							<Tr>
								<Th onClick={() => handleSort("nombre")} className="col-nombre">
									Nombre{" "}
									<span className="sort-icon">
										<FontAwesomeIcon icon={faSort} />
									</span>
								</Th>
								<Th className="col-descripcion">Descripción</Th>
								<Th onClick={() => handleSort("activo")} className="col-estado">
									Estado{" "}
									<span className="sort-icon">
										<FontAwesomeIcon icon={faSort} />
									</span>
								</Th>
								<Th className="col-paquetes">Paquetes</Th>
								<Th className="col-acciones">Acciones</Th>
							</Tr>
						</Thead>
						<Tbody>
							{serviciosPaginados.length > 0 ? (
								serviciosPaginados.map((servicio) => (
									<Tr key={servicio._id}>
										<Td className="col-nombre">{servicio.nombre}</Td>
										<Td className="col-descripcion">
											{servicio.descripcion?.length > 50
												? `${servicio.descripcion.substring(0, 50)}...`
												: servicio.descripcion}
										</Td>
										<Td className="col-estado">
											<span
												className={`badge ${servicio.activo ? "badge-verde" : "badge-rojo"}`}
											>
												{servicio.activo ? "Activo" : "Inactivo"}
											</span>
										</Td>
										<Td className="col-paquetes">
											{servicio.cantidadPaquetes || 0}
										</Td>
										<Td className="text-center col-acciones">
											<div className="botones-grupo">
												<button
													className="thm-btn thm-btn-small btn-amarillo"
													onClick={() => handleVerServicio(servicio._id)}
												>
													<FontAwesomeIcon icon={faEye} />
												</button>
												<button
													className="thm-btn thm-btn-small btn-azul"
													onClick={() => handleModificarServicio(servicio._id)}
												>
													<FontAwesomeIcon icon={faPencil} />
												</button>
												<button
													className={`thm-btn thm-btn-small ${
														servicio.activo ? "btn-verde" : "btn-rojo"
													}`}
													onClick={() =>
														confirmToggleEstadoServicio(
															servicio._id,
															servicio.activo
														)
													}
												>
													<FontAwesomeIcon
														icon={servicio.activo ? faToggleOn : faToggleOff}
													/>
												</button>
											</div>
										</Td>
									</Tr>
								))
							) : (
								<Tr>
									<Td colSpan="5" className="text-center">
										No hay servicios disponibles
									</Td>
								</Tr>
							)}
						</Tbody>
					</Table>
				</div>

				<TablaPaginacion
					totalItems={servicios.length}
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
						¿Seguro que desea {modalAction} este servicio?
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
							onClick={toggleEstadoServicio}
						>
							Sí
						</button>
					</Modal.Footer>
				</Modal>
			</div>
		</AdminLayout>
	);
};

export default GestionServicios;
