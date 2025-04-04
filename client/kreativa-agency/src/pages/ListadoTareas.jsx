import { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
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
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import ModalVerTareas from "../components/Tareas/ModalVerTareas";

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

    const rol = localStorage.getItem("tipo_usuario");

    useEffect(() => {
        const fetchTareas = async () => {
            try {
                let url = "http://localhost:4000/";

                const idUsuario = localStorage.getItem("user_id");

                url += "api/tareas";

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
        <div>
            <Navbar></Navbar>
            <h3 className="section-title text-center">
                {rol === "Administrador" ? "Listado de Tareas" : "Mis Tareas"}
            </h3>

            <div className="container pt-3  table-responsive">
                <div className="row">
                    {rol === "Administrador" ? (
                        <div className="col">
                            <label htmlFor="filterColab">
                                Filtrar por Colaborador:
                            </label>
                            <select
                                className="form-select form-select-sm mb-4"
                                onChange={(e) => {
                                    setFilterColab(e.target.value);
                                    setFilterStatus(filterStatus);
                                    setPagActual(1);
                                }}
                                id="filterColab"
                            >
                                <option defaultValue={""}></option>
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
                            className="form-select form-select-sm mb-4"
                            onChange={(e) => {
                                setFilterStatus(e.target.value);
                                setFilterColab(filterColab);
                                setPagActual(1);
                            }}
                            id="filterStatus"
                        >
                            <option defaultValue={""}></option>
                            <option value={"Por Hacer"}>Por Hacer</option>
                            <option value={"En Progreso"}>En Progreso</option>
                            <option value={"Cancelado"}>Cancelado</option>
                            <option value={"Finalizado"}>Finalizado</option>
                            <option value={"En Revisión"}>En Revisión</option>
                        </select>
                    </div>

                    {rol === "Administrador" ? (
                        <div className="col text-end">
                            <button
                                className="thm-btn btn-crear"
                                onClick={() => navigate("/tarea/agregar")}
                            >
                                Crear Tarea
                            </button>
                        </div>
                    ) : (
                        ""
                    )}
                </div>

                <table className="table kreativa-table">
                    <thead>
                        <tr>
                            <th
                                onClick={() => {
                                    if (sortField === "nombre") {
                                        setsortOrder(
                                            sortOrder === "asc" ? "desc" : "asc"
                                        );
                                        return;
                                    }

                                    setsortField("nombre");
                                    setsortOrder("asc");
                                }}
                                className="sort-field"
                            >
                                Nombre <FontAwesomeIcon icon={faSort} />
                            </th>
                            <th
                                onClick={() => {
                                    if (sortField === "proyecto_id.nombre") {
                                        setsortOrder(
                                            sortOrder === "asc" ? "desc" : "asc"
                                        );
                                        return;
                                    }

                                    setsortField("proyecto_id.nombre");
                                    setsortOrder("asc");
                                }}
                                className="sort-field"
                            >
                                Proyecto <FontAwesomeIcon icon={faSort} />
                            </th>
                            {rol === "Administrador" ? (
                                <th
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

                                        setsortField("colaborador_id.nombre");
                                        setsortOrder("asc");
                                    }}
                                    className="sort-field"
                                >
                                    Colaborador{" "}
                                    <FontAwesomeIcon icon={faSort} />
                                </th>
                            ) : (
                                ""
                            )}
                            <th
                                onClick={() => {
                                    if (sortField === "estado") {
                                        setsortOrder(
                                            sortOrder === "asc" ? "desc" : "asc"
                                        );
                                        return;
                                    }

                                    setsortField("estado");
                                    setsortOrder("asc");
                                }}
                                className="sort-field"
                            >
                                Estado <FontAwesomeIcon icon={faSort} />
                            </th>
                            <th
                                onClick={() => {
                                    if (sortField === "prioridad") {
                                        setsortOrder(
                                            sortOrder === "asc" ? "desc" : "asc"
                                        );
                                        return;
                                    }

                                    setsortField("prioridad");
                                    setsortOrder("asc");
                                }}
                                className="sort-field"
                            >
                                Prioridad <FontAwesomeIcon icon={faSort} />
                            </th>
                            <th
                                onClick={() => {
                                    if (sortField === "fecha_vencimiento") {
                                        setsortOrder(
                                            sortOrder === "asc" ? "desc" : "asc"
                                        );
                                        return;
                                    }

                                    setsortField("fecha_vencimiento");
                                    setsortOrder("asc");
                                }}
                                className="sort-field"
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
                                    <td>{tarea.nombre}</td>
                                    <td>{tarea.proyecto_id.nombre}</td>
                                    {rol === "Administrador" ? (
                                        <td>{tarea.colaborador_id.nombre}</td>
                                    ) : (
                                        ""
                                    )}
                                    <td>{tarea.estado}</td>
                                    <td>{tarea.prioridad}</td>
                                    <td>
                                        {new Date(
                                            tarea.fecha_vencimiento
                                        ).toLocaleDateString()}
                                    </td>

                                    <td className="acciones">
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
                                            {rol === "Administrador" ? (
                                                <button
                                                    className="thm-btn thm-btn-small btn-editar"
                                                    onClick={() =>
                                                        handleEditar(tarea._id)
                                                    }
                                                >
                                                    Editar
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
                                <td colSpan={7}>No hay tareas por mostar.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="d-flex justify-content-center mt-4">
                <select
                    className="form-select form-select-sm w-10 "
                    onChange={handleChangeCantItems}
                >
                    <option value={5} selected>
                        5
                    </option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={tareasOrdenadas.length}>Todos</option>
                </select>{" "}
                <button
                    className={`thm-btn btn-volver thm-btn-small me-2`}
                    onClick={() => setPagActual(1)}
                    disabled={pagActual === 1}
                >
                    <FontAwesomeIcon icon={faBackward} />
                </button>
                <button
                    className={`thm-btn btn-volver thm-btn-small me-2`}
                    onClick={() => setPagActual(pagActual - 1)}
                    disabled={pagActual === 1}
                >
                    <FontAwesomeIcon icon={faCaretLeft} />
                </button>
                <button
                    className={`thm-btn btn-volver thm-btn-small me-2`}
                    onClick={() => setPagActual(pagActual + 1)}
                    disabled={pagActual === totalPags || totalPags - 1 <= 0}
                >
                    <FontAwesomeIcon icon={faCaretRight} />
                </button>
                <button
                    className={`thm-btn thm-btn-small btn-volver me-2`}
                    onClick={() => setPagActual(totalPags)}
                    disabled={pagActual === totalPags || totalPags - 1 <= 0}
                >
                    <FontAwesomeIcon icon={faForward} />
                </button>
            </div>

            {showModal && (
                <ModalVerTareas
                    show={showModal}
                    handleClose={() => setShowModal(false)}
                    tareaModal={tareaModal}
                ></ModalVerTareas>
            )}
        </div>
    );
};

export default ListadoTareas;
