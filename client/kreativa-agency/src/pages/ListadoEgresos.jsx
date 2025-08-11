import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import lodash from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faSort,
	faEye,
	faPencil,
	faToggleOn,
	faToggleOff,
	faBackward,
	faCaretLeft,
	faCaretRight,
	faForward,
	faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Form, Button, Modal } from "react-bootstrap";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import ModalVerEgreso from "../components/Egresos/ModalVerEgreso";
import ModalEditarEgreso from "../components/Egresos/ModalEditarEgreso";
import ModalCrearEgreso from "../components/Egresos/ModalCrearEgreso";
import TablaPaginacion from "../components/ui/TablaPaginacion";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { useNavigate } from "react-router-dom";
import Loading from "../components/ui/LoadingComponent";
import TokenUtils, { updateSessionStatus } from "../utils/validateToken";

const ListadoEgresos = () => {
	const [egresos, setEgresos] = useState([]);
	const fixedCategories = [
		"Salarios",
		"Software",
		"Servicios de contabilidad",
		"Servicios",
	];
	const formatLocalDate = (date) => {
		const d = new Date(date);
		const year = d.getFullYear();
		const month = (d.getMonth() + 1).toString().padStart(2, "0");
		const day = d.getDate().toString().padStart(2, "0");
		return `${year}-${month}-${day}`;
	};

	// Filtro activo/inactivo
	const [filterEstado, setFilterEstado] = useState("Activo");
	const [filterFecha, setFilterFecha] = useState("");
	const [filterCategoria, setFilterCategoria] = useState("Todos");

	// Filtro  estado
	const [filterEgresoEstado, setFilterEgresoEstado] = useState("Pendiente");

	// Ordenamiento y paginación
	const [sortField, setSortField] = useState("fecha");
	const [sortOrder, setSortOrder] = useState("desc");
	const [itemsPag, setItemsPag] = useState(5);
	const [pagActual, setPagActual] = useState(1);

	// Estados para modales de contenido
	const [showModalVer, setShowModalVer] = useState(false);
	const [egresoVer, setEgresoVer] = useState({});
	const [showModalEditar, setShowModalEditar] = useState(false);
	const [egresoEditar, setEgresoEditar] = useState({});
	const [showModalCrear, setShowModalCrear] = useState(false);

	// Estados para modales de confirmación
	const [showConfirmToggle, setShowConfirmToggle] = useState(false);
	const [toggleEgreso, setToggleEgreso] = useState(null);
	const [showConfirmEditar, setShowConfirmEditar] = useState(false);
	const [showConfirmCrear, setShowConfirmCrear] = useState(false);

	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	const fetchEgresos = useCallback(async () => {
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
			const res = await axios.get(`${import.meta.env.VITE_API_URL}/egresos`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setEgresos(res.data);
		} catch (error) {
			if (error.status === 401) {
				await updateSessionStatus();				
				localStorage.clear();
				navigate("/error", {
					state: {
						errorCode: 401,
						mensaje: "Debe volver a iniciar sesión para continuar.",
					},
				});

				return;
			}
			console.error("Error al obtener egresos");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchEgresos();
	}, [fetchEgresos]);

	// Filtro de egresos
	let egresosFiltrados = egresos;

	// Filtro activo/inactivo
	if (filterEstado !== "" && filterEstado !== "Todos") {
		egresosFiltrados =
			filterEstado === "Activo"
				? egresosFiltrados.filter((e) => e.activo)
				: egresosFiltrados.filter((e) => !e.activo);
	}
	// Filtro fecha
	if (filterFecha !== "") {
		egresosFiltrados = egresosFiltrados.filter(
			(e) => formatLocalDate(e.fecha) === filterFecha
		);
	}
	// Filtro categoría
	if (filterCategoria !== "Todos") {
		egresosFiltrados = egresosFiltrados.filter(
			(e) => e.categoria === filterCategoria
		);
	}
	// Filtro estado
	if (filterEgresoEstado !== "Todos") {
		egresosFiltrados = egresosFiltrados.filter(
			(e) => e.estado === filterEgresoEstado
		);
	}

	const egresosOrdenados =
		sortOrder === "asc"
			? egresosFiltrados.sort((a, b) =>
					lodash
						.get(a, sortField)
						.toString()
						.localeCompare(lodash.get(b, sortField).toString())
				)
			: egresosFiltrados.sort((a, b) =>
					lodash
						.get(b, sortField)
						.toString()
						.localeCompare(lodash.get(a, sortField).toString())
				);

	const totalPaginas = Math.ceil(egresosOrdenados.length / itemsPag);
	const egresosPaginados = egresosOrdenados.slice(
		(pagActual - 1) * itemsPag,
		pagActual * itemsPag
	);

	const cambiarPagina = (num) => {
		if (num >= 1 && num <= totalPaginas) setPagActual(num);
	};

	// Activar/desactivar egresos
	const handleToggleClick = (egreso) => {
		setToggleEgreso(egreso);
		setShowConfirmToggle(true);
	};

	const handleConfirmToggle = async () => {
		if (toggleEgreso) {
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
				const url = toggleEgreso.activo
					? `${import.meta.env.VITE_API_URL}/egresos/${toggleEgreso._id}/desactivar`
					: `${import.meta.env.VITE_API_URL}/egresos/${toggleEgreso._id}/activar`;
				await axios.put(url, {},{
					headers: { Authorization: `Bearer ${token}` },
				});
				setEgresos((prev) =>
					prev.map((e) =>
						e._id === toggleEgreso._id ? { ...e, activo: !e.activo } : e
					)
				);
				setShowConfirmToggle(false);
				setToggleEgreso(null);
			} catch (error) {
				if (error.status === 401) {
				await updateSessionStatus();					navigate("/error", {
						state: {
							errorCode: 401,
							mensaje: "Debe volver a iniciar sesión para continuar.",
						},
					});
					return;
				}
				console.error("Error al cambiar estado de egreso");
			}
		}
	};

	// Al editar
	const onSaveEdit = (data) => {
		setShowModalEditar(false);
		setShowConfirmEditar(true);
		fetchEgresos();
	};

	// Al crear
	const onSaveCrear = () => {
		setShowModalCrear(false);
		setShowConfirmCrear(true);
		fetchEgresos();
	};

	const handleConfirmEditar = () => {
		setShowConfirmEditar(false);
	};

	const handleConfirmCrear = () => {
		setShowConfirmCrear(false);
	};

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

	const getCategoryName = (cat) => cat;

	return (
		<AdminLayout>
			<div className="main-container mx-auto">
				<div className="espacio-top-responsive"></div>
				{/* Encabezado */}
				<div
					className="d-flex justify-content-between align-items-center mb-4"
					style={{ paddingRight: "80px" }}
				>
					<h1>Gestión de Egresos</h1>
					<button className="thm-btn" onClick={() => setShowModalCrear(true)}>
						<FontAwesomeIcon icon={faPlus} className="me-2" /> Nuevo Egreso
					</button>
				</div>

				{/* Filtros en dos columnas */}
				<div className="row mb-3">
					{/* Fecha y Categoría */}
					<div className="col-md-4">
						<Form.Group controlId="filterCategoria">
							<Form.Label>Categoría:</Form.Label>
							<Form.Select
								value={filterCategoria}
								onChange={(e) => {
									setFilterCategoria(e.target.value);
									setPagActual(1);
								}}
								className="thm-btn"
							>
								<option value="Todos">Todos</option>
								{fixedCategories.map((cat, index) => (
									<option key={index} value={cat}>
										{cat}
									</option>
								))}
							</Form.Select>
						</Form.Group>
						<Form.Group controlId="filterFecha">
							<Form.Label>Fecha:</Form.Label>
							<Form.Control
								type="date"
								value={filterFecha}
								onChange={(e) => {
									setFilterFecha(e.target.value);
									setPagActual(1);
								}}
								className="thm-btn"
							/>
						</Form.Group>
					</div>
					{/* Activo/Inactivo y Estado */}
					<div className="col-md-3">
						<Form.Group
							controlId="filterEstado"
							className="mb-4"
							style={{ paddingRight: "80px" }}
						>
							<Form.Label>Activo/Inactivo:</Form.Label>
							<Form.Select
								value={filterEstado}
								onChange={(e) => {
									setFilterEstado(e.target.value);
									setPagActual(1);
								}}
								className="thm-btn"
							>
								<option value="Todos">Todos</option>
								<option value="Activo">Activo</option>
								<option value="Inactivo">Inactivo</option>
							</Form.Select>
						</Form.Group>
						<Form.Group
							controlId="filterEgresoEstado"
							style={{ paddingRight: "80px" }}
						>
							<Form.Label>Estado de Pago:</Form.Label>
							<Form.Select
								value={filterEgresoEstado}
								onChange={(e) => {
									setFilterEgresoEstado(e.target.value);
									setPagActual(1);
								}}
								className="thm-btn"
							>
								<option value="Todos">Todos</option>
								<option value="Pendiente">Pendiente</option>
								<option value="Aprobado">Aprobado</option>
								<option value="Rechazado">Rechazado</option>
							</Form.Select>
						</Form.Group>
					</div>
					{/* Botón para limpiar filtros */}
					<div className="col-md-4 d-flex align-items-end">
						<button
							className="thm-btn btn-gris"
							onClick={() => {
								setFilterCliente("");
								setFilterFecha("");
								setFilterEstado("Activo");
								setFilterEstadoPago("Pendiente de pago");
								setPagActual(1);
							}}
						>
							Limpiar Filtros
						</button>
					</div>
				</div>

				{/* Tabla de egresos */}

				<div className="div-table">
					<Table className="main-table">
						<Thead>
							<Tr>
								<Th onClick={() => handleSort("fecha")} className="col-fecha">
									Fecha{" "}
									<span className="sort-icon">
										<FontAwesomeIcon icon={faSort} />
									</span>
								</Th>
								<Th onClick={() => handleSort("monto")} className="col-monto">
									Monto{" "}
									<span className="sort-icon">
										<FontAwesomeIcon icon={faSort} />
									</span>
								</Th>
								<Th className="col-categoria">Categoría</Th>
								<Th className="col-descripcion">Descripción</Th>
								<Th className="col-proveedor">Proveedor</Th>
								<Th className="col-estado">Estado</Th>
								<Th className="col-acciones">Acciones</Th>
							</Tr>
						</Thead>
						<Tbody>
							{egresosPaginados.length === 0 ? (
								<Tr>
									<Td colSpan="7" className="text-center">
										No hay egresos para mostrar.
									</Td>
								</Tr>
							) : (
								egresosPaginados.map((egreso) => (
									<Tr key={egreso._id}>
										<Td className="col-fecha">
											{new Date(egreso.fecha).toLocaleDateString()}
										</Td>
										<Td className="col-monto">₡{egreso.monto}</Td>
										<Td className="col-categoria">
											{getCategoryName(egreso.categoria)}
										</Td>
										<Td className="col-descripcion">{egreso.descripcion}</Td>
										<Td className="col-proveedor">{egreso.proveedor}</Td>
										<Td className="col-estado">{egreso.estado}</Td>
										<Td className="text-center col-acciones">
											<div className="botones-grupo">
												<button
													className="thm-btn thm-btn-small btn-amarillo"
													onClick={() => {
														setEgresoVer(egreso);
														setShowModalVer(true);
													}}
													title="Ver detalle"
												>
													<FontAwesomeIcon icon={faEye} />
												</button>
												<button
													className="thm-btn thm-btn-small btn-azul"
													onClick={() => {
														setEgresoEditar(egreso);
														setShowModalEditar(true);
													}}
													title="Modificar"
													disabled={!egreso.activo}
												>
													<FontAwesomeIcon icon={faPencil} />
												</button>
												<button
													className={`thm-btn thm-btn-small ${
														egreso.activo ? "btn-verde" : "btn-rojo"
													}`}
													onClick={() => handleToggleClick(egreso)}
													title={egreso.activo ? "Desactivar" : "Activar"}
												>
													<FontAwesomeIcon
														icon={egreso.activo ? faToggleOn : faToggleOff}
													/>
												</button>
											</div>
										</Td>
									</Tr>
								))
							)}
						</Tbody>
					</Table>
				</div>

				<TablaPaginacion
					totalItems={egresosOrdenados.length}
					itemsPorPagina={itemsPag}
					paginaActual={pagActual}
					onItemsPorPaginaChange={(cant) => {
						setItemsPag(cant);
						setPagActual(1);
					}}
					onPaginaChange={(pagina) => setPagActual(pagina)}
				/>
			</div>

			{/* Modal de confirmación para activar/desactivar */}
			<Modal
				show={showConfirmToggle}
				onHide={() => setShowConfirmToggle(false)}
			>
				<Modal.Header closeButton>
					<Modal.Title>Confirmar Acción</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{toggleEgreso && toggleEgreso.activo
						? "¿Está seguro de que desea desactivar este egreso?"
						: "¿Está seguro de que desea activar este egreso?"}
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="secondary"
						onClick={() => setShowConfirmToggle(false)}
					>
						Cancelar
					</Button>
					<Button variant="primary" onClick={handleConfirmToggle}>
						Aceptar
					</Button>
				</Modal.Footer>
			</Modal>

			{/* Modal de confirmación para editar */}
			<Modal
				show={showConfirmEditar}
				onHide={() => setShowConfirmEditar(false)}
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title>Egreso Editado</Modal.Title>
				</Modal.Header>
				<Modal.Body>Egreso actualizado exitosamente.</Modal.Body>
				<Modal.Footer>
					<button
						className="thm-btn thm-btn-small"
						onClick={handleConfirmEditar}
					>
						Aceptar
					</button>
				</Modal.Footer>
			</Modal>

			{/* Componentes de contenido */}
			<ModalVerEgreso
				show={showModalVer}
				handleClose={() => setShowModalVer(false)}
				egreso={egresoVer}
				categories={fixedCategories.map((cat) => ({ _id: cat, nombre: cat }))}
			/>
			<ModalEditarEgreso
				show={showModalEditar}
				handleClose={() => setShowModalEditar(false)}
				egreso={egresoEditar}
				onSave={onSaveEdit}
			/>
			<ModalCrearEgreso
				show={showModalCrear}
				handleClose={() => setShowModalCrear(false)}
				onSave={onSaveCrear}
			/>
		</AdminLayout>
	);
};

export default ListadoEgresos;
