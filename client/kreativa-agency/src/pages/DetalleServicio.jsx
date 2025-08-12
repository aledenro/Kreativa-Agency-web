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
import Footer from "../components/Navbar/Footer";
import Loading from "../components/ui/LoadingComponent.jsx";

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
            const token = localStorage.getItem("token");
            const user = localStorage.getItem("user_name");

            if (!token) {
                navigate("/error", {
                    state: {
                        errorCode: 401,
                        mensaje: "Debe iniciar sesión para continuar.",
                    },
                });
            }

            const response = await axios.put(
                endpoint,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        user: user,
                    },
                }
            );
            setServicio(response.data.servicio);
        } catch (err) {
            if (err.status === 401) {
                navigate("/error", {
                    state: {
                        errorCode: 401,
                        mensaje: "Debe volver a iniciar sesión para continuar.",
                    },
                });
                return;
            }
            console.error("Error al cambiar el estado del servicio");
        }
    };

    const toggleEstadoPaquete = async (paqueteId, estadoActual) => {
        if (!servicio) return;

        try {
            const endpoint = estadoActual
                ? `${import.meta.env.VITE_API_URL}/servicios/${id}/paquetes/${paqueteId}/desactivar`
                : `${import.meta.env.VITE_API_URL}/servicios/${id}/paquetes/${paqueteId}/activar`;

            const token = localStorage.getItem("token");
            const user = localStorage.getItem("user_name");

            if (!token) {
                navigate("/error", {
                    state: {
                        errorCode: 401,
                        mensaje: "Debe iniciar sesión para continuar.",
                    },
                });
            }

            const response = await axios.put(
                endpoint,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        user: user,
                    },
                }
            );

            setServicio(response.data);
        } catch (err) {
            if (err.status === 401) {
                navigate("/error", {
                    state: {
                        errorCode: 401,
                        mensaje: "Debe volver a iniciar sesión para continuar.",
                    },
                });
                return;
            }
            console.error("Error al cambiar el estado del paquete");
        }
    };

    if (loading) {
        return (
            <Navbar>
                <div className="container main-container mt-4">
                    <Loading />
                </div>
            </Navbar>
        );
    }

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!servicio) return <p>No se encontró el servicio.</p>;

    const paquetesActivos = servicio.paquetes.filter(
        (paquete) => paquete.activo === true
    );

    return (
        <div>
            <Navbar />
            <div className="container main-container mt-4">
                <div className="espacio-top-responsive"></div>
                <div className="row justify-content-center">
                    <div className="col-md-8 mb-4">
                        <div className="row my-4">
                            <div className="col-auto align-self-center">
                                <h1>{servicio.nombre}</h1>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="position-relative">
                                <img
                                    src={
                                        servicio.imagen ||
                                        "https://placehold.co/770x470"
                                    }
                                    alt="Imagen del servicio"
                                    className="img-fluid"
                                />

                                <img
                                    src="https://kreativa-public.s3.us-east-2.amazonaws.com/landing/img/76.svg"
                                    alt=""
                                    className="doodle-servicio-left"
                                />

                                <img
                                    src="https://kreativa-public.s3.us-east-2.amazonaws.com/landing/img/104.svg"
                                    className="doodle-servicio-right"
                                />
                            </div>
                        </div>

                        <p className="mt-4">{servicio.descripcion}</p>

                        {/* Solo mostrar la sección de paquetes si hay paquetes activos */}
                        {paquetesActivos.length > 0 && (
                            <>
                                <div className="justify-content-center">
                                    <div className="row mb-3 mt-4">
                                        <div className="col-12">
                                            <div className="row justify-content-between">
                                                <div className="col align-self-center">
                                                    <h3>
                                                        Paquetes disponibles
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row row-cols-1 g-3 g-lg-4">
                                    {paquetesActivos.map((paquete) => (
                                        <div
                                            key={paquete._id}
                                            className="col h-100 d-flex"
                                        >
                                            <div className="card mb-2 card-paquete w-100">
                                                <div className="card-body">
                                                    <div className="row justify-content-between">
                                                        <div className="col">
                                                            <h5 className="card-title">
                                                                {paquete.nombre}
                                                            </h5>
                                                        </div>
                                                        <div className="col text-end">
                                                            <h6 className="card-subtitle mb-2 text-muted">
                                                                Nivel:{" "}
                                                                {paquete.nivel}
                                                            </h6>
                                                        </div>
                                                    </div>
                                                    <p className="card-text">
                                                        {paquete.descripcion}
                                                    </p>
                                                    <p>
                                                        <strong>
                                                            Duración:
                                                        </strong>{" "}
                                                        {paquete.duracion}
                                                    </p>
                                                    <p>
                                                        <strong>
                                                            Beneficios:
                                                        </strong>
                                                    </p>
                                                    <ul className="list-unstyled">
                                                        {paquete.beneficios.map(
                                                            (beneficio, i) => (
                                                                <li
                                                                    key={i}
                                                                    className="d-flex align-items-center"
                                                                >
                                                                    <FontAwesomeIcon
                                                                        icon={
                                                                            faCheck
                                                                        }
                                                                        className="check-icon"
                                                                        style={{
                                                                            marginRight:
                                                                                "10px",
                                                                        }}
                                                                    />
                                                                    {beneficio}
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                    <div className="row">
                                                        <div className="col">
                                                            {paquete.precio !==
                                                                null &&
                                                                paquete.precio !==
                                                                    undefined && (
                                                                    <p className="card-text">
                                                                        <strong>
                                                                            Precio:
                                                                        </strong>{" "}
                                                                        $
                                                                        {
                                                                            paquete.precio
                                                                        }
                                                                    </p>
                                                                )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DetalleServicio;
