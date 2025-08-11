import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faSort,
	faCaretRight,
	faCaretDown,
	faEye,
	faPencil,
	faPlus,
} from "@fortawesome/free-solid-svg-icons";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import ModalVerTareas from "../components/Tareas/ModalVerTareas";
import ModalVerProyecto from "../components/Proyectos/ModalDetalleProyecto";
import ModalEditarProyecto from "../components/Proyectos/ModalEditarProyecto";
import ModalEditarTarea from "../components/Tareas/ModalEditarTarea";
import ModalAgregarProyecto from "../components/Proyectos/ModalAgregarProyecto";
import ModalAgregarTarea from "../components/Tareas/ModalAgregarTarea";
import lodash from "lodash";
import { notification } from "antd";
import forceFileDownload from "../utils/forceFileDownload";
import TablaPaginacion from "../components/ui/TablaPaginacion";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import Loading from "../components/ui/LoadingComponent";
import { useNavigate } from "react-router-dom";
import TokenUtils, { updateSessionStatus } from "../utils/validateToken";


const DashboardColaborador = () => {
	const [proyectos, setProyectos] = useState([]);
	const [estadosProyecto, setEstadosProyecto] = useState([]);
	const [tareas, setTareas] = useState([]);
	const [loading, setLoading] = useState(true);
	const [expandedProjects, setExpandedProjects] = useState({});
	const [empleados, setEmpleados] = useState([]);

	const [sortField, setSortField] = useState("fecha_creacion");
	const [sortOrder, setSortOrder] = useState("desc");
	const [filterColab, setFilterColab] = useState("");
	const [filterStatus, setFilterStatus] = useState("");

	const [taskSortByProject, setTaskSortByProject] = useState({});

	const [pagActual, setPagActual] = useState(1);
	const [itemsPag, setItemsPag] = useState(5);

	const [showModalVerTarea, setShowModalVerTarea] = useState(false);
	const [tareaModal, setTareaModal] = useState({});

	const [showModalVerProyecto, setShowModalVerProyecto] = useState(false);
	const [proyectoModal, setProyectoModal] = useState(null);

	const [showModalEditarProyecto, setShowModalEditarProyecto] = useState(false);
	const [editingProyectoId, setEditingProyectoId] = useState(null);

	const [showModalEditarTarea, setShowModalEditarTarea] = useState(false);
	const [editingTareaId, setEditingTareaId] = useState(null);

	const [showModalAgregarProyecto, setShowModalAgregarProyecto] =
		useState(false);

	const [showModalAgregarTarea, setShowModalAgregarTarea] = useState(false);
	const [selectedProyectoTarea, setSelectedProyectoTarea] = useState(null);

	const rol = localStorage.getItem("tipo_usuario");
	const userId = localStorage.getItem("user_id");
	const [api, contextHolder] = notification.useNotification();
	const navigate = useNavigate();

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

	const fetchProyectos = async () => {
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
			let url = `${import.meta.env.VITE_API_URL}/proyectos`;

			if (rol === "Cliente") {
				url += `/cliente/${userId}`;
			} else if (rol === "Colaborador") {
				url += `/colaborador/${userId}`;
			}

			const response = await axios.get(url, {
				headers: { Authorization: `Bearer ${token}` },
			});

			setProyectos(response.data);

			const estados = [...new Set(response.data.map((p) => p.estado))].filter(
				Boolean
			);
			setEstadosProyecto(estados);

			const expanded = {};
			const taskSort = {};
			response.data.forEach((proyecto) => {
				expanded[proyecto._id] = false;
				taskSort[proyecto._id] = {
					field: "nombre",
					order: "asc",
				};
			});
			setExpandedProjects(expanded);
			setTaskSortByProject(taskSort);
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
			console.error(`Error al obtener los proyectos`);
		} finally {
			setLoading(false);
		}
	};

	const fetchTareas = async () => {
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
			let url = `${import.meta.env.VITE_API_URL}/tareas`;

			const response = await axios.get(url, {
				headers: { Authorization: `Bearer ${token}` },
			});

			let todasLasTareas = response.data.tareas || response.data || [];

			if (rol === "Colaborador") {
				todasLasTareas = todasLasTareas.filter(
					(tarea) => tarea.colaborador_id && tarea.colaborador_id._id === userId
				);
			}

			setTareas(todasLasTareas);
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
			console.error(`Error al obtener las tareas`);
			setTareas([]);
		}
	};

	const fetchEmpleados = async () => {
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

	const reloadData = useCallback(() => {
		setLoading(true);

		const fetchProyectos = async () => {
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

				let url = `${import.meta.env.VITE_API_URL}/proyectos`;

				if (rol === "Cliente") {
					url += `/cliente/${userId}`;
				} else if (rol === "Colaborador") {
					url += `/colaborador/${userId}`;
				}

				const response = await axios.get(url, {
					headers: { Authorization: `Bearer ${token}` },
				});

				setProyectos(response.data);

				const estados = [...new Set(response.data.map((p) => p.estado))].filter(
					Boolean
				);
				setEstadosProyecto(estados);
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
				console.error(`Error al obtener los proyectos`);
			}
		};

		const fetchTareas = async () => {
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
				let url = `${import.meta.env.VITE_API_URL}/tareas`;

				const response = await axios.get(url, {
					headers: { Authorization: `Bearer ${token}` },
				});

				setTareas(response.data.tareas || []);
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
				console.error(`Error al obtener las tareas`);
			}
		};

		Promise.all([fetchProyectos(), fetchTareas()])
			.then(() => setLoading(false))
			.catch(async (error) => {
				if (error.status === 401) {
				await updateSessionStatus();					navigate("/error", {
						state: {
							errorCode: 401,
							mensaje: "Debe volver a iniciar sesión para continuar.",
						},
					});
					return;
				}
				console.error("Error fetching data");
				setLoading(false);
			});
	}, [rol, userId]);

	useEffect(() => {
		const loadInitialData = async () => {
			setLoading(true);
			await Promise.all([reloadData(), fetchEmpleados()]);
			setLoading(false);
		};
		loadInitialData();
	}, [reloadData]);

	const toggleExpand = (proyectoId) => {
		setExpandedProjects((prev) => ({
			...prev,
			[proyectoId]: !prev[proyectoId],
		}));
	};

	const handleTaskSort = (proyectoId, field) => {
		setTaskSortByProject((prev) => {
			const currentProjectSort = prev[proyectoId] || {
				field: "nombre",
				order: "asc",
			};
			const newOrder =
				currentProjectSort.field === field && currentProjectSort.order === "asc"
					? "desc"
					: "asc";

			return {
				...prev,
				[proyectoId]: {
					field: field,
					order: newOrder,
				},
			};
		});
	};

	const getTareasForProyecto = (proyectoId) => {
		const projectTasks = tareas.filter(
			(tarea) => tarea.proyecto_id && tarea.proyecto_id._id === proyectoId
		);

		const sortConfig = taskSortByProject[proyectoId] || {
			field: "nombre",
			order: "asc",
		};

		return projectTasks.sort((a, b) => {
			let valA, valB;

			if (sortConfig.field === "fecha_vencimiento") {
				valA = a.fecha_vencimiento
					? new Date(a.fecha_vencimiento)
					: new Date(0);
				valB = b.fecha_vencimiento
					? new Date(b.fecha_vencimiento)
					: new Date(0);
				return sortConfig.order === "asc" ? valA - valB : valB - valA;
			} else if (
				sortConfig.field === "estado" ||
				sortConfig.field === "prioridad"
			) {
				valA = a[sortConfig.field] || "";
				valB = b[sortConfig.field] || "";
				return sortConfig.order === "asc"
					? valA.toString().localeCompare(valB.toString())
					: valB.toString().localeCompare(valA.toString());
			} else {
				valA = a[sortConfig.field] || "";
				valB = b[sortConfig.field] || "";
				return sortConfig.order === "asc"
					? valA.toString().localeCompare(valB.toString())
					: valB.toString().localeCompare(valA.toString());
			}
		});
	};

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

	const getUrgencyClass = (urgente) => {
		return urgente ? "badge badge-rojo" : "badge badge-gris";
	};

	const getIniciales = (colab) => {
		if (!colab || !colab.nombre) return "?";
		const nombres = colab.nombre.trim().split(" ");
		return nombres[0].charAt(0) + (nombres[1] ? nombres[1].charAt(0) : "");
	};

	const handleVerTarea = (tarea) => {
		setTareaModal(tarea);
		setShowModalVerTarea(true);
	};

	const handleCloseVerTareaModal = () => {
		setShowModalVerTarea(false);
		setTareaModal({});
	};

	const handleVerProyecto = (proyectoId) => {
		setProyectoModal(proyectoId);
		setShowModalVerProyecto(true);
	};

	const handleCloseVerProyectoModal = () => {
		setShowModalVerProyecto(false);
		setProyectoModal(null);
	};

	const handleEditarProyecto = (proyectoId) => {
		setEditingProyectoId(proyectoId);
		setShowModalEditarProyecto(true);
	};

	const handleCloseEditarProyectoModal = () => {
		setShowModalEditarProyecto(false);
		setEditingProyectoId(null);
		reloadData();
	};

	const handleEditarTarea = (tareaId) => {
		setEditingTareaId(tareaId);
		setShowModalEditarTarea(true);
	};

	const handleCloseEditarTareaModal = () => {
		setShowModalEditarTarea(false);
		setEditingTareaId(null);
	};

	const handleAgregarProyecto = () => {
		setShowModalAgregarProyecto(true);
	};

	const handleCloseAgregarProyectoModal = () => {
		setShowModalAgregarProyecto(false);
	};

	const handleAgregarTarea = (proyectoId) => {
		setSelectedProyectoTarea(proyectoId);
		setShowModalAgregarTarea(true);
	};

	const handleCloseAgregarTareaModal = () => {
		setShowModalAgregarTarea(false);
		setSelectedProyectoTarea(null);
		reloadData();
	};

	const handleImprimirReporte = async () => {
		const proyectosFormateados = proyectosFiltrados.map((proyecto) => {
			return {
				nombre: proyecto.nombre,
				descripcion: proyecto.descripcion,
				cliente: proyecto.cliente_id.nombre,
				estado: proyecto.estado,
				urgente: proyecto.urgente ? "Sí" : "No",
				fecha_entrega: new Date(proyecto.fecha_entrega).toLocaleDateString(),
			};
		});

		const cols = [
			"Nombre",
			"Descripción",
			"Cliente",
			"Estado",
			"Urgente",
			"Fecha de Entrega",
		];

		try {
			if (lodash.isEmpty(proyectosFormateados)) {
				openErrorNotification(`No hay datos de proyectos para imprimir.`);
				return;
			}

			const response = await axios.post(
				`${import.meta.env.VITE_MICROSERVICES_URL}/printExcel/singlePage`,
				{
					cols: cols,
					data: proyectosFormateados,
					fileName: "reporte_proyectos",
					sheetName: "proyectos",
				},
				{
					responseType: "blob",
				}
			);

			if (response.status === 200) {
				const blob = new Blob([response.data], {
					type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
				});

				forceFileDownload(blob, "reporte_proyectos");
				openSuccessNotification(`Reporte de proyectos generado correctamente.`);
				return;
			}
		} catch (error) {
			console.error(error.message);
			openErrorNotification(`Error al generar el reporte de proyectos.`);
		}
	};

	let proyectosFiltrados = [...proyectos];

	if (filterColab || filterStatus) {
		if (filterStatus) {
			proyectosFiltrados = proyectosFiltrados.filter(
				(proyecto) => proyecto.estado === filterStatus
			);
		}
		if (filterColab) {
			proyectosFiltrados = proyectosFiltrados.filter((proyecto) => {
				if (proyecto.colaboradores && Array.isArray(proyecto.colaboradores)) {
					const esColaboradorDirecto = proyecto.colaboradores.some(
						(colab) =>
							colab.colaborador_id &&
							(colab.colaborador_id._id === filterColab ||
								colab.colaborador_id === filterColab)
					);
					if (esColaboradorDirecto) {
						return true;
					}
				}

				const projectTasks = getTareasForProyecto(proyecto._id);
				const filteredTasks = projectTasks.filter((tarea) => {
					return (
						tarea.colaborador_id && tarea.colaborador_id._id === filterColab
					);
				});

				return filteredTasks.length > 0;
			});
		}
	}

	proyectosFiltrados.sort((a, b) => {
		let valA, valB;

		if (sortField === "fecha_entrega") {
			// fecha
			valA = new Date(a.fecha_entrega || 0);
			valB = new Date(b.fecha_entrega || 0);
			return sortOrder === "asc" ? valA - valB : valB - valA;
		} else if (sortField === "urgente") {
			// urgencia
			valA = a.urgente ? 1 : 0;
			valB = b.urgente ? 1 : 0;
			return sortOrder === "asc" ? valA - valB : valB - valA;
		} else if (sortField === "estado") {
			// estado
			valA = a.estado || "";
			valB = b.estado || "";
			return sortOrder === "asc"
				? valA.toString().localeCompare(valB.toString())
				: valB.toString().localeCompare(valA.toString());
		} else {
			valA = a[sortField] || "";
			valB = b[sortField] || "";
			return sortOrder === "asc"
				? valA.toString().localeCompare(valB.toString())
				: valB.toString().localeCompare(valA.toString());
		}
	});

	const proyectosPaginados = proyectosFiltrados.slice(
		(pagActual - 1) * itemsPag,
		pagActual * itemsPag
	);

	const canEdit = rol === "Administrador";
	const canView = true;

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
				<h1 className="mb-4">Backlog Proyectos</h1>
				<div className="row mb-3">
					{rol === "Administrador" && (
						<div className="col">
							<label htmlFor="filterColab">Filtrar por Colaborador:</label>
							<select
								id="filterColab"
								className="form-select form_input"
								onChange={(e) => {
									setFilterColab(e.target.value);
									setPagActual(1);
								}}
								value={filterColab}
							>
								<option value="">Todos</option>
								{empleados.map((empleado) => (
									<option key={empleado._id} value={empleado._id}>
										{empleado.nombre}
									</option>
								))}
							</select>
						</div>
					)}
					<div className="col">
						<label htmlFor="filterStatus">Filtrar por Estado:</label>
						<select
							id="filterStatus"
							className="form-select form_input"
							onChange={(e) => {
								setFilterStatus(e.target.value);
								setPagActual(1);
							}}
							value={filterStatus}
						>
							<option value="">Todos</option>
							{estadosProyecto.map((estado) => (
								<option key={estado} value={estado}>
									{estado}
								</option>
							))}
						</select>
					</div>
					<div className="col text-end">
						{canEdit && (
							<button
								className="thm-btn m-1"
								onClick={handleAgregarProyecto}
								title="Crear proyecto"
							>
								+ Crear Proyecto
							</button>
						)}

						<button
							className="thm-btn m-1"
							onClick={handleImprimirReporte}
							title="Descargar reporte"
						>
							Descargar Reporte
						</button>
					</div>
				</div>

				<div className="div-table">
					{rol === "Cliente" ? (
						<Table className="main-table tabla-backlog">
							<Thead>
								<Tr>
									<Th
										className="col-nombre"
										onClick={() => {
											setSortOrder(
												sortField === "nombre" && sortOrder === "asc"
													? "desc"
													: "asc"
											);
											setSortField("nombre");
										}}
									>
										Proyecto{" "}
										<span className="sort-icon">
											<FontAwesomeIcon icon={faSort} />
										</span>
									</Th>
									<Th className="col-cliente">Cliente</Th>
									<Th
										className="col-estado"
										onClick={() => {
											setSortOrder(
												sortField === "estado" && sortOrder === "asc"
													? "desc"
													: "asc"
											);
											setSortField("estado");
										}}
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
								{proyectosPaginados.length > 0 ? (
									proyectosPaginados.map((proyecto) => (
										<Tr key={proyecto._id}>
											<Td className="col-nombre">{proyecto.nombre}</Td>
											<Td className="col-cliente">
												{proyecto.cliente_id?.nombre || "-"}
											</Td>
											<Td className="col-estado">
												<div className={`${getEstado(proyecto.estado)}`}>
													{proyecto.estado}
												</div>
											</Td>
											<Td className="col-acciones">
												<div className="botones-grupo">
													{canView && (
														<button
															className="thm-btn thm-btn-small btn-amarillo"
															onClick={() => handleVerProyecto(proyecto._id)}
															title="Ver detalle"
														>
															<FontAwesomeIcon icon={faEye} />
														</button>
													)}
												</div>
											</Td>
										</Tr>
									))
								) : (
									<Tr>
										<Td colSpan="4" className="text-center">
											No hay proyectos disponibles.
										</Td>
									</Tr>
								)}
							</Tbody>
						</Table>
					) : (
						<Table className="main-table tabla-backlog">
							<Thead>
								<Tr>
									<Th
										className="col-nombre"
										onClick={() => {
											setSortOrder(
												sortField === "nombre" && sortOrder === "asc"
													? "desc"
													: "asc"
											);
											setSortField("nombre");
										}}
									>
										Proyecto{" "}
										<span className="sort-icon">
											<FontAwesomeIcon icon={faSort} />
										</span>
									</Th>
									<Th className="col-cliente">Cliente</Th>
									<Th
										className="col-estado"
										onClick={() => {
											setSortOrder(
												sortField === "estado" && sortOrder === "asc"
													? "desc"
													: "asc"
											);
											setSortField("estado");
										}}
									>
										Estado{" "}
										<span className="sort-icon">
											<FontAwesomeIcon icon={faSort} />
										</span>
									</Th>
									<Th
										className="col-prioridad"
										onClick={() => {
											setSortOrder(
												sortField === "urgente" && sortOrder === "asc"
													? "desc"
													: "asc"
											);
											setSortField("urgente");
										}}
									>
										Urgente{" "}
										<span className="sort-icon">
											<FontAwesomeIcon icon={faSort} />
										</span>
									</Th>
									<Th
										className="col-fecha"
										onClick={() => {
											setSortOrder(
												sortField === "fecha_entrega" && sortOrder === "asc"
													? "desc"
													: "asc"
											);
											setSortField("fecha_entrega");
										}}
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
								{proyectosPaginados.length > 0 ? (
									proyectosPaginados.map((proyecto) => {
										const projectTasks = getTareasForProyecto(proyecto._id);

										const filteredTasks = projectTasks.filter((tarea) => {
											if (
												filterColab &&
												(!tarea.colaborador_id ||
													tarea.colaborador_id._id !== filterColab)
											) {
												return false;
											}
											if (filterStatus && tarea.estado !== filterStatus) {
												return false;
											}
											return true;
										});

										return (
											<React.Fragment key={proyecto._id}>
												<Tr>
													<Td className="col-nombre">
														<div className="d-flex align-items-center justify-switch w-100">
															<button
																className="btn btn-sm d-desktop"
																onClick={() => toggleExpand(proyecto._id)}
																title="Expandir tareas"
															>
																<FontAwesomeIcon
																	icon={
																		expandedProjects[proyecto._id]
																			? faCaretDown
																			: faCaretRight
																	}
																/>
															</button>
															<span>{proyecto.nombre}</span>{" "}
															<button
																className="thm-btn thm-btn-small btn-gris d-mobile"
																onClick={() => toggleExpand(proyecto._id)}
																title={
																	expandedProjects[proyecto._id]
																		? "Ocultar tareas"
																		: "Mostrar tareas"
																}
															>
																{expandedProjects[proyecto._id]
																	? "Ocultar"
																	: "Mostrar"}
															</button>
														</div>
													</Td>
													<Td className="col-cliente">
														{proyecto.cliente_id?.nombre || "-"}
													</Td>
													<Td className="col-estado">
														<div className={`${getEstado(proyecto.estado)}`}>
															{proyecto.estado}
														</div>
													</Td>
													<Td className="col-prioridad">
														<div
															className={`${getUrgencyClass(proyecto.urgente)}`}
														>
															{proyecto.urgente ? "Sí" : "No"}
														</div>
													</Td>
													<Td className="col-fecha">
														{proyecto.fecha_entrega
															? new Date(
																	proyecto.fecha_entrega
																).toLocaleDateString()
															: "-"}
													</Td>
													<Td className="col-acciones">
														<div className="botones-grupo">
															{canView && (
																<button
																	className="thm-btn thm-btn-small btn-amarillo"
																	onClick={() =>
																		handleVerProyecto(proyecto._id)
																	}
																	title="Ver detalles"
																>
																	<FontAwesomeIcon icon={faEye} />
																</button>
															)}
															{canEdit && (
																<button
																	className="thm-btn thm-btn-small btn-azul"
																	onClick={() =>
																		handleEditarProyecto(proyecto._id)
																	}
																	title="Editar proyecto"
																>
																	<FontAwesomeIcon icon={faPencil} />
																</button>
															)}
														</div>
													</Td>
												</Tr>

												{expandedProjects[proyecto._id] && (
													<Tr>
														<Td colSpan="6" className="p-0">
															<div className="ms-5">
																{/* Tabla para escritorio */}
																<div className="table-desktop">
																	<Table className="main-table subtabla-backlog">
																		<Thead>
																			<Tr>
																				<Th
																					onClick={() =>
																						handleTaskSort(
																							proyecto._id,
																							"nombre"
																						)
																					}
																					className="col-nombre"
																				>
																					Tarea{" "}
																					<span className="sort-icon">
																						<FontAwesomeIcon icon={faSort} />
																					</span>
																				</Th>
																				<Th className="col-colaborador">
																					Resp.
																				</Th>
																				<Th
																					className="col-estado"
																					onClick={() =>
																						handleTaskSort(
																							proyecto._id,
																							"estado"
																						)
																					}
																				>
																					Estado{" "}
																					<span className="sort-icon">
																						<FontAwesomeIcon icon={faSort} />
																					</span>
																				</Th>
																				<Th
																					className="col-prioridad"
																					onClick={() =>
																						handleTaskSort(
																							proyecto._id,
																							"prioridad"
																						)
																					}
																				>
																					Prioridad{" "}
																					<span className="sort-icon">
																						<FontAwesomeIcon icon={faSort} />
																					</span>
																				</Th>
																				<Th
																					className="col-vencimiento"
																					onClick={() =>
																						handleTaskSort(
																							proyecto._id,
																							"fecha_vencimiento"
																						)
																					}
																				>
																					Fecha{" "}
																					<span className="sort-icon">
																						<FontAwesomeIcon icon={faSort} />
																					</span>
																				</Th>
																				<Th className="col-acciones">
																					Acciones
																				</Th>
																			</Tr>
																		</Thead>
																		<Tbody>
																			{filteredTasks.length > 0 ? (
																				filteredTasks.map((tarea) => (
																					<Tr key={tarea._id}>
																						<Td className="col-nombre">
																							{tarea.nombre}
																						</Td>
																						<Td className="col-colaborador">
																							<span
																								className="badge badge-gris d-desktop"
																								title={
																									tarea.colaborador_id
																										?.nombre || "Sin asignar"
																								}
																							>
																								{getIniciales(
																									tarea.colaborador_id
																								)}
																							</span>
																						</Td>
																						<Td className="col-estado">
																							<div
																								className={getEstado(
																									tarea.estado
																								)}
																							>
																								{tarea.estado}
																							</div>
																						</Td>
																						<Td className="col-prioridad">
																							<div
																								className={getPrioridad(
																									tarea.prioridad
																								)}
																							>
																								{tarea.prioridad}
																							</div>
																						</Td>
																						<Td className="col-vencimiento">
																							{tarea.fecha_vencimiento
																								? new Date(
																										tarea.fecha_vencimiento
																									).toLocaleDateString()
																								: "-"}
																						</Td>
																						<Td className="col-acciones">
																							<div className="botones-grupo">
																								{canView && (
																									<button
																										className="thm-btn thm-btn-small btn-amarillo"
																										onClick={() =>
																											handleVerTarea(tarea)
																										}
																										title="Ver detalles"
																									>
																										<FontAwesomeIcon
																											icon={faEye}
																										/>
																									</button>
																								)}
																								{canEdit && (
																									<button
																										className="thm-btn thm-btn-small btn-azul"
																										onClick={() =>
																											handleEditarTarea(
																												tarea._id
																											)
																										}
																										title="Editar tarea"
																									>
																										<FontAwesomeIcon
																											icon={faPencil}
																										/>
																									</button>
																								)}
																							</div>
																						</Td>
																					</Tr>
																				))
																			) : (
																				<Tr>
																					<Td colSpan="6">
																						No hay tareas para este proyecto.
																					</Td>
																				</Tr>
																			)}
																			{canEdit && (
																				<Tr>
																					<Td colSpan="6">
																						<button
																							className="thm-btn btn-gris"
																							onClick={() =>
																								handleAgregarTarea(proyecto._id)
																							}
																							title="Agregar tarea"
																						>
																							+ Agregar tarea
																						</button>
																					</Td>
																				</Tr>
																			)}
																		</Tbody>
																	</Table>
																</div>

																{/* Acordeón móvil */}
																<div
																	className={`tareas-acordeon ${proyecto ? "acordeon-proyecto" : "acordeon-global"}`}
																>
																	{filteredTasks.length > 0 ? (
																		filteredTasks.map((tarea) => (
																			<div
																				className="acordeon-tarea-card"
																				key={tarea._id}
																			>
																				<div
																					className="acordeon-tarea-header"
																					onClick={() =>
																						setExpandedProjects((prev) => ({
																							...prev,
																							[`${proyecto._id}_${tarea._id}`]:
																								!prev[
																									`${proyecto._id}_${tarea._id}`
																								],
																						}))
																					}
																				>
																					{tarea.nombre}
																					<FontAwesomeIcon
																						icon={
																							expandedProjects[
																								`${proyecto._id}_${tarea._id}`
																							]
																								? faCaretDown
																								: faCaretRight
																						}
																					/>
																				</div>
																				{expandedProjects[
																					`${proyecto._id}_${tarea._id}`
																				] && (
																					<div className="acordeon-tarea-body">
																						<p>
																							<strong>Responsable:</strong>{" "}
																							{tarea.colaborador_id?.nombre ||
																								"Sin asignar"}
																						</p>
																						<p>
																							<strong>Estado:</strong>{" "}
																							<span
																								className={getEstado(
																									tarea.estado
																								)}
																							>
																								{tarea.estado}
																							</span>
																						</p>
																						<p>
																							<strong>Prioridad:</strong>{" "}
																							<span
																								className={getPrioridad(
																									tarea.prioridad
																								)}
																							>
																								{tarea.prioridad}
																							</span>
																						</p>
																						<p>
																							<strong>Fecha:</strong>{" "}
																							{tarea.fecha_vencimiento
																								? new Date(
																										tarea.fecha_vencimiento
																									).toLocaleDateString()
																								: "-"}
																						</p>
																						<p>
																							<strong>Acciones:</strong>
																							<span className="botones-grupo ms-2">
																								{canView && (
																									<button
																										className="thm-btn thm-btn-small btn-amarillo me-1"
																										onClick={() =>
																											handleVerTarea(tarea)
																										}
																										title="Ver detalles"
																									>
																										<FontAwesomeIcon
																											icon={faEye}
																										/>
																									</button>
																								)}
																								{canEdit && (
																									<button
																										className="thm-btn thm-btn-small btn-azul"
																										onClick={() =>
																											handleEditarTarea(
																												tarea._id
																											)
																										}
																										title="Editar tarea"
																									>
																										<FontAwesomeIcon
																											icon={faPencil}
																										/>
																									</button>
																								)}
																							</span>
																						</p>
																					</div>
																				)}
																			</div>
																		))
																	) : (
																		<p>No hay tareas para este proyecto.</p>
																	)}
																	{canEdit && (
																		<div className="d-flex flex-row-reverse">
																			<button
																				className="thm-btn"
																				onClick={(e) => {
																					e.preventDefault();
																					handleAgregarTarea(proyecto._id);
																				}}
																				title="Agregar tarea"
																			>
																				<FontAwesomeIcon icon={faPlus} />{" "}
																				Agregar tarea
																			</button>
																		</div>
																	)}
																</div>
															</div>
														</Td>
													</Tr>
												)}
											</React.Fragment>
										);
									})
								) : (
									<Tr>
										<Td colSpan="6" className="text-center">
											No hay proyectos disponibles.
										</Td>
									</Tr>
								)}
							</Tbody>
						</Table>
					)}
				</div>
				<TablaPaginacion
					totalItems={proyectosFiltrados.length}
					itemsPorPagina={itemsPag}
					paginaActual={pagActual}
					onItemsPorPaginaChange={(cant) => {
						setItemsPag(cant);
						setPagActual(1);
					}}
					onPaginaChange={(pagina) => setPagActual(pagina)}
				/>
			</div>

			{showModalVerTarea && (
				<ModalVerTareas
					show={showModalVerTarea}
					handleClose={handleCloseVerTareaModal}
					tareaModal={tareaModal}
					onUpdated={reloadData}
				/>
			)}

			{showModalVerProyecto && (
				<ModalVerProyecto
					show={showModalVerProyecto}
					handleClose={handleCloseVerProyectoModal}
					proyectoId={proyectoModal}
				/>
			)}

			{showModalEditarProyecto && (
				<ModalEditarProyecto
					show={showModalEditarProyecto}
					handleClose={handleCloseEditarProyectoModal}
					proyectoId={editingProyectoId}
					onUpdate={reloadData}
				/>
			)}

			{showModalEditarTarea && (
				<ModalEditarTarea
					show={showModalEditarTarea}
					handleClose={handleCloseEditarTareaModal}
					tareaId={editingTareaId}
					onUpdate={reloadData}
				/>
			)}

			{showModalAgregarProyecto && (
				<ModalAgregarProyecto
					show={showModalAgregarProyecto}
					handleClose={handleCloseAgregarProyectoModal}
					onUpdate={reloadData}
				/>
			)}

			{showModalAgregarTarea && (
				<ModalAgregarTarea
					show={showModalAgregarTarea}
					handleClose={handleCloseAgregarTareaModal}
					proyectoId={selectedProyectoTarea}
					onUpdate={reloadData}
				/>
			)}
		</AdminLayout>
	);
};

export default DashboardColaborador;
