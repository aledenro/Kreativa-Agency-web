import ModificarPaqueteModal from "../pages/ModificarPaquete";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheck,
    faPencil,
    faToggleOff,
    faToggleOn,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../components/Navbar/Navbar";

const DetalleServicio = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [servicio, setServicio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const rol = localStorage.getItem("tipo_usuario");

    // modificar paquete
    const [showModal, setShowModal] = useState(false);
    const [paqueteSeleccionado, setPaqueteSeleccionado] = useState(null);

    useEffect(() => {
        const fetchServicio = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/servicios/${id}`
                );
                const servicioData = response.data;
                console.log("Servicio recibido:", servicioData.imagen);
                setServicio(servicioData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchServicio();
    }, [id]);

    function handleAgregarPaquete(id) {
        navigate(`/servicio/agregarPaquete/${id}`);
    }
    function handleModificar(id) {
        navigate(`/servicio/modificar/${id}`);
    }

    const handleModificarPaquete = (paquete) => {
        setPaqueteSeleccionado(paquete);
        setShowModal(true);
    };

    const toggleEstadoServicio = async () => {
        if (!servicio) return;
        try {
            const endpoint = servicio.activo
                ? `${import.meta.env.VITE_API_URL}/servicios/${id}/desactivar`
                : `${import.meta.env.VITE_API_URL}/servicios/${id}/activar`;

            const response = await axios.put(endpoint);
            setServicio(response.data.servicio);
        } catch (err) {
            console.error(
                "Error al cambiar el estado del servicio:",
                err.message
            );
        }
    };

    const toggleEstadoPaquete = async (paqueteId, estadoActual) => {
        if (!servicio) return;

        try {
            const endpoint = estadoActual
                ? `${import.meta.env.VITE_API_URL}/servicios/${id}/paquetes/${paqueteId}/desactivar`
                : `${import.meta.env.VITE_API_URL}/servicios/${id}/paquetes/${paqueteId}/activar`;

            const response = await axios.put(endpoint);

            setServicio(response.data);
        } catch (err) {
            console.error(
                "Error al cambiar el estado del paquete:",
                err.message
            );
        }
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!servicio) return <p>No se encontró el servicio.</p>;

    return (
        <div>
            <Navbar />
            <div className="container main-container mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="row my-4">
                            <div className="col-auto align-self-center">
                                <h1>{servicio.nombre}</h1>
                            </div>
                            {rol === "Administrador" ? (
                                <div className="col-lg text-end align-self-center">
                                    <button
                                        className="thm-btn btn-azul thm-btn-small"
                                        type="button"
                                        onClick={() =>
                                            handleModificar(servicio._id)
                                        }
                                    >
                                        <FontAwesomeIcon icon={faPencil} />
                                    </button>
                                    <button
                                        className={`thm-btn thm-btn-small ${
                                            servicio.activo
                                                ? "btn-verde"
                                                : "btn-rojo"
                                        } ms-2`}
                                        type="button"
                                        onClick={toggleEstadoServicio}
                                    >
                                        {servicio.activo ? (
                                            <FontAwesomeIcon
                                                icon={faToggleOn}
                                            />
                                        ) : (
                                            <FontAwesomeIcon
                                                icon={faToggleOff}
                                            />
                                        )}
                                    </button>
                                </div>
                            ) : (
                                ""
                            )}
                        </div>
                        <div className="col-12">
                            <div className="row">
                                <img
                                    src={
                                        servicio.imagen ||
                                        "https://placehold.co/770x470"
                                    }
                                    alt="Imagen del servicio"
                                    className="img-fluid"
                                />
                            </div>
                        </div>

                        <p className="mt-4">{servicio.descripcion}</p>

                        <div className="justify-content-center">
                            <div className="row mb-3 mt-4">
                                <div className="col-12">
                                    <div className="row justify-content-between">
                                        <div className="col align-self-center">
                                            <h3>Paquetes disponibles</h3>
                                        </div>
                                        {rol === "Administrador" ? (
                                            <div className="col text-end align-self-center">
                                                <button
                                                    className="thm-btn thm-btn-small"
                                                    type="button"
                                                    onClick={() =>
                                                        handleAgregarPaquete(
                                                            servicio._id
                                                        )
                                                    }
                                                >
                                                    Agregar Paquete
                                                </button>
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row row-cols-1 row-cols-lg-2 g-4">
                            {servicio.paquetes.map((paquete) => (
                                <div key={paquete._id} className="col">
                                    <div className="card mb-3">
                                        <div className="card-body">
                                            <div className="row justify-content-between">
                                                <div className="col">
                                                    <h5 className="card-title">
                                                        {paquete.nombre}
                                                    </h5>
                                                </div>
                                                <div className="col text-end">
                                                    <h6 className="card-subtitle mb-2 text-muted">
                                                        Nivel: {paquete.nivel}
                                                    </h6>
                                                </div>
                                            </div>
                                            <p className="card-text">
                                                {paquete.descripcion}
                                            </p>
                                            <p>
                                                <strong>Duración:</strong>{" "}
                                                {paquete.duracion}
                                            </p>
                                            <p>
                                                <strong>Beneficios:</strong>
                                            </p>
                                            <ul className="list-unstyled">
                                                {paquete.beneficios.map(
                                                    (beneficio, i) => (
                                                        <li
                                                            key={i}
                                                            className="d-flex align-items-center"
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={faCheck}
                                                                className="pink-icon"
                                                            />
                                                            {beneficio}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                            <div className="row">
                                                <div className="col">
                                                    <p className="card-text">
                                                        <strong>Precio:</strong>{" "}
                                                        ${paquete.precio}
                                                    </p>
                                                </div>
                                                {rol === "Administrador" ? (
                                                    <div className="col text-end">
                                                        <div
                                                            className="btn-group"
                                                            role="group"
                                                        >
                                                            <button
                                                                className="thm-btn thm-btn-small btn-azul"
                                                                onClick={() =>
                                                                    handleModificarPaquete(
                                                                        paquete
                                                                    )
                                                                }
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        faPencil
                                                                    }
                                                                />
                                                            </button>
                                                            <button
                                                                className={`thm-btn thm-btn-small ${
                                                                    paquete.activo
                                                                        ? "btn-verde"
                                                                        : "btn-rojo"
                                                                }`}
                                                                onClick={() =>
                                                                    toggleEstadoPaquete(
                                                                        paquete._id,
                                                                        paquete.activo
                                                                    )
                                                                }
                                                            >
                                                                {paquete.activo ? (
                                                                    <FontAwesomeIcon
                                                                        icon={
                                                                            faToggleOn
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <FontAwesomeIcon
                                                                        icon={
                                                                            faToggleOff
                                                                        }
                                                                    />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    ""
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {servicio.paquetes.length === 0 && (
                            <p className="mt-3">
                                Este servicio no tiene paquetes por mostrar.
                            </p>
                        )}

                        {paqueteSeleccionado && (
                            <ModificarPaqueteModal
                                show={showModal}
                                handleClose={() => setShowModal(false)}
                                paquete={paqueteSeleccionado}
                                servicioId={servicio._id}
                                actualizarServicio={setServicio}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetalleServicio;
