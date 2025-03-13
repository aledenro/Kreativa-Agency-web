import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSort,
    faEye,
    faForward,
    faCaretRight,
    faCaretLeft,
    faBackward,
} from "@fortawesome/free-solid-svg-icons";
import lodash from "lodash";

const VerCotizaciones = () => {
    const [cotizaciones, setCotizaciones] = useState([]);
    const navigate = useNavigate();
    const [itemsPag, setItemsPag] = useState(5);
    const [pagActual, setPagActual] = useState(1);
    const [sortField, setsortField] = useState("fecha_solicitud");
    const [sortOrder, setsortOrder] = useState("desc");

    useEffect(() => {
        async function getCotizaciones() {
            try {
                const response = await axios.get(
                    "http://localhost:4000/api/cotizaciones/"
                );
                setCotizaciones(response.data.cotizaciones);
            } catch (error) {
                console.error(error.message);
            }
        }

        getCotizaciones();
    }, []);

    function handleVerDetalles(id) {
        navigate(`/cotizacion/${id}`);
    }

    const handleChangeCantItems = (event) => {
        setItemsPag(event.target.value);
        setPagActual(1);
    };

    const cotizacionesOrdenadas = cotizaciones.sort((a, b) => {
        const valorA = lodash.get(a, sortField);
        const valorB = lodash.get(b, sortField);

        if (typeof valorA === "boolean" && typeof valorB === "boolean") {
            return sortOrder === "asc"
                ? Number(valorA) - Number(valorB)
                : Number(valorB) - Number(valorA);
        }

        if (typeof valorA === "string" && typeof valorB === "string") {
            return sortOrder === "asc"
                ? valorA.localeCompare(valorB)
                : valorB.localeCompare(valorA);
        }

        return sortOrder === "asc"
            ? valorA > valorB
                ? 1
                : -1
            : valorA < valorB
              ? 1
              : -1;
    });

    const cotizacionesPags =
        itemsPag !== cotizacionesOrdenadas.length
            ? cotizacionesOrdenadas.slice(
                  (pagActual - 1) * itemsPag,
                  pagActual * itemsPag
              )
            : cotizacionesOrdenadas;

    const totalPags = Math.ceil(cotizaciones.length / itemsPag);

    if (!cotizaciones) {
        return (
            <div className="container d-flex align-items-center justify-content-center">
                <p>Cargando cotizaciones...</p>
            </div>
        );
    }

    return (
        <div>
            <Navbar></Navbar>
            <h3 className="section-title text-center">
                Listado de Cotizaciones
            </h3>

            <div className="container pt-3  table-responsive">
                <div className="row mb-3">
                    <div className="col text-end">
                        <button
                            className="thm-btn btn-verde"
                            onClick={() => navigate("/cotizacion/agregar")}
                        >
                            Solicitar Cotización
                        </button>
                    </div>
                </div>
                <table className="table kreativa-table">
                    <thead>
                        <tr>
                            <th
                                scope="col"
                                className="sort-field"
                                onClick={() => {
                                    if (sortField === "titulo") {
                                        setsortOrder(
                                            sortOrder === "asc" ? "desc" : "asc"
                                        );
                                        return;
                                    }

                                    setsortField("titulo");
                                    setsortOrder("asc");
                                }}
                            >
                                Titulo <FontAwesomeIcon icon={faSort} />
                            </th>
                            <th
                                scope="col"
                                className="sort-field"
                                onClick={() => {
                                    if (sortField === "cliente_id.nombre") {
                                        setsortOrder(
                                            sortOrder === "asc" ? "desc" : "asc"
                                        );
                                        return;
                                    }

                                    setsortField("cliente_id.nombre");
                                    setsortOrder("asc");
                                }}
                            >
                                Cliente <FontAwesomeIcon icon={faSort} />
                            </th>
                            <th
                                scope="col"
                                className="sort-field"
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
                            >
                                Estado <FontAwesomeIcon icon={faSort} />
                            </th>
                            <th
                                scope="col"
                                className="sort-field"
                                onClick={() => {
                                    if (sortField === "fecha_solicitud") {
                                        setsortOrder(
                                            sortOrder === "asc" ? "desc" : "asc"
                                        );
                                        return;
                                    }

                                    setsortField("fecha_solicitud");
                                    setsortOrder("asc");
                                }}
                            >
                                Fecha <FontAwesomeIcon icon={faSort} />
                            </th>
                            <th
                                scope="col"
                                className="sort-field"
                                onClick={() => {
                                    if (sortField === "urgente") {
                                        setsortOrder(
                                            sortOrder === "asc" ? "desc" : "asc"
                                        );
                                        return;
                                    }

                                    setsortField("urgente");
                                    setsortOrder("asc");
                                }}
                            >
                                Urgente <FontAwesomeIcon icon={faSort} />
                            </th>
                            <th scope="col">Ver Detalles</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cotizacionesPags.map((cotizacion) => (
                            <tr key={cotizacion._id}>
                                <td>{cotizacion.titulo}</td>
                                <td>{cotizacion.cliente_id.nombre}</td>
                                <td>{cotizacion.estado}</td>
                                <td>
                                    {new Date(
                                        cotizacion.fecha_solicitud
                                    ).toLocaleDateString()}
                                </td>
                                <td>{cotizacion.urgente ? "Si" : "No"}</td>
                                <td>
                                    <button
                                        className="thm-btn thm-btn-small btn-amarillo"
                                        onClick={() =>
                                            handleVerDetalles(cotizacion._id)
                                        }
                                    >
                                        <FontAwesomeIcon icon={faEye} />
                                    </button>
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
                    <option value={cotizacionesOrdenadas.length}>Todos</option>
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
        </div>
    );
};

export default VerCotizaciones;
