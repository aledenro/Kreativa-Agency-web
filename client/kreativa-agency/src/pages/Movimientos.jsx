import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import "../AdminPanel.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faSort } from "@fortawesome/free-solid-svg-icons";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

// Importamos los modales para ver Ingreso y Egreso
import ModalVerIngreso from "../components/Ingresos/ModalVerIngreso";
import ModalVerEgreso from "../components/Egresos/ModalVerEgreso";
import TablaPaginacion from "../components/ui/TablaPaginacion";
import Loading from "../components/ui/LoadingComponent";
import { useNavigate } from "react-router-dom";

const Movimientos = () => {
	// Estados para filtros
	const [filterType, setFilterType] = useState("fecha");
	const [fecha, setFecha] = useState("");
	const [anio, setAnio] = useState(new Date().getFullYear());
	const [fechaInicio, setFechaInicio] = useState("");
	const [fechaFin, setFechaFin] = useState("");

	// Estado para los movimientos obtenidos
	const [movimientos, setMovimientos] = useState([]);

	// Estado para las categorías (para mapear el ID en movimientos de ingreso)
	const [categories, setCategories] = useState([]);

	// Estados para controlar los modales y el registro seleccionado
	const [registroSeleccionado, setRegistroSeleccionado] = useState(null);
	const [showModalVerIngreso, setShowModalVerIngreso] = useState(false);
	const [showModalVerEgreso, setShowModalVerEgreso] = useState(false);

	// Estados para paginación (idénticos a ListadoIngresos)
	const [pagActual, setPagActual] = useState(1);
	const [itemsPag, setItemsPag] = useState(5);
	const [sortOrder, setSortOrder] = useState("desc");

	const navigate = useNavigate();

	const [loading, setLoading] = useState(true);

	// Helper: Calcula la fecha formateada
	const formatLocalDate = (date) => {
		const d = new Date(date);
		const year = d.getFullYear();
		const month = (d.getMonth() + 1).toString().padStart(2, "0");
		const day = d.getDate().toString().padStart(2, "0");
		return `${year}-${month}-${day}`;
	};

	// Función para obtener movimientos según el filtro seleccionado
	const fetchMovimientos = () => {
		let url = `${import.meta.env.VITE_API_URL}/movimientos?`;
		if (filterType === "fecha") {
			if (fecha) {
				url += `fecha=${fecha}`;
			}
		} else if (filterType === "anio") {
			url += `anio=${anio}`;
		} else if (filterType === "rango") {
			if (fechaInicio && fechaFin) {
				url += `fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
			}
		}

		const token = localStorage.getItem("token");
		setLoading(true);

		if (!token) {
			navigate("/error", {
				state: {
					errorCode: 401,
					mensaje: "Acceso no autorizado.",
				},
			});
			return;
		}

		axios
			.get(url, {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((response) => {
				setMovimientos(response.data);
				setPagActual(1); // Reinicia a la primera página al buscar
			})
			.catch((error) => {
				if (error.status === 401) {
					navigate("/error", {
						state: {
							errorCode: 401,
							mensaje: "Debe volver a iniciar sesión para continuar.",
						},
					});
					return;
				}
				console.error("Error al obtener movimientos:");
			})
			.finally(() => {
				setLoading(false);
			});
	};

	useEffect(() => {
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
		const promises = [];

		promises.push(
			axios
				.get(`${import.meta.env.VITE_API_URL}/movimientos`, {
					headers: { Authorization: `Bearer ${token}` },
				})
				.then((response) => {
					setMovimientos(response.data);
				})
				.catch((error) => {
					console.error("Error al obtener movimientos:", error.message);
				})
		);

		promises.push(
			axios
				.get(`${import.meta.env.VITE_API_URL}/servicios/categorias`, {
					headers: { Authorization: `Bearer ${token}` },
				})
				.then((res) => {
					setCategories(res.data);
				})
				.catch((error) => {
					if (error.status === 401) {
						navigate("/error", {
							state: {
								errorCode: 401,
								mensaje: "Debe volver a iniciar sesión para continuar.",
							},
						});
						return;
					}
				})
		);

		Promise.allSettled(promises).finally(() => {
			setLoading(false);
		});
	}, []);

	// Helper para mapear el ID de categoría al nombre
	const getCategoryName = (catId) => {
		const cat = categories.find((c) => c._id.toString() === catId.toString());
		return cat ? cat.nombre : catId;
	};

	// Función para determinar el detalle a mostrar en el modal.
	const obtenerDetalleCompleto = (mov) => {
		return (mov.detalle && mov.detalle.datosNuevos) || mov.detalle || {};
	};

	// Función para renderizar el resumen de detalles en la tabla
	const renderDetalle = (mov) => {
		const data = obtenerDetalleCompleto(mov);
		if (mov.entidad === "ingreso") {
			return (
				<div>
					<div>
						<strong>Cliente:</strong>{" "}
						{data.nombre_cliente ? data.nombre_cliente : "Sin cliente"}
					</div>
					<div>
						<strong>Descripción:</strong>{" "}
						{data.descripcion ? data.descripcion : "Sin descripción"}
					</div>
					<div>
						<strong>Última Modificación:</strong>{" "}
						{data.ultima_modificacion
							? new Date(data.ultima_modificacion).toLocaleString()
							: "Sin fecha"}
					</div>
				</div>
			);
		}
		if (mov.entidad === "egreso") {
			return (
				<div>
					<div>
						<strong>Descripción:</strong>{" "}
						{data.descripcion ? data.descripcion : "Sin descripción"}
					</div>
					<div>
						<strong>Última Modificación:</strong>{" "}
						{data.ultima_modificacion
							? new Date(data.ultima_modificacion).toLocaleString()
							: "Sin fecha"}
					</div>
				</div>
			);
		}
		return <div>Sin detalle</div>;
	};

	// Función que se ejecuta al hacer clic en "Ver" en la tabla de movimientos.
	const handleVer = (mov) => {
		if (!mov.idRegistro) {
			console.error("El movimiento no tiene idRegistro");
			return;
		}
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

		if (mov.entidad === "ingreso") {
			axios
				.get(`${import.meta.env.VITE_API_URL}/ingresos/${mov.idRegistro}`, {
					headers: { Authorization: `Bearer ${token}` },
				})
				.then((response) => {
					setRegistroSeleccionado(response.data);
					setShowModalVerIngreso(true);
				})
				.catch((error) => {
					if (error.status === 401) {
						navigate("/error", {
							state: {
								errorCode: 401,
								mensaje: "Debe volver a iniciar sesión para continuar.",
							},
						});
						return;
					}
					console.error("Error al obtener el ingreso");
				});
		} else if (mov.entidad === "egreso") {
			axios
				.get(`${import.meta.env.VITE_API_URL}/egresos/${mov.idRegistro}`, {
					headers: { Authorization: `Bearer ${token}` },
				})
				.then((response) => {
					setRegistroSeleccionado(response.data);
					setShowModalVerEgreso(true);
				})
				.catch((error) => {
					if (error.status === 401) {
						navigate("/error", {
							state: {
								errorCode: 401,
								mensaje: "Debe volver a iniciar sesión para continuar.",
							},
						});
						return;
					}
					console.error("Error al obtener el egreso");
				});
		}
	};

	// Ordenamos (opcional) o simplemente usamos todos los movimientos
	// Aquí simulamos que movimientosOrdenados es igual a movimientos
	const movimientosOrdenados = [...movimientos].sort((a, b) => {
		if (!a.fecha || !b.fecha) return 0;

		const dateA = new Date(a.fecha);
		const dateB = new Date(b.fecha);

		return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
	});

	// Cálculo de paginación
	const totalPaginas = Math.ceil(movimientosOrdenados.length / itemsPag);
	const movimientosPaginados = movimientosOrdenados.slice(
		(pagActual - 1) * itemsPag,
		pagActual * itemsPag
	);

	const handleSort = (field) => {
		if (field === "fecha") {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		}
	};

	// Función para limpiar filtros
	const handleLimpiar = () => {
		setFilterType("fecha");
		setFecha("");
		setAnio(new Date().getFullYear());
		setFechaInicio("");
		setFechaFin("");

		setTimeout(() => {
			const token = localStorage.getItem("token");
			setLoading(true);

			axios
				.get(`${import.meta.env.VITE_API_URL}/movimientos`, {
					headers: { Authorization: `Bearer ${token}` },
				})
				.then((response) => {
					setMovimientos(response.data);
					setPagActual(1);
				})
				.catch((error) => {
					console.error("Error al obtener movimientos:", error.message);
				})
				.finally(() => {
					setLoading(false);
				});
		}, 0);
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

				{/* Formulario de filtros */}
				<div className="mb-4">
					{/* Título alineado a la izquierda arriba */}
					<div className="mb-3">
						<h1>Historial de Movimientos</h1>
					</div>

					{/* Contenedor de filtros en dos columnas */}
					<div className="row">
						{/* Columna de los radios */}
						<div className="col-md-4">
							<Form.Group>
								<Form.Label>Filtrar por:</Form.Label>
								<div className="d-flex flex-column">
									<Form.Check
										type="radio"
										label="Fecha Exacta"
										name="filterType"
										value="fecha"
										checked={filterType === "fecha"}
										onChange={(e) => setFilterType(e.target.value)}
									/>
									<Form.Check
										type="radio"
										label="Año"
										name="filterType"
										value="anio"
										checked={filterType === "anio"}
										onChange={(e) => setFilterType(e.target.value)}
									/>
									<Form.Check
										type="radio"
										label="Rango de Fechas"
										name="filterType"
										value="rango"
										checked={filterType === "rango"}
										onChange={(e) => setFilterType(e.target.value)}
									/>
								</div>
							</Form.Group>
						</div>

						{/* Columna de los inputs dinámicos */}
						<div className="col-md-6">
							{filterType === "fecha" && (
								<Form.Group controlId="fecha">
									<Form.Label>Fecha:</Form.Label>
									<Form.Control
										type="date"
										value={fecha}
										onChange={(e) => setFecha(e.target.value)}
										className="thm-btn"
									/>
								</Form.Group>
							)}

							{filterType === "anio" && (
								<Form.Group controlId="anio">
									<Form.Label>Año:</Form.Label>
									<Form.Control
										type="number"
										value={anio}
										onChange={(e) => setAnio(e.target.value)}
										className="thm-btn"
									/>
								</Form.Group>
							)}

							{filterType === "rango" && (
								<>
									<Form.Group controlId="fechaInicio">
										<Form.Label>Fecha Inicio:</Form.Label>
										<Form.Control
											type="date"
											value={fechaInicio}
											onChange={(e) => setFechaInicio(e.target.value)}
											className="thm-btn"
										/>
									</Form.Group>
									<Form.Group controlId="fechaFin">
										<Form.Label>Fecha Fin:</Form.Label>
										<Form.Control
											type="date"
											value={fechaFin}
											onChange={(e) => setFechaFin(e.target.value)}
											className="thm-btn"
										/>
									</Form.Group>
								</>
							)}

							<div
								className="d-flex justify-content-start"
								style={{ marginTop: "10px" }}
							>
								<div
									className="d-flex justify-content-start gap-2"
									style={{ marginTop: "10px" }}
								>
									<button className="thm-btn" onClick={fetchMovimientos}>
										Buscar
									</button>
									<button className="thm-btn btn-gris" onClick={handleLimpiar}>
										Limpiar
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Tabla de Movimientos */}
				<div className="div-table">
					<Table className="main-table tabla-movimientos">
						<Thead>
							<Tr>
								<Th onClick={() => handleSort("fecha")} className="col-fecha">
									Fecha{" "}
									<span className="sort-icon">
										<FontAwesomeIcon icon={faSort} />
									</span>
								</Th>
								<Th className="col-proyecto">Entidad</Th>
								<Th className="col-proyecto">Acción</Th>
								<Th className="col-proyecto">Detalle</Th>
								<Th className="col-acciones">Acciones</Th>
							</Tr>
						</Thead>
						<Tbody>
							{movimientosPaginados.length > 0 ? (
								movimientosPaginados.map((mov, index) => (
									<Tr key={index}>
										<Td className="col-fecha">
											{new Date(mov.fecha).toLocaleDateString()}
										</Td>
										<Td className="col-proyecto">{mov.entidad}</Td>
										<Td className="col-proyecto">{mov.accion}</Td>
										<Td className="col-proyecto">{renderDetalle(mov)}</Td>
										<Td className="text-center col-acciones">
											<button
												className="thm-btn thm-btn-small btn-amarillo"
												onClick={() => handleVer(mov)}
											>
												<FontAwesomeIcon icon={faEye} />
											</button>
										</Td>
									</Tr>
								))
							) : (
								<Tr>
									<Td colSpan="5" className="text-center">
										No se encontraron movimientos.
									</Td>
								</Tr>
							)}
						</Tbody>
					</Table>
				</div>

				<TablaPaginacion
					totalItems={movimientosOrdenados.length}
					itemsPorPagina={itemsPag}
					paginaActual={pagActual}
					onItemsPorPaginaChange={(cant) => {
						setItemsPag(cant);
						setPagActual(1);
					}}
					onPaginaChange={(pagina) => setPagActual(pagina)}
				/>

				{/* Modal para ver Ingreso */}
				{showModalVerIngreso && registroSeleccionado && (
					<ModalVerIngreso
						show={showModalVerIngreso}
						handleClose={() => setShowModalVerIngreso(false)}
						ingreso={registroSeleccionado}
						categories={categories}
					/>
				)}

				{/* Modal para ver Egreso */}
				{showModalVerEgreso && registroSeleccionado && (
					<ModalVerEgreso
						show={showModalVerEgreso}
						handleClose={() => setShowModalVerEgreso(false)}
						egreso={registroSeleccionado}
						categories={categories}
					/>
				)}
			</div>
		</AdminLayout>
	);
};

export default Movimientos;
