import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const ListadoServicios = () => {
    const [servicios, setServicios] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function getServicios() {
            try {
                const response = await axios.get(
                    "http://localhost:4000/api/servicios/"
                );

                if (Array.isArray(response.data)) {
                    const serviciosActivos = response.data.map((servicio) => ({
                        ...servicio,
                        imagen:
                            servicio.imagen || "https://placehold.co/600x400",
                    }));

                    setServicios(serviciosActivos);
                } else {
                    setServicios([]);
                }
            } catch (error) {
                console.error("Error obteniendo servicios:", error.message);
                setServicios([]);
            }
        }

        getServicios();
    }, []);
    function handleListadoServicios(id) {
        navigate(`/servicio/${id}`);
    }

    return (
        <div>
            <div className="container">
                <div className="section-title text-center">
                    <h2>Nuestros Servicios</h2>
                </div>
                <div>
                    {servicios.length > 0 && (
                        <div className="text-center mt-4">
                            <p className="fw-bold text-muted">
                                {servicios.map((servicio, index) => (
                                    <React.Fragment key={servicio._id}>
                                        <a
                                            href={`#servicio-${servicio._id}`}
                                            className="text-decoration-none mx-2 text-muted"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                document
                                                    .getElementById(
                                                        `servicio-${servicio._id}`
                                                    )
                                                    ?.scrollIntoView({
                                                        behavior: "smooth",
                                                        block: "start",
                                                    });
                                            }}
                                        >
                                            {servicio.nombre}
                                        </a>
                                        {index < servicios.length - 1 && (
                                            <span className="mx-1">
                                                &#9679;
                                            </span>
                                        )}
                                    </React.Fragment>
                                ))}
                            </p>
                        </div>
                    )}
                </div>
                <section className="services">
                    <div className="container d-flex flex-column align-items-center mt-5 gap-3 w-100">
                        {servicios.length > 0 ? (
                            servicios.map((servicio, index) => (
                                <div
                                    key={index}
                                    id={`servicio-${servicio._id}`}
                                    className={`service-card ${index % 2 !== 0 ? "reverse" : ""}`}
                                >
                                    <img
                                        src={servicio.imagen}
                                        alt="Servicio"
                                        onError={(e) => {
                                            e.target.src =
                                                "https://placehold.co/600x400";
                                        }}
                                    />
                                    <div>
                                        <h5 className="mb-1 services-title">
                                            <a
                                                onClick={() =>
                                                    handleListadoServicios(
                                                        servicio._id
                                                    )
                                                }
                                                className="text-decoration-none"
                                            >
                                                {servicio.nombre}
                                            </a>
                                        </h5>
                                        <p className="text-muted mb-1">
                                            {servicio.descripcion.length > 50
                                                ? servicio.descripcion.substring(
                                                      0,
                                                      50
                                                  ) + "..."
                                                : servicio.descripcion}
                                        </p>
                                        <button
                                            className="thm-btn thm-btn-small"
                                            onClick={() =>
                                                handleListadoServicios(
                                                    servicio._id
                                                )
                                            }
                                        >
                                            Ver más{" "}
                                            <FontAwesomeIcon
                                                icon={faArrowRight}
                                            />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center mt-4">
                                No hay servicios por mostrar
                            </p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ListadoServicios;
