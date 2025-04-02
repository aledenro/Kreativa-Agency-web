import { useEffect, useState } from "react";
import axios from "axios";
import lodash from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEye,
    faPencil,
    faToggleOn,
    faToggleOff,
    faBackward,
    faCaretLeft,
    faCaretRight,
    faForward,
    faSort,
    faPlus,
} from "@fortawesome/free-solid-svg-icons";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import { useNavigate } from "react-router-dom";

const GestionServicios = () => {
    const [servicios, setServicios] = useState([]);
    const [itemsPag, setItemsPag] = useState(5);
    const [pagActual, setPagActual] = useState(1);
    const [sortField, setSortField] = useState("nombre");
    const [sortOrder, setSortOrder] = useState("asc");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServicios = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:4000/api/servicios/"
                );
                if (Array.isArray(response.data)) {
                    setServicios(response.data);
                } else {
                    setServicios([]);
                }
            } catch (error) {
                console.error("Error al obtener los servicios:", error);
            }
        };

        fetchServicios();
    }, []);

    const handleVerServicio = (id) => {
        navigate(`/servicio/${id}`);
    };

    const handleModificarServicio = (id) => {
        navigate(`/servicio/modificar/${id}`);
    };

    const handleAgregarServicio = () => {
        navigate(`/servicio/agregar`);
    };

    const toggleEstadoServicio = async (id, estadoActual) => {
        try {
            const endpoint = estadoActual
                ? `http://localhost:4000/api/servicios/${id}/desactivar`
                : `http://localhost:4000/api/servicios/${id}/activar`;

            const response = await axios.put(endpoint);

            setServicios(
                servicios.map((servicio) =>
                    servicio._id === id
                        ? { ...servicio, activo: !estadoActual }
                        : servicio
                )
            );
        } catch (error) {
            console.error("Error al cambiar el estado del servicio:", error);
        }
    };

    const serviciosOrdenados = [...servicios].sort((a, b) => {
        let valueA = lodash.get(a, sortField);
        let valueB = lodash.get(b, sortField);

        if (
            sortField === "fecha_creacion" ||
            sortField === "fecha_modificacion"
        ) {
            return sortOrder === "asc"
                ? new Date(valueA) - new Date(valueB)
                : new Date(valueB) - new Date(valueA);
        }

        if (typeof valueA === "string" && typeof valueB === "string") {
            return sortOrder === "asc"
                ? valueA.localeCompare(valueB)
                : valueB.localeCompare(valueA);
        }

        return sortOrder === "asc"
            ? valueA > valueB
                ? 1
                : -1
            : valueB > valueA
              ? 1
              : -1;
    });

    const serviciosPaginados = serviciosOrdenados.slice(
        (pagActual - 1) * itemsPag,
        pagActual * itemsPag
    );

    const totalPags = Math.ceil(servicios.length / itemsPag);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    return (
        <AdminLayout>
            <div className="container mt-4">
                <div style={{ height: "90px" }}></div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1>Gestión de Servicios</h1>
                    <button className="thm-btn" onClick={handleAgregarServicio}>
                        <FontAwesomeIcon icon={faPlus} className="me-2" /> Nuevo
                        Servicio
                    </button>
                </div>
                <div className="table-responsive">
                    <table className="table kreativa-table">
                        <thead>
                            <tr>
                                <th
                                    onClick={() => handleSort("nombre")}
                                    style={{ cursor: "pointer" }}
                                >
                                    Nombre <FontAwesomeIcon icon={faSort} />
                                </th>
                                <th>Descripción</th>
                                <th
                                    onClick={() => handleSort("activo")}
                                    style={{ cursor: "pointer" }}
                                >
                                    Estado <FontAwesomeIcon icon={faSort} />
                                </th>
                                <th>Paquetes</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {serviciosPaginados.length > 0 ? (
                                serviciosPaginados.map((servicio) => (
                                    <tr key={servicio._id}>
                                        <td>{servicio.nombre}</td>
                                        <td>
                                            {servicio.descripcion &&
                                            servicio.descripcion.length > 50
                                                ? `${servicio.descripcion.substring(0, 50)}...`
                                                : servicio.descripcion}
                                        </td>
                                        <td>
                                            <span
                                                className={`badge ${servicio.activo ? "bg-success" : "bg-danger"}`}
                                            >
                                                {servicio.activo
                                                    ? "Activo"
                                                    : "Inactivo"}
                                            </span>
                                        </td>
                                        <td>
                                            {servicio.paquetes
                                                ? servicio.paquetes.length
                                                : 0}
                                        </td>
                                        <td className="acciones">
                                            <div className="botones-grupo">
                                                <button
                                                    className="thm-btn thm-btn-small btn-amarillo me-1"
                                                    onClick={() =>
                                                        handleVerServicio(
                                                            servicio._id
                                                        )
                                                    }
                                                    title="Ver detalle"
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faEye}
                                                    />
                                                </button>
                                                <button
                                                    className="thm-btn thm-btn-small btn-azul me-1"
                                                    onClick={() =>
                                                        handleModificarServicio(
                                                            servicio._id
                                                        )
                                                    }
                                                    title="Modificar"
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faPencil}
                                                    />
                                                </button>
                                                <button
                                                    className={`thm-btn thm-btn-small ${servicio.activo ? "btn-verde" : "btn-rojo"}`}
                                                    onClick={() =>
                                                        toggleEstadoServicio(
                                                            servicio._id,
                                                            servicio.activo
                                                        )
                                                    }
                                                    title={
                                                        servicio.activo
                                                            ? "Desactivar"
                                                            : "Activar"
                                                    }
                                                >
                                                    <FontAwesomeIcon
                                                        icon={
                                                            servicio.activo
                                                                ? faToggleOn
                                                                : faToggleOff
                                                        }
                                                    />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">
                                        No hay servicios disponibles
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="d-flex justify-content-center mt-4">
                    <select
                        className="form-select form-select-sm w-auto me-2"
                        onChange={(e) => {
                            setItemsPag(Number(e.target.value));
                            setPagActual(1);
                        }}
                        value={itemsPag}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={servicios.length}>Todos</option>
                    </select>
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
                        disabled={pagActual === totalPags || totalPags === 0}
                    >
                        <FontAwesomeIcon icon={faCaretRight} />
                    </button>
                    <button
                        className={`thm-btn btn-volver thm-btn-small me-2`}
                        onClick={() => setPagActual(totalPags)}
                        disabled={pagActual === totalPags || totalPags === 0}
                    >
                        <FontAwesomeIcon icon={faForward} />
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default GestionServicios;
