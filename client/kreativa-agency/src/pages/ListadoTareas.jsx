import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import axios from "axios";
import lodash from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faEye, faPencil } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import ModalVerTareas from "../components/Tareas/ModalVerTareas";
import ModalAgregarTarea from "../components/Tareas/ModalAgregarTarea";
import ModalEditarTarea from "../components/Tareas/ModalEditarTarea";
import { notification } from "antd";
import forceFileDownload from "../utils/forceFileDownload";
import TablaPaginacion from "../components/ui/TablaPaginacion";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import Loading from "../components/ui/LoadingComponent";
import TokenUtils, { updateSessionStatus } from "../utils/validateToken";


const getEstado = (status) => {
	switch (status) {
		case "Por Hacer":
			return "badge badge-azul";
		case "En Progreso":
			return "badge badge-amarillo";
		case "Finalizado":
			return "badge badge-verde";
		case "En Revisión":
			return "badge badge-naranja";
		case "Cancelado":
			return "badge badge-rojo";
		default:
			return "badge badge-gris";
	}
};

const getPrioridad = (priority) => {
	switch (priority) {
		case "Alta":
			return "badge badge-rojo";
		case "Media":
			return "badge badge-amarillo";
		case "Baja":
			return "badge badge-azul";
		default:
			return "badge badge-gris";
	}
};

const ListadoTareas = () => {
	const navigate = useNavigate();
	const [tareas, setTareas] = useState([]);
	const [empleados, setEmpleados] = useState([]);
	const [itemsPag, setItemsPag] = useState(5);
	const [pagActual, setPagActual] = useState(1);
	const [sortField, setsortField] = useState("fecha_creacion");
	const [sortOrder, setsortOrder] = useState("desc");
	const [filterColab, setFilterColab] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [tareaModal, setTareaModal] = useState({});
	const [filterStatus, setFilterStatus] = useState("");
	const [api, contextHolder] = notification.useNotification();

	const [showEditTareaModal, setShowEditTareaModal] = useState(false);
	const [editingTareaId, setEditingTareaId] = useState(null);

	const [showModalAgregarTarea, setShowModalAgregarTarea] = useState(false);
	const [selectedProyectoTarea, setSelectedProyectoTarea] = useState(null);

	const [loading, setLoading] = useState(true);

	const openSuccessNotification = (message) => {
		api.success({
			message: "Éxito",
			description: message,
			placement: "top",
			duration: 4,
		});
	};

	const openErrorNotification = (message) => {
		api.error({
			message: "Error",
			description: message,
			placement: "top",
			duration: 4,
		});
	};

	const rol = localStorage.getItem("tipo_usuario");

	const fetchTareas = async () => {
		try {
			let url = `${import.meta.env.VITE_API_URL}`;
			const idUsuario = localStorage.getItem("user_id");
			url += "/tareas";
			url += rol === "Colaborador" ? `/getByColab/${idUsuario}` : "";
			const token = localStorage.getItem("token");

			if (!token) {
				navigate("/error", {
					state: {
						errorCode: 401,
						mensaje: "Debe iniciar sesión para continuar.",
					},
				});
			}

			const response = await axios.get(url, {
				headers: { Authorization: `Bearer ${token}` },
			});

			setTareas(response.data.tareas);
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
		} finally {
			setLoading(false);
		}
	};

	const fetchColabs = async () => {
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				navigate("/error", {
					state: {
						errorCode: 401,
						mensaje: "Debe iniciar sesión para continuar.",
					},
				});
			}
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/usuarios/empleados`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			setEmpleados(response.data);
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
			console.error(`Error al obtener los empleados`);
		}
	};

	useEffect(() => {
		fetchTareas();
		fetchColabs();
	}, [rol]);

	const reloadData = () => {
		fetchTareas();
	};

	// const handleEditar = (id) => {
	// 	navigate(`/tarea/editar/${id}`);
	// };

	const handleEditarTarea = (tareaId) => {
		setEditingTareaId(tareaId);
		setShowEditTareaModal(true);
	};

	const handleCloseEditTareaModal = () => {
		setShowEditTareaModal(false);
		reloadData();
	};

	const handleAgregarTarea = (proyectoId) => {
		setSelectedProyectoTarea(null);
		setShowModalAgregarTarea(true);
	};

	const handleCloseAgregarTareaModal = () => {
		setShowModalAgregarTarea(false);
		setSelectedProyectoTarea(null);
	};

	const renderOptionsColabs = () => {
		return empleados.map((empleado) => (
			<option key={empleado._id} value={empleado._id}>
				{empleado.nombre}
			</option>
		));
	};

	const handleImprimirReporte = async () => {
		const tareasFormateados = tareasFiltradas.map((tarea) => {
			return {
				nombre: tarea.nombre,
				descripcion: tarea.descripcion,
				proyecto: tarea.proyecto_id.nombre,
				estado: tarea.estado,
				prioridad: tarea.prioridad,
				fecha_vencimiento: new Date(
					tarea.fecha_vencimiento
				).toLocaleDateString(),
			};
		});

		const cols = [
			"Nombre",
			"Descripción",
			"Proyecto",
			"Estado",
			"Prioridad",
			"Fecha de Entrega",
		];

		try {
			if (lodash.isEmpty(tareasFormateados)) {
				openErrorNotification(`No hay datos de tareas para imprimir.`);
				return;
			}

			const response = await axios.post(
				`${import.meta.env.VITE_MICROSERVICES_URL}/printExcel/singlePage`,
				{
					cols: cols,
					data: tareasFormateados,
					fileName: "reporte_tareas",
					sheetName: "tareas",
				},
				{
					responseType: "blob",
				}
			);

			if (response.status === 200) {
				const blob = new Blob([response.data], {
					type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
				});

				forceFileDownload(blob, "reporte_tareas");

				openSuccessNotification(`Reporte de tareas generado correctamente.`);
				return;
			}
		} catch (error) {
			console.error(error.message);
			openErrorNotification(`Error al generar el  reporte de tareas.`);
		}
	};

	let tareasFiltradas =
		filterColab !== ""
			? tareas.filter(
					(tarea) =>
						(lodash.get(tarea, "colaborador_id._id") ?? "").localeCompare(
							filterColab
						) === 0
				)
			: tareas;

	tareasFiltradas =
		filterStatus !== ""
			? tareasFiltradas.filter(
					(tarea) =>
						(lodash.get(tarea, "estado") ?? "").localeCompare(filterStatus) ===
						0
				)
			: tareasFiltradas;

	const tareasOrdenadas =
		sortOrder === "asc"
			? tareasFiltradas.sort((a, b) =>
					(lodash.get(a, sortField) || "").localeCompare(
						lodash.get(b, sortField) || ""
					)
				)
			: tareasFiltradas.sort((a, b) =>
					(lodash.get(b, sortField) || "").localeCompare(
						lodash.get(a, sortField) || ""
					)
				);

	const tareasPags =
		itemsPag !== tareasOrdenadas.length
			? tareasOrdenadas.slice((pagActual - 1) * itemsPag, pagActual * itemsPag)
			: tareasOrdenadas;

	const totalPags = Math.ceil(tareasFiltradas.length / itemsPag);

	if (!tareas) {
		return (
			<div className="container d-flex align-items-center justify-content-center">
				<p>Cargando tareas...</p>
			</div>
		);
	}

	const handleSort = (field) => {
		if (sortField === field) {
			setsortOrder(sortOrder === "asc" ? "desc" : "asc");
		} else {
			setsortField(field);
			setsortOrder("asc");
		}
	};

	const getIniciales = (colab) => {
		if (!colab || !colab.nombre) return "?";
		const nombres = colab.nombre.trim().split(" ");
		return nombres[0].charAt(0) + (nombres[1] ? nombres[1].charAt(0) : "");
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
			{contextHolder}
			<div className="main-container mx-auto">
				<div className="espacio-top-responsive"></div>

				<h1 className="mb-4">
					{rol === "Administrador" ? "Listado de Tareas" : "Mis Tareas"}
				</h1>

				<div className="row mb-3">
					{rol === "Administrador" ? (
						<div className="col">
							<label htmlFor="filterColab">Filtrar por Colaborador:</label>
							<select
								className="form-select form_input"
								value={filterColab}
								onChange={(e) => {
									setFilterColab(e.target.value);
									setPagActual(1);
								}}
								id="filterColab"
							>
								<option value="">Todos</option>
								{renderOptionsColabs()}
							</select>
						</div>
					) : (
						""
					)}
					<div className="col">
						<label htmlFor="filterStatus">Filtrar por Prioridad:</label>
						<select
							className="form-select form_input"
							onChange={(e) => {
								setFilterStatus(e.target.value);
								setPagActual(1);
							}}
							id="filterStatus"
						>
							<option value="">Todos</option>
							<option value={"Por Hacer"}>Por Hacer</option>
							<option value={"En Progreso"}>En Progreso</option>
							<option value={"Cancelado"}>Cancelado</option>
							<option value={"Finalizado"}>Finalizado</option>
							<option value={"En Revisión"}>En Revisión</option>
						</select>
					</div>

					<div className="col text-end">
						{rol === "Administrador" ? (
							<button
								className="thm-btn  m-1"
								onClick={() => handleAgregarTarea()}
							>
								+ Agregar tarea
							</button>
						) : (
							""
						)}

						<button
							className="btn thm-btn  m-1"
							onClick={() => {
								handleImprimirReporte();
							}}
						>
							Imprimir Reporte
						</button>
					</div>
				</div>

				<div className="div-table">
					<Table className="main-table">
						<Thead>
							<Tr>
								<Th className="col-nombre" onClick={() => handleSort("nombre")}>
									Nombre{" "}
									<span className="sort-icon">
										<FontAwesomeIcon icon={faSort} />
									</span>
								</Th>
								<Th
									className="col-proyecto"
									onClick={() => handleSort("proyecto_id.nombre")}
								>
									Proyecto{" "}
									<span className="sort-icon">
										<FontAwesomeIcon icon={faSort} />
									</span>
								</Th>
								{rol === "Administrador" && (
									<Th
										className="col-colaborador"
										onClick={() => handleSort("colaborador_id.nombre")}
									>
										Colaborador{" "}
										<span className="sort-icon">
											<FontAwesomeIcon icon={faSort} />
										</span>
									</Th>
								)}
								<Th className="col-estado" onClick={() => handleSort("estado")}>
									Estado{" "}
									<span className="sort-icon">
										<FontAwesomeIcon icon={faSort} />
									</span>
								</Th>
								<Th
									className="col-prioridad"
									onClick={() => handleSort("prioridad")}
								>
									Prioridad{" "}
									<span className="sort-icon">
										<FontAwesomeIcon icon={faSort} />
									</span>
								</Th>
								<Th
									className="col-fecha"
									onClick={() => handleSort("fecha_vencimiento")}
								>
									Entrega{" "}
									<span className="sort-icon">
										<FontAwesomeIcon icon={faSort} />
									</span>
								</Th>
								<Th className="col-acciones">Acciones</Th>
							</Tr>
						</Thead>
						<Tbody>
							{tareasOrdenadas.length > 0 ? (
								tareasPags.map((tarea) => (
									<Tr key={tarea._id}>
										<Td className="col-nombre">{tarea.nombre}</Td>
										<Td className="col-proyecto">
											{lodash.get(tarea, "proyecto_id.nombre", "Sin proyecto")}
										</Td>
										{rol === "Administrador" && (
											<Td className="col-colaborador">
												<span
													className="badge badge-gris d-desktop"
													title={tarea.colaborador_id?.nombre ?? "Sin asignar"}
												>
													{getIniciales(tarea.colaborador_id)}
												</span>

												<span className="d-mobile">
													{tarea.colaborador_id?.nombre ?? "Sin asignar"}
												</span>
											</Td>
										)}
										<Td className="col-estado">
											<div className={getEstado(tarea.estado)}>
												{tarea.estado}
											</div>
										</Td>
										<Td className="col-prioridad">
											<div className={getPrioridad(tarea.prioridad)}>
												{tarea.prioridad}
											</div>
										</Td>
										<Td className="col-fecha">
											{new Date(tarea.fecha_vencimiento).toLocaleDateString()}
										</Td>
										<Td className="text-center col-acciones">
											<div className="botones-grupo">
												<button
													className="thm-btn thm-btn-small btn-amarillo"
													onClick={() => {
														setTareaModal(tarea);
														setShowModal(true);
													}}
												>
													<FontAwesomeIcon icon={faEye} />
												</button>
												{rol === "Administrador" && (
													<button
														className="thm-btn thm-btn-small btn-azul"
														onClick={() => handleEditarTarea(tarea._id)}
													>
														<FontAwesomeIcon icon={faPencil} />
													</button>
												)}
											</div>
										</Td>
									</Tr>
								))
							) : (
								<Tr>
									<Td colSpan={rol === "Administrador" ? 7 : 6}>
										No hay tareas por mostrar.
									</Td>
								</Tr>
							)}
						</Tbody>
					</Table>
				</div>

				<TablaPaginacion
					totalItems={tareasFiltradas.length}
					itemsPorPagina={itemsPag}
					paginaActual={pagActual}
					onItemsPorPaginaChange={(cant) => {
						setItemsPag(cant);
						setPagActual(1);
					}}
					onPaginaChange={(pagina) => setPagActual(pagina)}
				/>
			</div>

			{showModal && (
				<ModalVerTareas
					show={showModal}
					handleClose={() => setShowModal(false)}
					tareaModal={tareaModal}
					onUpdated={reloadData}
				/>
			)}

			<ModalEditarTarea
				show={showEditTareaModal}
				handleClose={handleCloseEditTareaModal}
				tareaId={editingTareaId}
				onUpdate={reloadData}
			/>

			<ModalAgregarTarea
				show={showModalAgregarTarea}
				handleClose={handleCloseAgregarTareaModal}
				proyectoId={selectedProyectoTarea}
				onUpdate={reloadData}
			/>
		</AdminLayout>
	);
};

export default ListadoTareas;
