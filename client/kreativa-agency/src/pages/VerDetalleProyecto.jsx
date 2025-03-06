import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCallback } from "react";
import Navbar from "../components/Navbar/Navbar";
import Alert from "react-bootstrap/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import lodash from "lodash";
import fileUpload from "../utils/fileUpload";

const VerDetalleProyecto = () => {
    const { id } = useParams();
    const [proyecto, setproyecto] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertVariant, setAlertVariant] = useState("danger");

    const fetchproyecto = useCallback(async () => {
        try {
            const res = await axios.get(
                `http://localhost:4000/api/proyectos/id/${id}`
            );

            setproyecto(res.data.proyecto);
        } catch (error) {
            console.error("Error al obtener la proyecto: " + error.message);
        }
    }, [id]);

    useEffect(() => {
        fetchproyecto(id);
    }, [id, fetchproyecto]);

    async function handleSubmit(event) {
        event.preventDefault();

        const enviar = confirm("¿Desea enviar su respuesta?");

        if (!enviar) {
            return;
        }

        const formData = new FormData(event.target);
        const content = formData.get("message");
        const files = formData.getAll("filesUploaded");

        const user_id = localStorage.getItem("user_id");
        const data = {
            usuario_id: user_id,
            contenido: content,
            files: [],
        };

        try {
            const response = await axios.put(
                `http://localhost:4000/api/proyectos/agregarRespuesta/${id}`,
                data
            );

            const respuestaDb = response.data.respuesta;

            if (
                files &&
                !lodash.isEmpty(files) &&
                respuestaDb &&
                !lodash.isEmpty(respuestaDb)
            ) {
                console.log("subiendo");

                await fileUpload(
                    files,
                    "proyectos",
                    proyecto._id,
                    respuestaDb._id
                );
                console.log("subidos");
            }

            setAlertMessage("Respuesta enviada correctamente.");
            setAlertVariant("success");
            setShowAlert(true);
            event.target.reset();
            fetchproyecto(id);
        } catch (error) {
            console.error(`Error al enviar la respuesta: ${error.message}`);
            setAlertMessage(
                "Error al enviar su respuesta, por favor intente de nuevo o contacte al soporte tecnico."
            );
            setAlertVariant("danger");
            setShowAlert(true);
        }
    }

    if (!proyecto) {
        return (
            <div className="container d-flex align-items-center justify-content-center">
                <p>Cargando proyecto...</p>
            </div>
        );
    }

    return (
        <div>
            <Navbar></Navbar>
            <div className="container d-flex align-items-center justify-content-center">
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
                            {proyecto.nombre}
                        </h3>
                        <div className="row">
                            <div className="col mx-3">
                                Fecha de Solicitud:{" "}
                                <small>
                                    {new Date(
                                        proyecto.fecha_creacion
                                    ).toLocaleDateString()}
                                </small>
                            </div>
                            <div className="col mx-3 text-end">
                                Fecha de Entrega:{" "}
                                <small>
                                    {new Date(
                                        proyecto.fecha_entrega
                                    ).toLocaleDateString()}
                                </small>
                            </div>
                        </div>
                        <p className="detalles-text  my-3">
                            {proyecto.descripcion}
                        </p>
                    </div>
                    {proyecto.historial_respuestas.map((respuesta) => (
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
                                    {respuesta.files.map((file) => {
                                        <button className="btn thm-btn-small">
                                            {file.name}{" "}
                                            <FontAwesomeIcon icon={faFile} />
                                        </button>;
                                    })}
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
                                    <div className="mb-3">
                                        <input
                                            className="form-control"
                                            type="file"
                                            id="filesUploaded"
                                            name="filesUploaded"
                                            multiple
                                        />
                                    </div>
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

export default VerDetalleProyecto;
