import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import axios from "axios";
import lodash from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSort,
    faForward,
    faCaretRight,
    faCaretLeft,
    faBackward,
    faEye,
    faPencil,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import ModalVerTareas from "../components/Tareas/ModalVerTareas";
import { notification } from "antd";
import forceFileDownload from "../utils/forceFileDownload";
import TablaPaginacion from "../components/ui/TablaPaginacion";

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

    const rol = localStorage.getItem("tipo_usuario");

    useEffect(() => {
        const fetchTareas = async () => {
            try {
                let url = `${import.meta.env.VITE_API_URL}`;

                const idUsuario = localStorage.getItem("user_id");

                url += "/tareas";

                url += rol === "Colaborador" ? `/getByColab/${idUsuario}` : "";

                const response = await axios.get(url);
                setTareas(response.data.tareas);
            } catch (error) {
                console.error(error.message);
            }
        };

        const fetchColabs = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/usuarios/empleados`,
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

        fetchTareas();
        fetchColabs();
    }, [rol]);

    const handleChangeCantItems = (event) => {
        setItemsPag(event.target.value);
        setPagActual(1);
    };

    const handleEditar = (id) => {
        navigate(`/tarea/editar/${id}`);
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

                openSuccessNotification(
                    `Reporte de tareas generado correctamente.`
                );
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
                      lodash
                          .get(tarea, "colaborador_id._id")
                          .localeCompare(filterColab) === 0
              )
            : tareas;

    tareasFiltradas =
        filterStatus !== ""
            ? tareasFiltradas.filter(
                  (tarea) =>
                      lodash
                          .get(tarea, "estado")
                          .localeCompare(filterStatus) === 0
              )
            : tareasFiltradas;

    const tareasOrdenadas =
        sortOrder === "asc"
            ? tareasFiltradas.sort((a, b) =>
                  lodash
                      .get(a, sortField)
                      .localeCompare(lodash.get(b, sortField))
              )
            : tareasFiltradas.sort((a, b) =>
                  lodash
                      .get(b, sortField)
                      .localeCompare(lodash.get(a, sortField))
              );

    const tareasPags =
        itemsPag !== tareasOrdenadas.length
            ? tareasOrdenadas.slice(
                  (pagActual - 1) * itemsPag,
                  pagActual * itemsPag
              )
            : tareasOrdenadas;

    const totalPags = Math.ceil(tareasFiltradas.length / itemsPag);

    if (!tareas) {
        return (
            <div className="container d-flex align-items-center justify-content-center">
                <p>Cargando tareas...</p>
            </div>
        );
    }

    return (
        <AdminLayout>
            {contextHolder}
            <div className="container pt-3 mx-auto" style={{ marginLeft: "70px" }}>
                <div style={{ height: "90px" }}></div>

                <h1 className="mb-4">
                    {rol === "Administrador"
                        ? "Listado de Tareas"
                        : "Mis Tareas"}
                </h1>

                <div className="row mb-3">
                    {rol === "Administrador" ? (
                        <div className="col">
                            <label htmlFor="filterColab">
                                Filtrar por Colaborador:
                            </label>
                            <select
                                className="form-select form_input"
                                onChange={(e) => {
                                    setFilterColab(e.target.value);
                                    setFilterStatus(filterStatus);
                                    setPagActual(1);
                                }}
                                id="filterColab"
                            >
                                <option defaultValue={""}>Todos</option>
                                {renderOptionsColabs()}
                            </select>
                        </div>
                    ) : (
                        ""
                    )}
                    <div className="col">
                        <label htmlFor="filterStatus">
                            Filtrar por Prioridad:
                        </label>
                        <select
                            className="form-select form_input"
                            onChange={(e) => {
                                setFilterStatus(e.target.value);
                                setFilterColab(filterColab);
                                setPagActual(1);
                            }}
                            id="filterStatus"
                        >
                            <option defaultValue={""}>Todos</option>
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
                                onClick={() => navigate("/tarea/agregar")}
                            >
                                Crear Tarea
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
                <div className="table-responsive">
                    <table className="table kreativa-proyecto-table">
                        <thead className="table-light">
                            <tr>
                                <th
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        if (sortField === "nombre") {
                                            setsortOrder(
                                                sortOrder === "asc"
                                                    ? "desc"
                                                    : "asc"
                                            );
                                            return;
                                        }

                                        setsortField("nombre");
                                        setsortOrder("asc");
                                    }}
                                    className="text-center"
                                >
                                    Nombre <FontAwesomeIcon icon={faSort} />
                                </th>
                                <th
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        if (
                                            sortField === "proyecto_id.nombre"
                                        ) {
                                            setsortOrder(
                                                sortOrder === "asc"
                                                    ? "desc"
                                                    : "asc"
                                            );
                                            return;
                                        }

                                        setsortField("proyecto_id.nombre");
                                        setsortOrder("asc");
                                    }}
                                    className="text-center"
                                >
                                    Proyecto <FontAwesomeIcon icon={faSort} />
                                </th>
                                {rol === "Administrador" ? (
                                    <th
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                            if (
                                                sortField ===
                                                "colaborador_id.nombre"
                                            ) {
                                                setsortOrder(
                                                    sortOrder === "asc"
                                                        ? "desc"
                                                        : "asc"
                                                );
                                                return;
                                            }

                                            setsortField(
                                                "colaborador_id.nombre"
                                            );
                                            setsortOrder("asc");
                                        }}
                                        className="text-center"
                                    >
                                        Colaborador{" "}
                                        <FontAwesomeIcon icon={faSort} />
                                    </th>
                                ) : (
                                    ""
                                )}
                                <th
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        if (sortField === "estado") {
                                            setsortOrder(
                                                sortOrder === "asc"
                                                    ? "desc"
                                                    : "asc"
                                            );
                                            return;
                                        }

                                        setsortField("estado");
                                        setsortOrder("asc");
                                    }}
                                    className="text-center"
                                >
                                    Estado <FontAwesomeIcon icon={faSort} />
                                </th>
                                <th
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        if (sortField === "prioridad") {
                                            setsortOrder(
                                                sortOrder === "asc"
                                                    ? "desc"
                                                    : "asc"
                                            );
                                            return;
                                        }

                                        setsortField("prioridad");
                                        setsortOrder("asc");
                                    }}
                                    className="text-center"
                                >
                                    Prioridad <FontAwesomeIcon icon={faSort} />
                                </th>
                                <th
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        if (sortField === "fecha_vencimiento") {
                                            setsortOrder(
                                                sortOrder === "asc"
                                                    ? "desc"
                                                    : "asc"
                                            );
                                            return;
                                        }

                                        setsortField("fecha_vencimiento");
                                        setsortOrder("asc");
                                    }}
                                    className="text-center"
                                >
                                    Fecha de Entrega{" "}
                                    <FontAwesomeIcon icon={faSort} />
                                </th>
                                <th className="text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tareasOrdenadas.length !== 0 ? (
                                tareasPags.map((tarea) => (
                                    <tr key={tarea._id}>
                                        <td className="text-center">
                                            {tarea.nombre}
                                        </td>
                                        <td className="text-center">
                                            {tarea.proyecto_id.nombre}
                                        </td>
                                        {rol === "Administrador" ? (
                                            <td className="text-center">
                                                <span
                                                    className="badge badge-gris"
                                                    title={
                                                        tarea.colaborador_id
                                                            ?.nombre ||
                                                        "Sin asignar"
                                                    }
                                                >
                                                    {tarea.colaborador_id
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
                                                                    .charAt(0)
                                                              : "")
                                                        : "?"}
                                                </span>
                                            </td>
                                        ) : (
                                            ""
                                        )}
                                        <td className="text-center">
                                            <div
                                                className={`${getEstado(tarea.estado)}`}
                                            >
                                                {tarea.estado}
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <div
                                                className={`${getPrioridad(tarea.prioridad)}`}
                                            >
                                                {tarea.prioridad}
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            {new Date(
                                                tarea.fecha_vencimiento
                                            ).toLocaleDateString()}
                                        </td>

                                        <td className="text-center">
                                            <div className="botones-grupo">
                                                <button
                                                    className="thm-btn thm-btn-small btn-amarillo"
                                                    onClick={() => {
                                                        setTareaModal(tarea);
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faEye}
                                                    />
                                                </button>
                                                {rol === "Administrador" ? (
                                                    <button
                                                        className="thm-btn thm-btn-small btn-azul"
                                                        onClick={() =>
                                                            handleEditar(
                                                                tarea._id
                                                            )
                                                        }
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faPencil}
                                                        />
                                                    </button>
                                                ) : (
                                                    ""
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7}>
                                        No hay tareas por mostar.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
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
                ></ModalVerTareas>
            )}
        </AdminLayout>
    );
};

export default ListadoTareas;
