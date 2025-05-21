import { useState, useEffect, useCallback } from "react";
import axios from "axios";
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
import AdminLayout from "../components/AdminLayout/AdminLayout";
import ModalVerCotizacion from "../components/Cotizaciones/ModalVerDetalles";
import ModalAgregar from "../components/Cotizaciones/ModalAgregar";

const getEstado = (status) => {
    switch (status) {
        case "Nuevo":
            return "badge badge-azul";
        case "Aceptado":
            return "badge badge-verde";
        case "Cancelado":
            return "badge badge-rojo";
        default:
            return "badge badge-gris";
    }
};

const getUrgencyClass = (urgente) => {
    return urgente ? "badge badge-rojo" : "badge badge-gris";
};

const VerCotizaciones = () => {
    const [cotizaciones, setCotizaciones] = useState([]);
    const [itemsPag, setItemsPag] = useState(5);
    const [pagActual, setPagActual] = useState(1);
    const [sortField, setsortField] = useState("fecha_solicitud");
    const [sortOrder, setsortOrder] = useState("desc");
    const [showModalDetalles, setShowModalDetalles] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [showModalCrear, setShowModalCrear] = useState(false);
    const tipoUsuario = localStorage.getItem("tipo_usuario");
    const user_id = localStorage.getItem("user_id");

    const getCotizaciones = useCallback(async () => {
        try {
            let url = `${import.meta.env.VITE_API_URL}/cotizaciones/`;

            url += tipoUsuario === "Cliente" ? `getByUser/${user_id}` : "";

            const response = await axios.get(url);
            setCotizaciones(response.data.cotizaciones);
            setsortField("fecha_solicitud");
            setsortOrder("desc");
        } catch (error) {
            console.error(error.message);
        }
    }, [tipoUsuario, user_id]);

    useEffect(() => {
        getCotizaciones();
    }, [getCotizaciones]);

    function handleVerDetalles(id) {
        setSelectedId(id);
        setShowModalDetalles(true);
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
        <AdminLayout>
            <div className="container pt-3 mx-auto">
                <div style={{ height: "90px" }}></div>
                <h1 className="mb-4">Listado de Cotizaciones</h1>

                <div className="row mb-3">
                    <div className="col text-end">
                        <button
                            className="thm-btn"
                            onClick={() => setShowModalCrear(true)}
                        >
                            Solicitar Cotización
                        </button>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table kreativa-proyecto-table">
                        <thead className="table-light">
                            <tr>
                                <th
                                    scope="col"
                                    style={{ cursor: "pointer" }}
                                    className="text-center"
                                    onClick={() => {
                                        if (sortField === "titulo") {
                                            setsortOrder(
                                                sortOrder === "asc"
                                                    ? "desc"
                                                    : "asc"
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
                                    style={{ cursor: "pointer" }}
                                    className="text-center"
                                    onClick={() => {
                                        if (sortField === "cliente_id.nombre") {
                                            setsortOrder(
                                                sortOrder === "asc"
                                                    ? "desc"
                                                    : "asc"
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
                                    style={{ cursor: "pointer" }}
                                    className="text-center"
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
                                >
                                    Estado <FontAwesomeIcon icon={faSort} />
                                </th>
                                <th
                                    scope="col"
                                    style={{ cursor: "pointer" }}
                                    className="text-center"
                                    onClick={() => {
                                        if (sortField === "fecha_solicitud") {
                                            setsortOrder(
                                                sortOrder === "asc"
                                                    ? "desc"
                                                    : "asc"
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
                                    style={{ cursor: "pointer" }}
                                    className="text-center"
                                    onClick={() => {
                                        if (sortField === "urgente") {
                                            setsortOrder(
                                                sortOrder === "asc"
                                                    ? "desc"
                                                    : "asc"
                                            );
                                            return;
                                        }

                                        setsortField("urgente");
                                        setsortOrder("asc");
                                    }}
                                >
                                    Urgente <FontAwesomeIcon icon={faSort} />
                                </th>
                                <th scope="col" className="text-center">
                                    Ver Detalles
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {cotizacionesPags.map((cotizacion) => (
                                <tr key={cotizacion._id}>
                                    <td className="text-center">
                                        {cotizacion.titulo}
                                    </td>
                                    <td className="text-center">
                                        {cotizacion.cliente_id.nombre}
                                    </td>
                                    <td className="text-center">
                                        <div
                                            className={`${getEstado(cotizacion.estado)}`}
                                        >
                                            {cotizacion.estado}
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        {new Date(
                                            cotizacion.fecha_solicitud
                                        ).toLocaleDateString()}
                                    </td>
                                    <td className="text-center">
                                        <div
                                            className={`${getUrgencyClass(cotizacion.urgente)}`}
                                        >
                                            {cotizacion.urgente ? "Sí" : "No"}
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        <button
                                            className="thm-btn thm-btn-small btn-amarillo"
                                            onClick={() =>
                                                handleVerDetalles(
                                                    cotizacion._id
                                                )
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
                        className="form-select form-select-sm me-2"
                        onChange={handleChangeCantItems}
                        style={{ width: "70px" }}
                    >
                        <option value={5} selected>
                            5
                        </option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={cotizacionesOrdenadas.length}>
                            Todos
                        </option>
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
                    <span className="align-self-center mx-2">
                        Página {pagActual} de {totalPags || 1}
                    </span>
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

            {showModalDetalles && selectedId !== null && (
                <ModalVerCotizacion
                    show={showModalDetalles}
                    handleClose={() => setShowModalDetalles(false)}
                    cotizacionId={selectedId}
                />
            )}

            {showModalCrear && (
                <ModalAgregar
                    show={showModalCrear}
                    handleClose={() => {
                        setShowModalCrear(false);
                        setTimeout(() => getCotizaciones(), 50);
                    }}
                />
            )}
        </AdminLayout>
    );
};

export default VerCotizaciones;
