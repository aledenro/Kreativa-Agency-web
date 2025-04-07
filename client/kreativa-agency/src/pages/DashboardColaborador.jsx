import React, { useState, useEffect, useCallback } from "react";
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
    faPencil,
    faSortUp,
    faSortDown,
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

    const [taskSortByProject, setTaskSortByProject] = useState({});

    const [pagActual, setPagActual] = useState(1);
    const [itemsPag, setItemsPag] = useState(5);

    const [showModal, setShowModal] = useState(false);
    const [tareaModal, setTareaModal] = useState({});

    const [showProyectoModal, setShowProyectoModal] = useState(false);
    const [selectedProyectoId, setSelectedProyectoId] = useState(null);

    const [showEditProyectoModal, setShowEditProyectoModal] = useState(false);
    const [editingProyectoId, setEditingProyectoId] = useState(null);

    const [showEditTareaModal, setShowEditTareaModal] = useState(false);
    const [editingTareaId, setEditingTareaId] = useState(null);

    const [showModalAgregarProyecto, setShowModalProyecto] = useState(false);

    const [showModalAgregarTarea, setShowModalAgregarTarea] = useState(false);
    const [selectedProyectoTarea, setSelectedProyectoTarea] = useState(null);

    const rol = localStorage.getItem("tipo_usuario");
    const userId = localStorage.getItem("user_id");

    const [estadosProyecto, setEstadosProyecto] = useState([]);

    const [api, contextHolder] = notification.useNotification();

    const openSuccessNotification = (message) => {
        api.success({
            message: "Éxito",
            description: message,
            placement: "bottomRight",
            duration: 4,
        });
    };

    const openErrorNotification = (message) => {
        api.error({
            message: "Error",
            description: message,
            placement: "bottomRight",
            duration: 4,
        });
    };

    useEffect(() => {
        const fetchProyectos = async () => {
            try {
                const token = localStorage.getItem("token");
                let url = "http://localhost:4000/api/proyectos";

                if (rol === "Cliente") {
                    url += `/cliente/${userId}`;
                }

                const response = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setProyectos(response.data);

                const estados = [
                    ...new Set(response.data.map((p) => p.estado)),
                ].filter(Boolean);
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
                console.error(
                    `Error al obtener los proyectos: ${error.message}`
                );
            }
        };

        const fetchTareas = async () => {
            try {
                const token = localStorage.getItem("token");
                let url = "http://localhost:4000/api/tareas";

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

        if (rol === "Administrador") {
            Promise.all([fetchProyectos(), fetchTareas(), fetchEmpleados()])
                .then(() => setLoading(false))
                .catch((error) => {
                    console.error("Error fetching data:", error);
                    setLoading(false);
                });
        } else {
            Promise.all([fetchProyectos(), fetchTareas()])
                .then(() => setLoading(false))
                .catch((error) => {
                    console.error("Error fetching data:", error);
                    setLoading(false);
                });
        }
    }, [rol, userId]);

    const reloadData = useCallback(() => {
        setLoading(true);

        const fetchProyectos = async () => {
            try {
                const token = localStorage.getItem("token");
                let url = "http://localhost:4000/api/proyectos";

                if (rol === "Cliente") {
                    url += `/cliente/${userId}`;
                }

                const response = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setProyectos(response.data);

                const estados = [
                    ...new Set(response.data.map((p) => p.estado)),
                ].filter(Boolean);
                setEstadosProyecto(estados);
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

                const response = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setTareas(response.data.tareas || []);
            } catch (error) {
                console.error(`Error al obtener las tareas: ${error.message}`);
            }
        };

        Promise.all([fetchProyectos(), fetchTareas()])
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

    const handleTaskSort = (proyectoId, field) => {
        setTaskSortByProject((prev) => {
            const currentProjectSort = prev[proyectoId] || {
                field: "nombre",
                order: "asc",
            };
            const newOrder =
                currentProjectSort.field === field &&
                currentProjectSort.order === "asc"
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

    const getSortIcon = (proyectoId, field) => {
        const sortConfig = taskSortByProject[proyectoId] || {
            field: "nombre",
            order: "asc",
        };

        if (sortConfig.field !== field) {
            return <FontAwesomeIcon icon={faSort} />;
        }

        return sortConfig.order === "asc" ? (
            <FontAwesomeIcon icon={faSortUp} />
        ) : (
            <FontAwesomeIcon icon={faSortDown} />
        );
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

    const handleEditarTarea = (tareaId) => {
        setEditingTareaId(tareaId);
        setShowEditTareaModal(true);
    };

    const handleVerTarea = (tarea) => {
        setTareaModal(tarea);
        setShowModal(true);
    };

    const handleEditarProyecto = (proyectoId) => {
        setEditingProyectoId(proyectoId);
        setShowEditProyectoModal(true);
    };

    const handleVerProyecto = (proyectoId) => {
        setSelectedProyectoId(proyectoId);
        setShowProyectoModal(true);
    };

    const handleAgregarTarea = (proyectoId) => {
        setSelectedProyectoTarea(proyectoId);
        setShowModalAgregarTarea(true);
    };

    const handleAgregarProyecto = () => {
        setShowModalProyecto(true);
    };

    const handleChangeCantItems = (event) => {
        setItemsPag(parseInt(event.target.value));
        setPagActual(1);
    };

    const handleCloseEditModal = () => {
        setShowEditProyectoModal(false);
        reloadData();
    };

    const handleCloseEditTareaModal = () => {
        setShowEditTareaModal(false);
        reloadData();
    };

    const handleCloseAgregarProyectoModal = () => {
        setShowModalProyecto(false);
    };

    const handleCloseAgregarTareaModal = () => {
        setShowModalAgregarTarea(false);
        setSelectedProyectoTarea(null);
    };

    const handleImprimirReporte = async () => {
        const proyectosFormateados = proyectosFiltrados.map((proyecto) => {
            return {
                nombre: proyecto.nombre,
                descripcion: proyecto.descripcion,
                cliente: proyecto.cliente_id.nombre,
                estado: proyecto.estado,
                urgente: proyecto.urgente ? "Sí" : "No",
                fecha_entrega: new Date(
                    proyecto.fecha_entrega
                ).toLocaleDateString(),
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
                openErrorNotification(
                    `No hay datos de proyectos para imprimir.`
                );
                return;
            }

            const response = await axios.post(
                "http://localhost:3000/printExcel/singlePage",
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

                openSuccessNotification(
                    `Reporte de proyectos generado correctamente.`
                );
                event.target.reset();
                return;
            }
        } catch (error) {
            console.error(error.message);
            openErrorNotification(`Error al generar el  reporte de proyectos.`);
        }
    };

    let proyectosFiltrados = [...proyectos];

    if (rol === "Colaborador") {
        proyectosFiltrados = proyectosFiltrados.filter((proyecto) => {
            const projectTasks = getTareasForProyecto(proyecto._id);
            return projectTasks.length > 0;
        });
    }

    if (filterColab || filterStatus) {
        if (filterStatus) {
            proyectosFiltrados = proyectosFiltrados.filter(
                (proyecto) => proyecto.estado === filterStatus
            );
        }
        if (filterColab) {
            proyectosFiltrados = proyectosFiltrados.filter((proyecto) => {
                const projectTasks = getTareasForProyecto(proyecto._id);
                const filteredTasks = projectTasks.filter((tarea) => {
                    if (
                        !tarea.colaborador_id ||
                        tarea.colaborador_id._id !== filterColab
                    ) {
                        return false;
                    }
                    return true;
                });
                return filteredTasks.length > 0;
            });
        }
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

    const canEdit = rol === "Administrador";
    const canView = true;

    if (loading) {
        return (
            <div className="container d-flex align-items-center justify-content-center">
                <p>Cargando..</p>
            </div>
        );
    }

    return (
        <AdminLayout>
            {contextHolder}
            <div className="container pt-3 mx-auto">
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
                                className="form-select form_input"
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
                                className="thm-btn  m-1"
                                onClick={handleAgregarProyecto}
                            >
                                Crear Proyecto
                            </button>
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
                <div className="table-responsive">
                    <table className="table kreativa-proyecto-table">
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
                                    style={{ width: "200px" }}
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
                                    Entrega <FontAwesomeIcon icon={faSort} />
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
                                                        className={`${getEstado(proyecto.estado)}`}
                                                    >
                                                        {proyecto.estado}
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <div
                                                        className={`${getUrgencyClass(proyecto.urgente)}`}
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
                                                <td className="text-center">
                                                    <div className="botones-grupo">
                                                        {canView && (
                                                            <button
                                                                className="thm-btn thm-btn-small btn-amarillo"
                                                                onClick={() =>
                                                                    handleVerProyecto(
                                                                        proyecto._id
                                                                    )
                                                                }
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
                                                                    handleEditarProyecto(
                                                                        proyecto._id
                                                                    )
                                                                }
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        faPencil
                                                                    }
                                                                />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>

                                            {expandedProjects[proyecto._id] && (
                                                <tr>
                                                    <td
                                                        colSpan="6"
                                                        className="p-0"
                                                    >
                                                        <div className="ms-5">
                                                            <table className="table kreativa-tareas-table border border-0 my-2">
                                                                <thead className="table-light">
                                                                    <tr>
                                                                        <th
                                                                            style={{
                                                                                cursor: "pointer",
                                                                            }}
                                                                            onClick={() =>
                                                                                handleTaskSort(
                                                                                    proyecto._id,
                                                                                    "nombre"
                                                                                )
                                                                            }
                                                                        >
                                                                            Tarea{" "}
                                                                            {getSortIcon(
                                                                                proyecto._id,
                                                                                "nombre"
                                                                            )}
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
                                                                                cursor: "pointer",
                                                                            }}
                                                                            className="text-center"
                                                                            onClick={() =>
                                                                                handleTaskSort(
                                                                                    proyecto._id,
                                                                                    "estado"
                                                                                )
                                                                            }
                                                                        >
                                                                            Estado{" "}
                                                                            {getSortIcon(
                                                                                proyecto._id,
                                                                                "estado"
                                                                            )}
                                                                        </th>
                                                                        <th
                                                                            style={{
                                                                                width: "100px",
                                                                                cursor: "pointer",
                                                                            }}
                                                                            className="text-center"
                                                                            onClick={() =>
                                                                                handleTaskSort(
                                                                                    proyecto._id,
                                                                                    "prioridad"
                                                                                )
                                                                            }
                                                                        >
                                                                            Prioridad
                                                                        </th>
                                                                        <th
                                                                            style={{
                                                                                width: "120px",
                                                                                cursor: "pointer",
                                                                            }}
                                                                            className="text-center"
                                                                            onClick={() =>
                                                                                handleTaskSort(
                                                                                    proyecto._id,
                                                                                    "fecha_vencimiento"
                                                                                )
                                                                            }
                                                                        >
                                                                            Fecha{" "}
                                                                            {getSortIcon(
                                                                                proyecto._id,
                                                                                "fecha_vencimiento"
                                                                            )}
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
                                                                                    <td>
                                                                                        {
                                                                                            tarea.nombre
                                                                                        }
                                                                                    </td>
                                                                                    <td className="text-center">
                                                                                        <span
                                                                                            className="badge badge-gris"
                                                                                            title={
                                                                                                tarea
                                                                                                    .colaborador_id
                                                                                                    ?.nombre ||
                                                                                                "Sin asignar"
                                                                                            }
                                                                                        >
                                                                                            {tarea
                                                                                                .colaborador_id
                                                                                                ?.nombre
                                                                                                ? tarea.colaborador_id.nombre.charAt(
                                                                                                      0
                                                                                                  ) +
                                                                                                  (tarea.colaborador_id.nombre.includes(
                                                                                                      " "
                                                                                                  )
                                                                                                      ? tarea.colaborador_id.nombre
                                                                                                            .split(
                                                                                                                " "
                                                                                                            )[1]
                                                                                                            .charAt(
                                                                                                                0
                                                                                                            )
                                                                                                      : "")
                                                                                                : "?"}
                                                                                        </span>
                                                                                    </td>
                                                                                    <td className="text-center">
                                                                                        <div
                                                                                            className={`${getEstado(tarea.estado)}`}
                                                                                        >
                                                                                            {
                                                                                                tarea.estado
                                                                                            }
                                                                                        </div>
                                                                                    </td>
                                                                                    <td className="text-center">
                                                                                        <div
                                                                                            className={`${getPrioridad(tarea.prioridad)}`}
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
                                                                                            {canView && (
                                                                                                <button
                                                                                                    className="thm-btn thm-btn-small btn-amarillo"
                                                                                                    onClick={() =>
                                                                                                        handleVerTarea(
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
                                                                                            )}
                                                                                            {canEdit && (
                                                                                                <button
                                                                                                    className="thm-btn thm-btn-small btn-azul"
                                                                                                    onClick={() =>
                                                                                                        handleEditarTarea(
                                                                                                            tarea._id
                                                                                                        )
                                                                                                    }
                                                                                                >
                                                                                                    <FontAwesomeIcon
                                                                                                        icon={
                                                                                                            faPencil
                                                                                                        }
                                                                                                    />
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

                                                                    {canEdit && (
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
                                                                                        handleAgregarTarea(
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
                    <span className="align-self-center mx-2">
                        Página {pagActual} de {totalPags || 1}
                    </span>
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
                />
            )}

            <ModalVerProyecto
                show={showProyectoModal}
                handleClose={() => setShowProyectoModal(false)}
                proyectoId={selectedProyectoId}
            />

            <ModalEditarProyecto
                show={showEditProyectoModal}
                handleClose={handleCloseEditModal}
                proyectoId={editingProyectoId}
                onUpdate={reloadData}
            />

            <ModalEditarTarea
                show={showEditTareaModal}
                handleClose={handleCloseEditTareaModal}
                tareaId={editingTareaId}
                onUpdate={reloadData}
            />

            <ModalAgregarProyecto
                show={showModalAgregarProyecto}
                handleClose={handleCloseAgregarProyectoModal}
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

export default DashboardColaborador;
