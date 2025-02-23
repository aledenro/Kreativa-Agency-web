import { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import axios from "axios";
import lodash from "lodash";

const ListadoTareas = () => {
    const [tareas, setTareas] = useState([]);
    const [itemsPag, setItemsPag] = useState(5);
    const [pagActual, setPagActual] = useState(1);
    const [sortField, setsortField] = useState("fecha_creacion");
    const [sortOrder, setsortOrder] = useState("desc");

    useEffect(() => {
        const fetchTareas = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:4000/api/tareas"
                );
                setTareas(response.data.tareas);
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchTareas();
    }, []);

    const handleChangeCantItems = (event) => {
        setItemsPag(event.target.value);
    };

    if (!tareas) {
        return (
            <div className="container d-flex align-items-center justify-content-center">
                <p>Cargando tareas...</p>
            </div>
        );
    }

    const tareasOrdenadas =
        sortOrder === "asc"
            ? tareas.sort((a, b) =>
                  lodash
                      .get(a, sortField)
                      .localeCompare(lodash.get(b, sortField))
              )
            : tareas.sort((a, b) =>
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

    const totalPags = Math.ceil(tareas.length / itemsPag);

    return (
        <div>
            <Navbar></Navbar>
            <h3 className="section-title text-center">Listado de Tareas</h3>
            <div className="container pt-3  table-responsive">
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
                                Nombre
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
                                Proyecto
                            </th>
                            <th
                                onClick={() => {
                                    if (sortField === "colaborador_id.nombre") {
                                        setsortOrder(
                                            sortOrder === "asc" ? "desc" : "asc"
                                        );
                                        return;
                                    }

                                    setsortField("colaborador_id.nombre");
                                    setsortOrder("asc");
                                }}
                                className="sort-field"
                            >
                                Colaborador
                            </th>
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
                                Estado
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
                                Prioridad
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
                                Fecha de Entrega
                            </th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tareasPags.map((tarea) => (
                            <tr key={tarea._id}>
                                <td>{tarea.nombre}</td>
                                <td>{tarea.proyecto_id.nombre}</td>
                                <td>{tarea.colaborador_id.nombre}</td>
                                <td>{tarea.estado}</td>
                                <td>{tarea.prioridad}</td>
                                <td>
                                    {new Date(
                                        tarea.fecha_vencimiento
                                    ).toLocaleDateString()}
                                </td>

                                <td className="acciones">
                                    <div className="botones-grupo">
                                        <button className="thm-btn thm-btn-small btn-ver">
                                            Ver
                                        </button>
                                        <button className="thm-btn thm-btn-small btn-editar">
                                            Editar
                                        </button>
                                        <button
                                            className={`thm-btn thm-btn-small`}
                                        ></button>
                                        <button className="thm-btn thm-btn-small btn-eliminar">
                                            Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
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
                    {"<<"}
                </button>
                <button
                    className={`thm-btn btn-volver thm-btn-small me-2`}
                    onClick={() => setPagActual(pagActual - 1)}
                    disabled={pagActual === 1}
                >
                    {"<"}
                </button>
                <button
                    className={`thm-btn btn-volver thm-btn-small me-2`}
                    onClick={() => setPagActual(pagActual + 1)}
                    disabled={pagActual === totalPags || totalPags - 1 === 0}
                >
                    {">"}
                </button>
                <button
                    className={`thm-btn thm-btn-small btn-volver me-2`}
                    onClick={() => setPagActual(totalPags)}
                    disabled={pagActual === totalPags || totalPags - 1 === 0}
                >
                    {">>"}
                </button>
            </div>
        </div>
    );
};

export default ListadoTareas;
