import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../components/Navbar/Navbar";

const DetalleServicio = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [servicio, setServicio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServicio = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:4000/api/servicios/${id}`
                );
                setServicio(response.data);
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

    const toggleEstadoServicio = async () => {
        if (!servicio) return;
        try {
            const endpoint = servicio.activo
                ? `http://localhost:4000/api/servicios/${id}/desactivar`
                : `http://localhost:4000/api/servicios/${id}/activar`;

            const response = await axios.put(endpoint);
            setServicio(response.data.servicio);
        } catch (err) {
            console.error(
                "Error al cambiar el estado del servicio:",
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
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="row my-4">
                            <div className="col-auto align-self-center">
                                <h1>{servicio.nombre}</h1>
                            </div>
                            <div className="col-lg text-end align-self-center">
                                <button
                                    className="thm-btn btn-editar thm-btn-small"
                                    type="button"
                                    onClick={() =>
                                        handleModificar(servicio._id)
                                    }
                                >
                                    Modificar
                                </button>
                                <button
                                    className={`thm-btn btn-eliminar thm-btn-small ${
                                        servicio.activo
                                            ? "thm-btn thm-btn-danger"
                                            : "thm-btn thm-btn-success"
                                    } ms-2`}
                                    type="button"
                                    onClick={toggleEstadoServicio}
                                >
                                    {servicio.activo ? "Desactivar" : "Activar"}
                                </button>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="row">
                                <img
                                    src="https://placehold.co/770x470"
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
                                            <p className="card-text">
                                                <strong>Precio:</strong> $
                                                {paquete.precio}
                                            </p>
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetalleServicio;
