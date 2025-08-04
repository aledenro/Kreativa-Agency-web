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
	faPlus,
	faBell,
} from "@fortawesome/free-solid-svg-icons";
import { Form, Button, Modal } from "react-bootstrap";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import { useNavigate } from "react-router-dom";
import ModalVerIngreso from "../components/Ingresos/ModalVerIngreso";
import ModalEditarIngreso from "../components/Ingresos/ModalEditarIngreso";
import ModalCrearIngreso from "../components/Ingresos/ModalCrearIngreso";
import sendEmail from "../utils/emailSender";
import TablaPaginacion from "../components/ui/TablaPaginacion";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import Loading from "../components/ui/LoadingComponent";

const ListadoIngresos = () => {
	// Datos principales
	const [ingresos, setIngresos] = useState([]);
	const [categories, setCategories] = useState([]);
	const [clientes, setClientes] = useState([]);
	const [loading, setLoading] = useState(true);

	const formatLocalDate = (date) => {
		const d = new Date(date);
		const year = d.getFullYear();
		const month = (d.getMonth() + 1).toString().padStart(2, "0");
		const day = d.getDate().toString().padStart(2, "0");
		return `${year}-${month}-${day}`;
	};

	// Filtros
	const [filterEstadoPago, setFilterEstadoPago] = useState("Pendiente de pago");
	const [filterEstado, setFilterEstado] = useState("Activo");
	const [filterCliente, setFilterCliente] = useState("");
	const [filterFecha, setFilterFecha] = useState("");

	// Ordenamiento y paginación
	const [sortField, setSortField] = useState("fecha_creacion");
	const [sortOrder, setSortOrder] = useState("desc");
	const [itemsPag, setItemsPag] = useState(5);
	const [pagActual, setPagActual] = useState(1);

	// Estados para modales de contenido
	const [showModalVer, setShowModalVer] = useState(false);
	const [ingresoVer, setIngresoVer] = useState({});
	const [showModalEditar, setShowModalEditar] = useState(false);
	const [ingresoEditar, setIngresoEditar] = useState({});
	const [showModalCrear, setShowModalCrear] = useState(false);

	// Estados para modales de confirmación y edición/creación
	const [showConfirmToggle, setShowConfirmToggle] = useState(false);
	const [toggleIngreso, setToggleIngreso] = useState(null);
	const [showConfirmEditar, setShowConfirmEditar] = useState(false);
	const [editedIngresoData, setEditedIngresoData] = useState(null);
	const [showConfirmCrear, setShowConfirmCrear] = useState(false);

	// Estados para notificaciones
	const [showModalConfirmNotificacion, setShowModalConfirmNotificacion] =
		useState(false);
	const [showModalExitoNotificacion, setShowModalExitoNotificacion] =
		useState(false);
	const [ingresoNotificar, setIngresoNotificar] = useState(null);

	const navigate = useNavigate();

	const getCategoryName = (catId) => {
		const cat = categories.find((c) => c._id.toString() === catId.toString());
		return cat ? cat.nombre : catId;
	};

	const fetchIngresos = useCallback(async () => {
		const token = localStorage.getItem("token");

		try {
			const res = await axios.get(`${import.meta.env.VITE_API_URL}/ingresos`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setIngresos(res.data);
		} catch (error) {
			console.error("Error al obtener los ingresos:", error.message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		const fetchCategories = async () => {
			const token = localStorage.getItem("token");

			try {
				const res = await axios.get(
					`${import.meta.env.VITE_API_URL}/servicios/categorias`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setCategories(res.data);
			} catch (error) {
				console.error("Error al obetener las categorias:", error.message);
			}
		};

		const fetchClientes = async () => {
			try {
				const token = localStorage.getItem("token");
				const res = await axios.get(
					`${import.meta.env.VITE_API_URL}/usuarios`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setClientes(res.data);
			} catch (error) {
				console.error(`Error al obtener los clientes: ${error.message}`);
			}
		};

		fetchIngresos();
		fetchCategories();
		fetchClientes();
	}, [fetchIngresos]);

	// Filtro global
	let ingresosFiltrados = ingresos;
	if (filterEstadoPago !== "" && filterEstadoPago !== "Todos") {
		ingresosFiltrados = ingresosFiltrados.filter(
			(ingreso) => ingreso.estado === filterEstadoPago
		);
	}
	if (filterEstado !== "" && filterEstado !== "Todos") {
		ingresosFiltrados =
			filterEstado === "Activo"
				? ingresosFiltrados.filter((ingreso) => ingreso.activo)
				: ingresosFiltrados.filter((ingreso) => !ingreso.activo);
	}
	if (filterCliente !== "") {
		ingresosFiltrados = ingresosFiltrados.filter(
			(ingreso) =>
				ingreso.nombre_cliente.toLowerCase() === filterCliente.toLowerCase()
		);
	}
	if (filterFecha !== "") {
		ingresosFiltrados = ingresosFiltrados.filter((ingreso) => {
			return formatLocalDate(ingreso.fecha) === filterFecha;
		});
	}

	const ingresosOrdenados = [...ingresosFiltrados].sort((a, b) => {
		const valA = lodash.get(a, sortField) ?? "";
		const valB = lodash.get(b, sortField) ?? "";

		if (sortField.toLowerCase().includes("fecha")) {
			const dateA = new Date(valA);
			const dateB = new Date(valB);
			return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
		}

		if (!isNaN(valA) && !isNaN(valB)) {
			return sortOrder === "asc" ? valA - valB : valB - valA;
		}

		return sortOrder === "asc"
			? valA.toString().localeCompare(valB.toString())
			: valB.toString().localeCompare(valA.toString());
	});

	const totalPaginas = Math.ceil(ingresosOrdenados.length / itemsPag);
	const ingresosPaginados = ingresosOrdenados.slice(
		(pagActual - 1) * itemsPag,
		pagActual * itemsPag
	);

	const cambiarPagina = (num) => {
		if (num >= 1 && num <= totalPaginas) setPagActual(num);
	};

	// Confirmación para activar/desactivar
	const handleToggleClick = (ingreso) => {
		setToggleIngreso(ingreso);
		setShowConfirmToggle(true);
	};

	const handleConfirmToggle = async () => {
		if (toggleIngreso) {
			const token = localStorage.getItem("token");

			try {
				const url = toggleIngreso.activo
					? `${import.meta.env.VITE_API_URL}/ingresos/${toggleIngreso._id}/desactivar`
					: `${import.meta.env.VITE_API_URL}/ingresos/${toggleIngreso._id}/activar`;
				await axios.put(
					url,
					{},
					{ headers: { Authorization: `Bearer ${token}` } }
				);
				setIngresos((prev) =>
					prev.map((i) =>
						i._id === toggleIngreso._id ? { ...i, activo: !i.activo } : i
					)
				);
				setShowConfirmToggle(false);
				setToggleIngreso(null);
			} catch (error) {
				console.error("Error alternar el estado de ingreso.", error.message);
			}
		}
	};

	// Al editar
	const onSaveEdit = (data) => {
		setEditedIngresoData(data);
		setShowModalEditar(false);
		setShowConfirmEditar(true);
	};

	const handleConfirmEdit = async () => {
		const token = localStorage.getItem("token");

		try {
			await axios.put(
				`${import.meta.env.VITE_API_URL}/ingresos/${editedIngresoData._id}`,
				editedIngresoData,
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setShowConfirmEditar(false);
			setEditedIngresoData(null);
			fetchIngresos();
		} catch (error) {
			console.error("Error al actualizar ingreso:", error.message);
		}
	};

	// Al crear
	const onSaveCrear = () => {
		setShowModalCrear(false);
		setShowConfirmCrear(true);
	};

	const handleConfirmCrear = () => {
		setShowConfirmCrear(false);
		fetchIngresos();
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

	// Confirmar la notificación
	const handleConfirmNotificacion = async () => {
		setShowModalConfirmNotificacion(false);

		try {
			const cliente = clientes.find(
				(c) =>
					c.nombre === ingresoNotificar.nombre_cliente &&
					c.tipo_usuario === "Cliente"
			);

			if (!cliente) {
				throw new Error("Cliente no encontrado");
			}

			if (!cliente.email) {
				throw new Error("El cliente no tiene email registrado");
			}

			const emailContent = `
            <html>
                <body>
                    Estimado ${ingresoNotificar.nombre_cliente},<br>
                    Le recordamos que tiene un pago pendiente de ₡${ingresoNotificar.monto} 
                    con fecha de vencimiento ${new Date(ingresoNotificar.fecha).toLocaleDateString()}.<br>
                    Por favor, realice el pago a la brevedad.
                </body>
            </html>
        `;

			const subject = "Notificación de Pago Pendiente";

			await axios.post(`${import.meta.env.VITE_API_URL}/email/externo`, {
				recipientEmail: cliente.email,
				subject,
				emailContent,
			});

			setShowModalExitoNotificacion(true);
		} catch (error) {
			console.error("Error al enviar notificación: ", error);
			alert(`Error al enviar la notificación: ${error.message}`);
		}
	};

	const ModalConfirmarNotificacion = ({
		show,
		onClose,
		onConfirm,
		ingreso,
	}) => (
		<Modal show={show} onHide={onClose}>
			<Modal.Header closeButton>
				<Modal.Title>Confirmar Notificación</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<p>
					¿Está seguro de enviar la notificación al cliente{" "}
					<strong>{ingreso.nombre_cliente}</strong> al correo{" "}
					<strong>{ingreso.email}</strong>?
				</p>
				<p>
					Se le informará que tiene un pago pendiente de{" "}
					<strong>₡{ingreso.monto}</strong> con fecha de vencimiento{" "}
					<strong>{new Date(ingreso.fecha).toLocaleDateString()}</strong>.
				</p>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={onClose}>
					Cancelar
				</Button>
				<Button variant="primary" onClick={onConfirm}>
					Notificar
				</Button>
			</Modal.Footer>
		</Modal>
	);

	const ModalExitoNotificacion = ({ show, onClose }) => (
		<Modal show={show} onHide={onClose}>
			<Modal.Header closeButton>
				<Modal.Title>Notificación Enviada</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<p>Correo de notificación enviado correctamente.</p>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="primary" onClick={onClose}>
					Aceptar
				</Button>
			</Modal.Footer>
		</Modal>
	);

	return (
		<AdminLayout>
			<div className="main-container mx-auto">
				<div className="espacio-top-responsive"></div>
				{/* Encabezado */}
				<div
					className="d-flex justify-content-between align-items-center mb-4"
					style={{ paddingRight: "80px" }}
				>
					<h1>Gestión de Ingresos</h1>
					<button className="thm-btn" onClick={() => setShowModalCrear(true)}>
						<FontAwesomeIcon icon={faPlus} className="me-2" /> Nuevo Ingreso
					</button>
				</div>

				{/* Filtros*/}
				<div className="row mb-3">
					{/* Filtro por Cliente */}
					<div className="col-md-4">
						<Form.Group controlId="filterCliente">
							<Form.Label>Cliente:</Form.Label>
							<Form.Select
								value={filterCliente}
								onChange={(e) => {
									setFilterCliente(e.target.value);
									setPagActual(1);
								}}
								className="thm-btn"
							>
								<option value="">Todos</option>
								{clientes
									.filter((c) => c.tipo_usuario === "Cliente")
									.map((cliente) => (
										<option key={cliente._id} value={cliente.nombre}>
											{cliente.nombre}
										</option>
									))}
							</Form.Select>
						</Form.Group>
						<Form.Group controlId="filterFecha">
							<Form.Label>Fecha de Vencimiento:</Form.Label>
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
					{/* Filtros por Estado de Pago y Estado del Ingreso */}
					<div className="col-md-4" style={{ paddingRight: "80px" }}>
						<Form.Group controlId="filterEstado">
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
						<Form.Group controlId="filterEstadoPago" className="mb-2">
							<Form.Label>Estado de Pago:</Form.Label>
							<Form.Select
								value={filterEstadoPago}
								onChange={(e) => {
									setFilterEstadoPago(e.target.value);
									setPagActual(1);
								}}
								className="thm-btn"
							>
								<option value="">Todos</option>
								<option value="Pendiente de pago">Pendiente de pago</option>
								<option value="Pagado">Pagado</option>
							</Form.Select>
						</Form.Group>
					</div>
				</div>

				{/* Tabla de Ingresos */}

				<div className="div-table">
					<Table className="main-table tabla-ingresos">
						<Thead>
							<Tr>
								<Th
									onClick={() => handleSort("fecha_creacion")}
									className="col-fecha"
								>
									Creación{" "}
									<span className="sort-icon">
										<FontAwesomeIcon icon={faSort} />
									</span>
								</Th>
								<Th className="col-nombre">Cliente</Th>
								<Th className="col-descripcion">Descripción</Th>
								<Th className="col-categoria">Categoría</Th>
								<Th onClick={() => handleSort("monto")} className="col-monto">
									Monto{" "}
									<span className="sort-icon">
										<FontAwesomeIcon icon={faSort} />
									</span>
								</Th>
								<Th
									onClick={() => handleSort("fecha")}
									className="col-vencimiento"
								>
									Vencimiento{" "}
									<span className="sort-icon">
										<FontAwesomeIcon icon={faSort} />
									</span>
								</Th>
								<Th className="col-estado">Estado</Th>
								<Th className="col-acciones">Acciones</Th>
							</Tr>
						</Thead>
						<Tbody>
							{ingresosPaginados.length === 0 ? (
								<Tr>
									<Td colSpan="8" className="text-center">
										No hay ingresos para mostrar.
									</Td>
								</Tr>
							) : (
								ingresosPaginados.map((ingreso) => (
									<Tr key={ingreso._id}>
										<Td className="col-fecha">
											{new Date(ingreso.fecha_creacion).toLocaleDateString()}
										</Td>
										<Td className="col-cliente">{ingreso.nombre_cliente}</Td>

										<Td className="col-descripcion">{ingreso.descripcion}</Td>
										<Td className="col-categoria">
											{getCategoryName(ingreso.categoria)}
										</Td>
										<Td className="col-monto">₡{ingreso.monto}</Td>
										<Td className="col-vencimiento">
											{new Date(ingreso.fecha).toLocaleDateString()}
										</Td>
										<Td className="col-estado">{ingreso.estado}</Td>
										<Td className="text-center col-acciones">
											<div className="botones-grupo mb-1">
												<button
													className="thm-btn thm-btn-small btn-amarillo"
													onClick={() => {
														setIngresoVer(ingreso);
														setShowModalVer(true);
													}}
													title="Ver detalle"
												>
													<FontAwesomeIcon icon={faEye} />
												</button>
												<button
													className="thm-btn thm-btn-small btn-azul"
													onClick={() => {
														setIngresoEditar(ingreso);
														setShowModalEditar(true);
													}}
													title="Modificar"
													disabled={
														!ingreso.activo || ingreso.estado === "Pagado"
													}
												>
													<FontAwesomeIcon icon={faPencil} />
												</button>
											</div>
											<div className="botones-grupo">
												<button
													className="thm-btn thm-btn-small btn-notificar"
													onClick={() => {
														if (ingreso.estado !== "Pendiente de pago") return;
														setIngresoNotificar(ingreso);
														setShowModalConfirmNotificacion(true);
													}}
													title="Notificar"
													disabled={
														!ingreso.activo ||
														ingreso.estado !== "Pendiente de pago"
													}
												>
													<FontAwesomeIcon icon={faBell} />
												</button>
												<button
													className={`thm-btn thm-btn-small ${
														ingreso.activo ? "btn-verde" : "btn-rojo"
													}`}
													onClick={() => handleToggleClick(ingreso)}
													title={ingreso.activo ? "Desactivar" : "Activar"}
												>
													<FontAwesomeIcon
														icon={ingreso.activo ? faToggleOn : faToggleOff}
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
					totalItems={ingresosOrdenados.length}
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
					{toggleIngreso && toggleIngreso.activo
						? "¿Está seguro de que desea desactivar este ingreso?"
						: "¿Está seguro de que desea activar este ingreso?"}
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
			>
				<Modal.Header closeButton>
					<Modal.Title>Ingreso Editado</Modal.Title>
				</Modal.Header>
				<Modal.Body>Ingreso actualizado exitosamente</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" onClick={handleConfirmEdit}>
						Aceptar
					</Button>
				</Modal.Footer>
			</Modal>

			{/* Modal de confirmación para creación */}
			<Modal show={showConfirmCrear} onHide={() => setShowConfirmCrear(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Ingreso Creado</Modal.Title>
				</Modal.Header>
				<Modal.Body>Ingreso creado exitosamente.</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" onClick={handleConfirmCrear}>
						Aceptar
					</Button>
				</Modal.Footer>
			</Modal>

			{/* Componentes de contenido */}
			<ModalVerIngreso
				show={showModalVer}
				handleClose={() => setShowModalVer(false)}
				ingreso={ingresoVer}
				categories={categories}
			/>
			<ModalEditarIngreso
				show={showModalEditar}
				handleClose={() => setShowModalEditar(false)}
				ingreso={ingresoEditar}
				categories={categories}
				onSave={onSaveEdit}
			/>
			<ModalCrearIngreso
				show={showModalCrear}
				handleClose={() => setShowModalCrear(false)}
				categories={categories}
				onSave={onSaveCrear}
			/>

			{/* Modales de notificación */}
			{ingresoNotificar && (
				<ModalConfirmarNotificacion
					show={showModalConfirmNotificacion}
					onClose={() => setShowModalConfirmNotificacion(false)}
					onConfirm={handleConfirmNotificacion}
					ingreso={ingresoNotificar}
				/>
			)}
			<ModalExitoNotificacion
				show={showModalExitoNotificacion}
				onClose={() => setShowModalExitoNotificacion(false)}
			/>
		</AdminLayout>
	);
};

export default ListadoIngresos;
