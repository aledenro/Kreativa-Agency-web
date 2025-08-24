import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCallback } from "react";
import Navbar from "../components/Navbar/Navbar";
import Alert from "react-bootstrap/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowDown, faTrash } from "@fortawesome/free-solid-svg-icons";
import lodash from "lodash";
import fileUpload from "../utils/fileUpload";
import deleteFile from "../utils/fileDelete";
import sendEmail from "../utils/emailSender";

const VerDetalleProyecto = () => {
  const { id } = useParams();
  const [proyecto, setproyecto] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("danger");

  const fetchproyecto = useCallback(async () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user_name");

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/proyectos/id/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            user: user,
          },
        }
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
      fecha_envio: Date.now(),
    };

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user_name");

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/proyectos/agregarRespuesta/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            user: user,
          },
        }
      );

      const respuestaDb = response.data.respuesta;

      setAlertMessage("Respuesta enviada correctamente.");
      setAlertVariant("success");
      setShowAlert(true);

      if (
        files &&
        !lodash.isEmpty(files) &&
        respuestaDb &&
        !lodash.isEmpty(respuestaDb)
      ) {
        console.log("subiendo");
        await fileUploadErrorHandler(files, respuestaDb._id);

        console.log("subidos");
      }

      event.target.reset();
      fetchproyecto(id);
    } catch (error) {
      console.error(`Error al enviar la respuesta: ${error.message}`);
      setAlertMessage(
        "Error al enviar su respuesta, por favor intente de nuevo o contacte al soporte tecnico."
      );
      setAlertVariant("danger");
      setShowAlert(true);
      return;
    }

    try {
      const tipoUsuario = localStorage.getItem("tipo_usuario");

      if (tipoUsuario === "Cliente") {
        proyecto.colaboradores.forEach(async (colab) => {
          await sendEmail(
            colab.colaborador_id._id,
            `El cliente ha enviado una respuesta/feedback sobre el proyecto, ingrese para ver los detalless.`,
            `Actualización en el proyecto ${proyecto.nombre}`,
            "Ver",
            "login"
          );
        });
      } else {
        await sendEmail(
          proyecto.cliente_id,
          `Un colaborador de Kreativa Agency ha respondido a su proyecto, ingrese para ver los detalles.`,
          `Actualización en su proyecto ${proyecto.nombre}`,
          "Ver",
          "login"
        );
      }
    } catch (error) {
      console.error(`Error al enviar la notificacion: ${error.message}`);
      setAlertMessage(
        "Error al enviar la notificaión, por favor intente de nuevo o contacte al soporte tecnico."
      );
      setAlertVariant("danger");
      setShowAlert(true);
      return;
    }
  }

  const fileUploadErrorHandler = async (files, respuestaDbId) => {
    try {
      await fileUpload(files, "proyectos", proyecto._id, respuestaDbId);
    } catch (error) {
      console.error(`Error al subir los archivos: ${error.message}`);
      setAlertMessage(
        "Error al subir los archivos, por favor intente de nuevo o contacte al soporte tecnico."
      );
      setAlertVariant("danger");
      setShowAlert(true);
    }
  };

  const handleDelete = async (key) => {
    try {
      const msg = await deleteFile(key);

      if (msg) {
        setAlertMessage(msg);
        setAlertVariant("success");
        setShowAlert(true);
        fetchproyecto();
      }
    } catch (error) {
      setAlertMessage(error.message);
      setAlertVariant("danger");
      setShowAlert(true);
    }
  };

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
        <div className="mt-4">
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
            <h3 className="section-title text-center">{proyecto.nombre}</h3>
            <div className="row">
              <div className="col mx-3">
                <b>Fecha de Solicitud:</b>{" "}
                {new Date(proyecto.fecha_creacion).toLocaleDateString()}
              </div>
              <div className="col mx-3 text-end">
                <b>Fecha de Entrega:</b>{" "}
                {new Date(proyecto.fecha_entrega).toLocaleDateString()}
              </div>
            </div>
            <div className="row mt-4">
              <div className="col mx-3">
                <b>Estado:</b> {proyecto.estado}
              </div>
              <div className="col mx-3 text-end">
                <b>Urgente</b>: {proyecto.urgente ? "Si" : "No"}
              </div>
            </div>
            <div className="row mt-4">
              <div className="col mx-3">
                <b>Colaboradores Asignados:</b>{" "}
                {proyecto.colaboradores.map((colaborador) => (
                  <span key={colaborador.colaborador_id._id}>
                    <br />
                    {colaborador.colaborador_id.nombre}
                  </span>
                ))}
              </div>
            </div>

            <div className="my-4">
              <p className="detalles-text  py-3">{proyecto.descripcion}</p>
            </div>
          </div>
          <div className="row">
            <h3 className="section-title text-center">Respuestas</h3>
          </div>
          {proyecto.historial_respuestas.length > 0 ? (
            proyecto.historial_respuestas.map((respuesta) => (
              <div className="" key={respuesta._id}>
                <div className="coontainer respuesta mt-3">
                  <div className="contenido-respuesta">
                    <div className="row">
                      <div className="col me-5">
                        <h3 className="titulo-respuesta">
                          <b>{respuesta.usuario_id.nombre}</b>
                        </h3>
                      </div>
                      <div className="col ms-5 text-end">
                        <small>
                          {new Date(respuesta.fecha_envio).toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                    <p>{respuesta.contenido}</p>
                    {respuesta.files.map((file) => (
                      <span key={file.key}>
                        <a href={file.url} target="_blank">
                          <button className="btn btn-outline-info ms-3 my-1">
                            {file.fileName}{" "}
                            <FontAwesomeIcon icon={faFileArrowDown} />{" "}
                          </button>
                        </a>
                        {Date.now() -
                          new Date(respuesta.fecha_envio).getTime() <=
                        3600000 ? (
                          <button className="btn btn-danger">
                            <FontAwesomeIcon
                              icon={faTrash}
                              onClick={() => handleDelete(file.key)}
                            />
                          </button>
                        ) : (
                          ""
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>¡No hay respuestas todavía!</p>
          )}

          <div className="comment-form">
            <h3 className="section-title text-center">Responder:</h3>
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
                  <button type="submit" className="thm-btn form_btn">
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
