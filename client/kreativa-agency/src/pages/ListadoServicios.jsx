import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";

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
                    setServicios(response.data);
                } else {
                    setServicios([]);
                }
            } catch (error) {
                console.error(error.message);
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
            <Navbar></Navbar>
            <div className="container">
                <div className="section-title text-center">
                    <h2>Nuestros Servicios</h2>
                </div>
                <section className="services">
                    <div className="container">
                        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
                            {Array.isArray(servicios) &&
                            servicios.length > 0 ? (
                                servicios.map((servicio, index) => (
                                    <div key={index} className="col">
                                        <div className="services-card p-3 shadow-sm d-flex flex-column h-100">
                                            <div className="services-img">
                                                <img
                                                    src={
                                                        // servicio.imagen ||
                                                        "https://placehold.co/370x260"
                                                    }
                                                    alt={servicio.nombre}
                                                    className="img-fluid rounded"
                                                />
                                            </div>
                                            <div className="services-content mt-3 flex-grow-1">
                                                <h5 className="services-title">
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
                                                <p className="services-text text-muted">
                                                    {servicio.descripcion
                                                        .length > 50
                                                        ? servicio.descripcion.substring(
                                                              0,
                                                              50
                                                          ) + "..."
                                                        : servicio.descripcion}
                                                </p>
                                            </div>
                                            <div className="mt-auto">
                                                <a
                                                    className="services-arrow"
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
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center mt-4">
                                    No hay servicios disponibles
                                </p>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ListadoServicios;
