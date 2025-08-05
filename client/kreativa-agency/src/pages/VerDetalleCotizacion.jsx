import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback } from "react";
import Alert from "react-bootstrap/Alert";
import AdminLayout from "../components/AdminLayout/AdminLayout";

const VerDetalleCotizacion = () => {
    const { id } = useParams();
    const [cotizacion, setCotizacion] = useState(null);
    const opciones = ["Nuevo", "Aceptado", "Cancelado"];
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertVariant, setAlertVariant] = useState("danger");
    const navigate = useNavigate();

    const fetchCotizacion = useCallback(async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/error", {
                state: {
                    errorCode: 401,
                    mensaje: "Acceso no autorizado.",
                },
            });
            return;
        }

        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/cotizaciones/id/${id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setCotizacion(res.data.cotizacion);
        } catch (error) {
            if (error.status === 401) {
                localStorage.clear();
                navigate("/error", {
                    state: {
                        errorCode: 401,
                        mensaje: "Debe volver a iniciar sesión para continuar.",
                    },
                });

                return;
            }
            console.error("Error al obtener la cotizacion");
        }
    }, [id]);

    useEffect(() => {
        fetchCotizacion(id);
    }, [id, fetchCotizacion]);

    async function handleSubmit(event) {
        event.preventDefault();

        const enviar = confirm("¿Desea enviar su respuesta?");

        if (!enviar) {
            return;
        }

        const formData = new FormData(event.target);
        const content = formData.get("message");

        const user_id = localStorage.getItem("user_id");
        const data = {
            usuario_id: user_id,
            contenido: content,
        };
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/error", {
                state: {
                    errorCode: 401,
                    mensaje: "Acceso no autorizado.",
                },
            });
            return;
        }

        try {
            await axios.put(
                `${import.meta.env.VITE_API_URL}/cotizaciones/agregarRespuesta/${id}`,
                data,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setAlertMessage("Respuesta enviada correctamente.");
            setAlertVariant("success");
            setShowAlert(true);
            event.target.reset();
            fetchCotizacion(id);
        } catch (error) {
            if (error.status === 401) {
                localStorage.clear();
                navigate("/error", {
                    state: {
                        errorCode: 401,
                        mensaje: "Debe volver a iniciar sesión para continuar.",
                    },
                });

                return;
            }
            console.error(`Error al enviar la respuesta`);
            setAlertMessage(
                "Error al enviar su respuesta, por favor intente de nuevo o contacte al soporte tecnico."
            );
            setAlertVariant("danger");
            setShowAlert(true);
        }
    }

    function renderOpciones(opcion, cotizacionEstado) {
        if (opcion === cotizacionEstado) {
            return (
                <option value={opcion} selected>
                    {opcion}
                </option>
            );
        } else {
            return <option value={opcion}>{opcion}</option>;
        }
    }

    function handleChangeEstado(event) {
        const estado = event.target.value;
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/error", {
                state: {
                    errorCode: 401,
                    mensaje: "Acceso no autorizado.",
                },
            });
            return;
        }

        try {
            axios.put(
                `${import.meta.env.VITE_API_URL}/cotizaciones/cambiarEstado/${id}`,
                { estado: estado },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setAlertMessage("Estado cambiado  correctamente.");
            setAlertVariant("success");
            setShowAlert(true);
        } catch (error) {
            if (error.status === 401) {
                localStorage.clear();
                navigate("/error", {
                    state: {
                        errorCode: 401,
                        mensaje: "Debe volver a iniciar sesión para continuar.",
                    },
                });

                return;
            }
            console.error(`Error al cambiar el estado de la cotizacion`);
            setAlertMessage(
                "Error al cambiar el estado de la cotizacion, por favor intente de nuevo o contacte al soporte tecnico."
            );
            setAlertVariant("danger");
            setShowAlert(true);
        }
    }

    if (!cotizacion) {
        return (
            <div className="container d-flex align-items-center justify-content-center">
                <p>Cargando cotización...</p>
            </div>
        );
    }

    return (
        <AdminLayout>
            <div>
                <div className="container d-flex align-items-center justify-content-center mt-8">
                    <div className="card p-4 shadow-lg w-50">
                        {showAlert && (
                            <Alert
                                variant={alertVariant}
                                onClose={() => setShowAlert(false)}
                                dismissible
                            >
                                {alertMessage}
                            </Alert>
                        )}
                        <div className="row">
                            <h3 className="section-title text-center">
                                {cotizacion.titulo}
                            </h3>
                            <div className="row">
                                <div className="col mx-3">
                                    Fecha de Solicitud:{" "}
                                    <small>
                                        {new Date(
                                            cotizacion.fecha_solicitud
                                        ).toLocaleDateString()}
                                    </small>
                                </div>
                                <div className="col mx-3">
                                    <select
                                        className="form-select"
                                        onChange={handleChangeEstado}
                                    >
                                        {opciones.map((opcion) =>
                                            renderOpciones(
                                                opcion,
                                                cotizacion.estado
                                            )
                                        )}
                                    </select>
                                </div>
                            </div>
                            <p className="detalles-text  my-3">
                                {cotizacion.detalles}
                            </p>
                        </div>
                        {cotizacion.historial_respuestas.map((respuesta) => (
                            <div className="" key={respuesta._id}>
                                <hr />
                                <div className="respuesta">
                                    <div className="contenido-respuesta">
                                        <div className="row">
                                            <div className="col me-5">
                                                <h3 className="titulo-respuesta">
                                                    {
                                                        respuesta.usuario_id
                                                            .nombre
                                                    }
                                                </h3>
                                            </div>
                                            <div className="col ms-5">
                                                <small>
                                                    {new Date(
                                                        respuesta.fecha_envio
                                                    ).toLocaleDateString()}
                                                </small>
                                            </div>
                                        </div>
                                        <p>{respuesta.contenido}</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="comment-form">
                            <h3 className="section-title text-center">
                                Responder:
                            </h3>
                            <form onSubmit={handleSubmit} method="post">
                                <div className="row">
                                    <div className="mb-3">
                                        <textarea
                                            name="message"
                                            placeholder="Por favor escriba su respuesta"
                                            className="form_input form-textarea"
                                            required
                                        ></textarea>
                                        <button
                                            type="submit"
                                            className="thm-btn form_btn"
                                        >
                                            Enviar
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default VerDetalleCotizacion;
