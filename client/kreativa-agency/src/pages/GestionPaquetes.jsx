import React, { useState, useEffect } from "react";
import { Dropdown, Modal } from "react-bootstrap";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
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
import { notification } from "antd";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import { useNavigate } from "react-router-dom";
import TablaPaginacion from "../components/ui/TablaPaginacion";

const GestionPaquetes = () => {
    const [servicios, setServicios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [api, contextHolder] = notification.useNotification();
    const [itemsPag, setItemsPag] = useState(5);
    const [pagActual, setPagActual] = useState(1);
    const [sortField, setSortField] = useState("nombre");
    const [sortOrder, setSortOrder] = useState("asc");
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [selectedPaquete, setSelectedPaquete] = useState(null);
    const [modalAction, setModalAction] = useState("");

    const openErrorNotification = (message) => {
        api.error({
            message: "Error",
            description: message,
            placement: "bottomRight",
            duration: 4,
        });
    };

    useEffect(() => {
        const fetchServicios = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/servicios`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setServicios(response.data);
            } catch (err) {
                setError("Error al cargar los servicios: " + err.message);
                openErrorNotification("No se pudieron cargar los servicios.");
            } finally {
                setLoading(false);
            }
        };

        fetchServicios();
    }, []);

    const obtenerTodosLosPaquetes = () => {
        const todosPaquetes = [];

        servicios.forEach((servicio) => {
            if (servicio.paquetes && servicio.paquetes.length > 0) {
                servicio.paquetes.forEach((paquete) => {
                    todosPaquetes.push({
                        ...paquete,
                        servicioId: servicio._id,
                        servicioNombre: servicio.nombre,
                    });
                });
            }
        });

        return todosPaquetes;
    };

    const confirmToggleEstadoPaquete = (
        servicioId,
        paqueteId,
        estadoActual
    ) => {
        setSelectedPaquete({ servicioId, paqueteId, estadoActual });
        setModalAction(estadoActual ? "desactivar" : "activar");
        setShowModal(true);
    };

    const toggleEstadoPaquete = async () => {
        if (!selectedPaquete) return;

        const { servicioId, paqueteId, estadoActual } = selectedPaquete;

        try {
            const endpoint = estadoActual
                ? `${import.meta.env.VITE_API_URL}/servicios/${servicioId}/paquetes/${paqueteId}/desactivar`
                : `${import.meta.env.VITE_API_URL}/servicios/${servicioId}/paquetes/${paqueteId}/activar`;

            const token = localStorage.getItem("token");

            const response = await axios.put(endpoint, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setServicios((prevServicios) =>
                prevServicios.map((servicio) => {
                    if (servicio._id === servicioId) {
                        return response.data;
                    }
                    return servicio;
                })
            );
            setShowModal(false);
        } catch (err) {
            console.error(
                "Error al cambiar el estado del paquete:",
                err.message
            );
            openErrorNotification("Error al cambiar el estado del paquete.");
            setShowModal(false);
        }
    };

    const handleEditarPaquete = (paquete) => {
        navigate(`/paquete/modificar/${paquete.servicioId}/${paquete._id}`);
    };

    const handleAgregarPaqueteAServicio = (servicioId) => {
        navigate(`/servicio/agregarPaquete/${servicioId}`);
    };

    const handlePaquete = (servicioId) => {
        navigate(`/servicio/${servicioId}`);
    };

    const paquetes = obtenerTodosLosPaquetes();

    const paquetesOrdenados = [...paquetes].sort((a, b) => {
        let valueA = a[sortField];
        let valueB = b[sortField];

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

    const paquetesPaginados = paquetesOrdenados.slice(
        (pagActual - 1) * itemsPag,
        pagActual * itemsPag
    );

    const totalPags = Math.ceil(paquetes.length / itemsPag);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    return (
        <div>
            <AdminLayout>
                <div className="container mt-4">
                    {contextHolder}
                    <div style={{ height: "90px" }}></div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1>Gestión de Paquetes</h1>
                        <Dropdown>
                            <style>
                                {`
                                .thm-btn:hover {
                                    border-color: #ff0072 !important;
                                }
                                    .thm-btn:active {
                                    background-color: transparent !important;
                            `}
                            </style>
                            <Dropdown.Toggle
                                className="thm-btn"
                                id="dropdown-servicios"
                            >
                                <FontAwesomeIcon
                                    icon={faPlus}
                                    className="me-2"
                                />{" "}
                                Nuevo Paquete
                            </Dropdown.Toggle>

                            <Dropdown.Menu
                                style={{
                                    backgroundColor: "white",
                                }}
                            >
                                <style>
                                    {`
                                    .dropdown-item:active {
                                        background-color: #ff0072 !important;
                                    }
                                    .dropdown-item:hover {
                                        background-color: #ffebf4 !important;
                                        color: #ff0072
                                    }
                                `}
                                </style>
                                {servicios.length > 0 ? (
                                    servicios.map((servicio) => (
                                        <Dropdown.Item
                                            key={servicio._id}
                                            onClick={() =>
                                                handleAgregarPaqueteAServicio(
                                                    servicio._id
                                                )
                                            }
                                            style={{
                                                color: "#110d27",
                                                backgroundColor: "white",
                                            }}
                                        >
                                            {servicio.nombre}
                                        </Dropdown.Item>
                                    ))
                                ) : (
                                    <Dropdown.Item
                                        disabled
                                        style={{ backgroundColor: "white" }}
                                    >
                                        No hay servicios disponibles
                                    </Dropdown.Item>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <div className="table-responsive-xxl">
                        <table className="table kreativa-proyecto-table">
                            <thead>
                                <tr>
                                    <th
                                        onClick={() =>
                                            handleSort("servicioNombre")
                                        }
                                        style={{ cursor: "pointer" }}
                                    >
                                        Servicio{" "}
                                        <FontAwesomeIcon icon={faSort} />
                                    </th>
                                    <th
                                        onClick={() => handleSort("nombre")}
                                        style={{ cursor: "pointer" }}
                                    >
                                        Nombre <FontAwesomeIcon icon={faSort} />
                                    </th>

                                    <th
                                        onClick={() => handleSort("nivel")}
                                        style={{ cursor: "pointer" }}
                                    >
                                        Nivel <FontAwesomeIcon icon={faSort} />
                                    </th>
                                    <th
                                        onClick={() => handleSort("precio")}
                                        style={{ cursor: "pointer" }}
                                    >
                                        Precio <FontAwesomeIcon icon={faSort} />
                                    </th>
                                    <th
                                        onClick={() => handleSort("duracion")}
                                        style={{ cursor: "pointer" }}
                                    >
                                        Duración{" "}
                                        <FontAwesomeIcon icon={faSort} />
                                    </th>
                                    <th
                                        onClick={() => handleSort("activo")}
                                        style={{ cursor: "pointer" }}
                                    >
                                        Estado <FontAwesomeIcon icon={faSort} />
                                    </th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paquetesPaginados.length > 0 ? (
                                    paquetesPaginados.map((paquete) => (
                                        <tr key={paquete._id}>
                                            <td
                                                style={{ cursor: "pointer" }}
                                                onClick={() =>
                                                    handlePaquete(
                                                        paquete.servicioId
                                                    )
                                                }
                                            >
                                                {paquete.servicioNombre ||
                                                    "Sin servicio asignado"}
                                            </td>
                                            <td>{paquete.nombre}</td>
                                            <td>{paquete.nivel}</td>
                                            <td>${paquete.precio}</td>
                                            <td>{paquete.duracion}</td>
                                            <td>
                                                <span
                                                    className={`badge ${paquete.activo ? "badge-verde" : "badge-rojo"}`}
                                                >
                                                    {paquete.activo
                                                        ? "Activo"
                                                        : "Inactivo"}
                                                </span>
                                            </td>
                                            <td className="acciones">
                                                <div className="botones-grupo">
                                                    <button
                                                        className="thm-btn thm-btn-small btn-azul me-1"
                                                        onClick={() =>
                                                            handleEditarPaquete(
                                                                paquete
                                                            )
                                                        }
                                                        title="Modificar"
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faPencil}
                                                        />
                                                    </button>
                                                    <button
                                                        className={`thm-btn thm-btn-small ${paquete.activo ? "btn-verde" : "btn-rojo"}`}
                                                        onClick={() =>
                                                            confirmToggleEstadoPaquete(
                                                                paquete.servicioId,
                                                                paquete._id,
                                                                paquete.activo
                                                            )
                                                        }
                                                        title={
                                                            paquete.activo
                                                                ? "Desactivar"
                                                                : "Activar"
                                                        }
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={
                                                                paquete.activo
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
                                        <td colSpan="7" className="text-center">
                                            No hay paquetes disponibles
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <TablaPaginacion
                        totalItems={paquetes.length}
                        itemsPorPagina={itemsPag}
                        paginaActual={pagActual}
                        onItemsPorPaginaChange={(cant) => {
                            setItemsPag(cant);
                            setPagActual(1);
                        }}
                        onPaginaChange={(pagina) => setPagActual(pagina)}
                    />

                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirmar Acción</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            ¿Seguro que desea {modalAction} este paquete?
                        </Modal.Body>
                        <Modal.Footer>
                            <button
                                className="thm-btn thm-btn-small btn-rojo"
                                onClick={() => setShowModal(false)}
                            >
                                No
                            </button>
                            <button
                                className="thm-btn thm-btn-small"
                                onClick={toggleEstadoPaquete}
                            >
                                Sí
                            </button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </AdminLayout>
        </div>
    );
};

export default GestionPaquetes;
