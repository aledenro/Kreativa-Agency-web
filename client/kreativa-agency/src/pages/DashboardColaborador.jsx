import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSort,
    faForward,
    faCaretRight,
    faCaretLeft,
    faCaretDown,
    faBackward,
    faEye,
} from "@fortawesome/free-solid-svg-icons";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import ModalVerTareas from "../components/Tareas/ModalVerTareas"; // Import the modal component

const DashboardColaborador = () => {
    const [proyectos, setProyectos] = useState([]);
    const [tareas, setTareas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedProjects, setExpandedProjects] = useState({});
    const [empleados, setEmpleados] = useState([]);

    const [sortField, setSortField] = useState("fecha_creacion");
    const [sortOrder, setSortOrder] = useState("desc");
    const [filterColab, setFilterColab] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    const [pagActual, setPagActual] = useState(1);
    const [itemsPag, setItemsPag] = useState(5);

    // Add state for modal
    const [showModal, setShowModal] = useState(false);
    const [tareaModal, setTareaModal] = useState({});

    const rol = localStorage.getItem("tipo_usuario");
    const userId = localStorage.getItem("user_id");

    useEffect(() => {
        const fetchProyectos = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    "http://localhost:4000/api/proyectos",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                setProyectos(response.data);

                const expanded = {};
                response.data.forEach((proyecto) => {
                    expanded[proyecto._id] = false;
                });
                setExpandedProjects(expanded);
            } catch (error) {
                console.error(
                    `Error al obtener los proyectos: ${error.message}`
                );
            }
        };

        const fetchTareas = async () => {
            try {
                const token = localStorage.getItem("token");
                let url = "http://localhost:4000/api/tareas";

                if (rol === "Colaborador") {
                    url += `/getByColab/${userId}`;
                }

                const response = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setTareas(response.data.tareas || []);
            } catch (error) {
                console.error(`Error al obtener las tareas: ${error.message}`);
            }
        };

        const fetchEmpleados = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    "http://localhost:4000/api/usuarios/empleados",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                setEmpleados(response.data);
            } catch (error) {
                console.error(
                    `Error al obtener los empleados: ${error.message}`
                );
            }
        };

        Promise.all([fetchProyectos(), fetchTareas(), fetchEmpleados()])
            .then(() => setLoading(false))
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, [rol, userId]);

    const toggleExpand = (proyectoId) => {
        setExpandedProjects((prev) => ({
            ...prev,
            [proyectoId]: !prev[proyectoId],
        }));
    };

    const getTareasForProyecto = (proyectoId) => {
        return tareas.filter(
            (tarea) => tarea.proyecto_id && tarea.proyecto_id._id === proyectoId
        );
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "Por Hacer":
                return "bg-primary text-white";
            case "En Progreso":
                return "bg-warning text-dark";
            case "Finalizado":
                return "bg-success text-white";
            case "En Revisión":
                return "bg-info text-dark";
            case "Cancelado":
                return "bg-danger text-white";
            default:
                return "bg-secondary text-white";
        }
    };

    const getPriorityClass = (priority) => {
        switch (priority) {
            case "Alta":
                return "bg-danger text-white";
            case "Media":
                return "bg-warning text-dark";
            case "Baja":
                return "bg-info text-white";
            default:
                return "bg-secondary text-white";
        }
    };

    const getUrgencyClass = (urgente) => {
        return urgente ? "bg-danger text-white" : "bg-secondary text-white";
    };

    // Updated to match ListadoTareas implementation
    const handleViewTask = (tarea) => {
        setTareaModal(tarea);
        setShowModal(true);
    };

    const handleEditTask = (tareaId) => {
        window.location.href = `/tarea/editar/${tareaId}`;
    };

    const handleCreateTask = (proyectoId) => {
        window.location.href = `/tarea/agregar?proyecto=${proyectoId}`;
    };

    const handleCreateProject = () => {
        window.location.href = "/proyecto/agregar";
    };

    const handleChangeCantItems = (event) => {
        setItemsPag(parseInt(event.target.value));
        setPagActual(1);
    };

    let proyectosFiltrados = [...proyectos];

    if (rol === "Colaborador") {
        proyectosFiltrados = proyectosFiltrados.filter((proyecto) => {
            const projectTasks = getTareasForProyecto(proyecto._id);
            return projectTasks.length > 0;
        });
    }

    if (filterColab || filterStatus) {
        proyectosFiltrados = proyectosFiltrados.filter((proyecto) => {
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
            return filteredTasks.length > 0;
        });
    }

    proyectosFiltrados.sort((a, b) => {
        let valA, valB;

        if (sortField === "fecha_entrega") {
            valA = new Date(a.fecha_entrega || 0);
            valB = new Date(b.fecha_entrega || 0);
            return sortOrder === "asc" ? valA - valB : valB - valA;
        } else {
            valA = a[sortField] || "";
            valB = b[sortField] || "";
            return sortOrder === "asc"
                ? valA.toString().localeCompare(valB.toString())
                : valB.toString().localeCompare(valA.toString());
        }
    });

    const totalPags = Math.ceil(proyectosFiltrados.length / itemsPag);
    const proyectosPaginados = proyectosFiltrados.slice(
        (pagActual - 1) * itemsPag,
        pagActual * itemsPag
    );

    if (loading) {
        return (
            <div className="container d-flex align-items-center justify-content-center">
                <p>Cargando..</p>
            </div>
        );
    }

    return (
        <AdminLayout>
            <div className="container  pt-3  mx-auto">
                <div style={{ height: "90px" }}></div>
                <h1 className="mb-4">Backlog Proyectos</h1>
                <div className="row mb-3">
                    {rol === "Administrador" && (
                        <div className="col">
                            <label htmlFor="filterColab">
                                Filtrar por Colaborador:
                            </label>
                            <select
                                id="filterColab"
                                className="form-select"
                                onChange={(e) => {
                                    setFilterColab(e.target.value);
                                    setPagActual(1);
                                }}
                                value={filterColab}
                            >
                                <option value="">Todos</option>
                                {empleados.map((empleado) => (
                                    <option
                                        key={empleado._id}
                                        value={empleado._id}
                                    >
                                        {empleado.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div className="col">
                        <label htmlFor="filterStatus">
                            Filtrar por Estado:
                        </label>
                        <select
                            id="filterStatus"
                            className="form-select"
                            onChange={(e) => {
                                setFilterStatus(e.target.value);
                                setPagActual(1);
                            }}
                            value={filterStatus}
                        >
                            <option value="">Todos</option>
                            <option value="Por Hacer">Por Hacer</option>
                            <option value="En Progreso">En Progreso</option>
                            <option value="Finalizado">Finalizado</option>
                            <option value="En Revisión">En Revisión</option>
                            <option value="Cancelado">Cancelado</option>
                        </select>
                    </div>
                    {rol === "Administrador" && (
                        <div className="col text-end">
                            <button
                                className="thm-btn"
                                onClick={handleCreateProject}
                            >
                                Crear Proyecto
                            </button>
                        </div>
                    )}
                </div>
                <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead className="table-light">
                            <tr>
                                <th
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        setSortOrder(
                                            sortField === "nombre" &&
                                                sortOrder === "asc"
                                                ? "desc"
                                                : "asc"
                                        );
                                        setSortField("nombre");
                                    }}
                                >
                                    Proyecto <FontAwesomeIcon icon={faSort} />
                                </th>
                                <th
                                    style={{ width: "150px" }}
                                    className="text-center"
                                >
                                    Cliente
                                </th>
                                <th
                                    style={{ width: "120px" }}
                                    className="text-center"
                                >
                                    Estado
                                </th>
                                <th
                                    style={{ width: "100px" }}
                                    className="text-center"
                                >
                                    Urgente
                                </th>
                                <th
                                    style={{
                                        width: "150px",
                                        cursor: "pointer",
                                    }}
                                    className="text-center"
                                    onClick={() => {
                                        setSortOrder(
                                            sortField === "fecha_entrega" &&
                                                sortOrder === "asc"
                                                ? "desc"
                                                : "asc"
                                        );
                                        setSortField("fecha_entrega");
                                    }}
                                >
                                    Fecha Entrega{" "}
                                    <FontAwesomeIcon icon={faSort} />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {proyectosPaginados.length > 0 ? (
                                proyectosPaginados.map((proyecto) => {
                                    const projectTasks = getTareasForProyecto(
                                        proyecto._id
                                    );

                                    const filteredTasks = projectTasks.filter(
                                        (tarea) => {
                                            if (
                                                filterColab &&
                                                (!tarea.colaborador_id ||
                                                    tarea.colaborador_id._id !==
                                                        filterColab)
                                            ) {
                                                return false;
                                            }
                                            if (
                                                filterStatus &&
                                                tarea.estado !== filterStatus
                                            ) {
                                                return false;
                                            }
                                            return true;
                                        }
                                    );

                                    return (
                                        <React.Fragment key={proyecto._id}>
                                            <tr>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <button
                                                            className="btn btn-sm"
                                                            onClick={() =>
                                                                toggleExpand(
                                                                    proyecto._id
                                                                )
                                                            }
                                                        >
                                                            {expandedProjects[
                                                                proyecto._id
                                                            ] ? (
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        faCaretDown
                                                                    }
                                                                />
                                                            ) : (
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        faCaretRight
                                                                    }
                                                                />
                                                            )}
                                                        </button>
                                                        {proyecto.nombre}
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    {proyecto.cliente_id
                                                        ?.nombre || "-"}
                                                </td>
                                                <td className="text-center">
                                                    <div
                                                        className={`p-1 rounded ${getStatusClass(proyecto.estado)}`}
                                                    >
                                                        {proyecto.estado}
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <div
                                                        className={`p-1 rounded ${getUrgencyClass(proyecto.urgente)}`}
                                                    >
                                                        {proyecto.urgente
                                                            ? "Sí"
                                                            : "No"}
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    {proyecto.fecha_entrega
                                                        ? new Date(
                                                              proyecto.fecha_entrega
                                                          ).toLocaleDateString()
                                                        : "-"}
                                                </td>
                                            </tr>

                                            {expandedProjects[proyecto._id] && (
                                                <tr>
                                                    <td
                                                        colSpan="6"
                                                        className="p-0"
                                                    >
                                                        <div className="ms-5">
                                                            <table className="table table-bordered mb-0">
                                                                <thead className="table-light">
                                                                    <tr>
                                                                        <th
                                                                            style={{
                                                                                width: "40px",
                                                                            }}
                                                                        ></th>
                                                                        <th>
                                                                            Tarea
                                                                        </th>
                                                                        <th
                                                                            style={{
                                                                                width: "80px",
                                                                            }}
                                                                            className="text-center"
                                                                        >
                                                                            Resp.
                                                                        </th>
                                                                        <th
                                                                            style={{
                                                                                width: "120px",
                                                                            }}
                                                                            className="text-center"
                                                                        >
                                                                            Estado
                                                                        </th>
                                                                        <th
                                                                            style={{
                                                                                width: "100px",
                                                                            }}
                                                                            className="text-center"
                                                                        >
                                                                            Prioridad
                                                                        </th>
                                                                        <th
                                                                            style={{
                                                                                width: "120px",
                                                                            }}
                                                                            className="text-center"
                                                                        >
                                                                            Fecha
                                                                        </th>
                                                                        <th
                                                                            style={{
                                                                                width: "120px",
                                                                            }}
                                                                            className="text-center"
                                                                        >
                                                                            Acciones
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {filteredTasks.length >
                                                                    0 ? (
                                                                        filteredTasks.map(
                                                                            (
                                                                                tarea
                                                                            ) => (
                                                                                <tr
                                                                                    key={
                                                                                        tarea._id
                                                                                    }
                                                                                >
                                                                                    <td className="text-center">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            className="form-check-input"
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        {
                                                                                            tarea.nombre
                                                                                        }
                                                                                    </td>
                                                                                    <td className="text-center">
                                                                                        <span
                                                                                            className="badge bg-secondary rounded-pill"
                                                                                            title={
                                                                                                tarea
                                                                                                    .colaborador_id
                                                                                                    ?.nombre ||
                                                                                                "Sin asignar"
                                                                                            }
                                                                                        >
                                                                                            {tarea.colaborador_id?.nombre?.charAt(
                                                                                                0
                                                                                            ) ||
                                                                                                "?"}
                                                                                        </span>
                                                                                    </td>
                                                                                    <td className="text-center">
                                                                                        <div
                                                                                            className={`p-1 rounded ${getStatusClass(tarea.estado)}`}
                                                                                        >
                                                                                            {
                                                                                                tarea.estado
                                                                                            }
                                                                                        </div>
                                                                                    </td>
                                                                                    <td className="text-center">
                                                                                        <div
                                                                                            className={`p-1 rounded ${getPriorityClass(tarea.prioridad)}`}
                                                                                        >
                                                                                            {
                                                                                                tarea.prioridad
                                                                                            }
                                                                                        </div>
                                                                                    </td>
                                                                                    <td className="text-center">
                                                                                        {tarea.fecha_vencimiento
                                                                                            ? new Date(
                                                                                                  tarea.fecha_vencimiento
                                                                                              ).toLocaleDateString()
                                                                                            : "-"}
                                                                                    </td>
                                                                                    <td className="text-center">
                                                                                        <div className="botones-grupo">
                                                                                            <button
                                                                                                className="thm-btn thm-btn-small btn-amarillo"
                                                                                                onClick={() =>
                                                                                                    handleViewTask(
                                                                                                        tarea
                                                                                                    )
                                                                                                }
                                                                                            >
                                                                                                <FontAwesomeIcon
                                                                                                    icon={
                                                                                                        faEye
                                                                                                    }
                                                                                                />
                                                                                            </button>
                                                                                            {rol ===
                                                                                                "Administrador" && (
                                                                                                <button
                                                                                                    className="thm-btn thm-btn-small btn-editar"
                                                                                                    onClick={() =>
                                                                                                        handleEditTask(
                                                                                                            tarea._id
                                                                                                        )
                                                                                                    }
                                                                                                >
                                                                                                    Editar
                                                                                                </button>
                                                                                            )}
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        )
                                                                    ) : (
                                                                        <tr>
                                                                            <td
                                                                                colSpan="7"
                                                                                className="text-center text-muted"
                                                                            >
                                                                                No
                                                                                hay
                                                                                tareas
                                                                                para
                                                                                este
                                                                                proyecto.
                                                                            </td>
                                                                        </tr>
                                                                    )}

                                                                    {rol ===
                                                                        "Administrador" && (
                                                                        <tr>
                                                                            <td
                                                                                colSpan="7"
                                                                                className="text-muted"
                                                                            >
                                                                                <a
                                                                                    href="#"
                                                                                    className="text-decoration-none"
                                                                                    onClick={(
                                                                                        e
                                                                                    ) => {
                                                                                        e.preventDefault();
                                                                                        handleCreateTask(
                                                                                            proyecto._id
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    +
                                                                                    Agregar
                                                                                    tarea
                                                                                </a>
                                                                            </td>
                                                                        </tr>
                                                                    )}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">
                                        No hay proyectos disponibles.
                                    </td>
                                </tr>
                            )}

                            {rol === "Administrador" && (
                                <tr>
                                    <td colSpan="6" className="text-muted">
                                        <a
                                            href="#"
                                            className="text-decoration-none"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleCreateProject();
                                            }}
                                        >
                                            + Agregar proyecto
                                        </a>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="d-flex justify-content-center mt-4">
                    <select
                        className="form-select form-select-sm me-2"
                        style={{ width: "70px" }}
                        onChange={handleChangeCantItems}
                        value={itemsPag}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={proyectosFiltrados.length}>Todos</option>
                    </select>
                    <button
                        className="thm-btn btn-volver thm-btn-small me-2"
                        onClick={() => setPagActual(1)}
                        disabled={pagActual === 1}
                    >
                        <FontAwesomeIcon icon={faBackward} />
                    </button>
                    <button
                        className="thm-btn btn-volver thm-btn-small me-2"
                        onClick={() => setPagActual(pagActual - 1)}
                        disabled={pagActual === 1}
                    >
                        <FontAwesomeIcon icon={faCaretLeft} />
                    </button>
                    <button className="btn btn-outline-secondary active me-2">
                        {pagActual}
                    </button>
                    <button
                        className="thm-btn btn-volver thm-btn-small me-2"
                        onClick={() => setPagActual(pagActual + 1)}
                        disabled={pagActual === totalPags || totalPags === 0}
                    >
                        <FontAwesomeIcon icon={faCaretRight} />
                    </button>
                    <button
                        className="thm-btn thm-btn-small btn-volver"
                        onClick={() => setPagActual(totalPags)}
                        disabled={pagActual === totalPags || totalPags === 0}
                    >
                        <FontAwesomeIcon icon={faForward} />
                    </button>
                </div>
            </div>

            {showModal && (
                <ModalVerTareas
                    show={showModal}
                    handleClose={() => setShowModal(false)}
                    tareaModal={tareaModal}
                ></ModalVerTareas>
            )}
        </AdminLayout>
    );
};

export default DashboardColaborador;
