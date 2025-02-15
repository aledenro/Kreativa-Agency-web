import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCallback } from "react";
import Navbar from "../components/Navbar/Navbar";

const VerDetalleCotizacion = () => {
    const { id } = useParams();
    const [cotizacion, setCotizacion] = useState(null);
    const opciones = ["Nuevo", "Aceptado", "Cancelado"];

    const fetchCotizacion = useCallback(async () => {
        try {
            const res = await axios.get(
                `http://localhost:4000/api/cotizaciones/id/${id}`
            );

            setCotizacion(res.data.cotizacion);
        } catch (error) {
            console.error("Error al obtener la cotizacion: " + error.message);
        }
    }, [id]);

    useEffect(() => {
        fetchCotizacion(id);
    }, [id, fetchCotizacion]);

    function handleSubmit(event) {
        event.preventDefault();

        const enviar = confirm("¿Desea enviar su respuesta?");

        if (!enviar) {
            return;
        }

        const formData = new FormData(event.target);
        const content = formData.get("message");

        const data = {
            usuario_id: "679834de23a11c303cf6c6b5",
            contenido: content,
        };

        try {
            axios.put(
                `http://localhost:4000/api/cotizaciones/agregarRespuesta/${id}`,
                data
            );

            alert("Respuesta enviada correctamente.");
            event.target.reset();
            fetchCotizacion(id);
        } catch (error) {
            console.error(`Error al enviar la respuesta: ${error.message}`);
            alert(
                "Error al enviar su respuesta, por favor intente de nuevo o contacte al soporte tecnico."
            );
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

        try {
            axios.put(
                `http://localhost:4000/api/cotizaciones/cambiarEstado/${id}`,
                { estado: estado }
            );
        } catch (error) {
            console.error(
                `Error al cambiar el estado de la cotizacion: ${error.message}`
            );
            alert(
                "Error al cambiar el estado de la cotizacion, por favor intente de nuevo o contacte al soporte tecnico."
            );
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
        <div>
            <Navbar></Navbar>
            <div className="container d-flex align-items-center justify-content-center">
                <div className="card p-4 shadow-lg w-50">
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
                                                {respuesta.usuario_id.nombre}
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
                                        className="form_input"
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
    );
};

export default VerDetalleCotizacion;
