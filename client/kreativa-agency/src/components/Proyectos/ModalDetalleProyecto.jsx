import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import Modal from "react-bootstrap/Modal";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tab from "react-bootstrap/Tab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowDown, faTrash } from "@fortawesome/free-solid-svg-icons";
import lodash from "lodash";
import fileUpload from "../../utils/fileUpload";
import deleteFile from "../../utils/fileDelete";
import sendEmail from "../../utils/emailSender";
// Importaciones nuevas para el Dragger
import { InboxOutlined } from "@ant-design/icons";
import { ConfigProvider, Upload, notification } from "antd";
import { useNavigate } from "react-router-dom";

const { Dragger } = Upload;

const ModalVerProyecto = ({ show, handleClose, proyectoId }) => {
    const [proyecto, setProyecto] = useState(null);
    const [activeTab, setActiveTab] = useState("detalles");
    const [files, setFiles] = useState([]);
    const [isHovered, setIsHovered] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Para notificaciones
    const [api, contextHolder] = notification.useNotification();

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    const showNotification = (type, message) => {
        api[type]({
            message: type === "success" ? "Éxito" : "Error",
            description: message,
            placement: "bottomRight",
            duration: 3,
        });
    };

    const fetchProyecto = useCallback(async () => {
        if (!proyectoId) return;

        const token = localStorage.getItem("token");

        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/proyectos/id/${proyectoId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setProyecto(res.data.proyecto);
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
            console.error("Error al obtener la proyecto");
        }
    }, [proyectoId]);

    useEffect(() => {
        if (show) {
            fetchProyecto();
        }
    }, [show, fetchProyecto]);

    const handleFileChange = (info) => {
        // Verificar archivos seleccionados
        if (info.fileList && info.fileList.length > 0) {
            const fileObjects = info.fileList.map((file) => file.originFileObj);
            setFiles(fileObjects);
        } else {
            setFiles([]);
        }
    };

    // Función para limpiar el dragger
    const clearDragger = () => {
        setFiles([]);
    };

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);

        const enviar = confirm("¿Desea enviar su respuesta?");

        if (!enviar) {
            setLoading(false);
            return;
        }

        const formData = new FormData(event.target);
        const content = formData.get("message");

        // Verificamos si hay archivos seleccionados
        const filesArray = files.filter((file) => file.name && file.size > 0);

        const user_id = localStorage.getItem("user_id");
        const data = {
            usuario_id: user_id,
            contenido: content,
            files: [],
            fecha_envio: Date.now(),
        };

        const token = localStorage.getItem("token");

        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/proyectos/agregarRespuesta/${proyectoId}`,
                data,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const respuestaDb = response.data.respuesta;

            if (
                filesArray.length > 0 &&
                respuestaDb &&
                !lodash.isEmpty(respuestaDb)
            ) {
                console.log("subiendo");
                await fileUploadErrorHandler(filesArray, respuestaDb._id);
                console.log("subidos");
            }

            // Limpieza
            event.target.reset();
            setFiles([]);
            clearDragger();
            showNotification("success", "Respuesta enviada correctamente.");
            fetchProyecto();
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
            showNotification(
                "error",
                "Error al enviar la respuesta, por favor intente de nuevo o contacte al soporte técnico."
            );
            return;
        } finally {
            setLoading(false);
        }

        try {
            const tipoUsuario = localStorage.getItem("tipo_usuario");

            if (tipoUsuario === "Cliente") {
                proyecto.colaboradores.forEach(async (colab) => {
                    await sendEmail(
                        colab.colaborador_id._id,
                        `El cliente ha enviado una respuesta/feedback sobre el proyecto, ingrese para ver los detalles.`,
                        `Actualización en el proyecto ${proyecto.nombre}`,
                        "Ver",
                        "test"
                    );
                });
            } else {
                await sendEmail(
                    proyecto.cliente_id,
                    `Un colaborador de Kreativa Agency ha respondido a su proyecto, ingrese para ver los detalles.`,
                    `Actualización en su proyecto ${proyecto.nombre}`,
                    "Ver",
                    "test"
                );
            }
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
            console.error(`Error al enviar la notificacion`);
            showNotification(
                "error",
                "Error al enviar la notificación, por favor intente de nuevo o contacte al soporte técnico."
            );
            return;
        }
    }

    const fileUploadErrorHandler = async (files, respuestaDbId) => {
        try {
            // Si no hay archivos, no hacemos nada
            if (!files || files.length === 0) {
                return;
            }

            await fileUpload(files, "proyectos", proyecto._id, respuestaDbId);
        } catch (error) {
            console.error(`Error al subir los archivos: ${error.message}`);
            showNotification(
                "error",
                "Error al subir los archivos, por favor intente de nuevo o contacte al soporte técnico."
            );
        }
    };

    const handleDelete = async (key) => {
        try {
            const msg = await deleteFile(key);

            if (msg) {
                showNotification("success", msg);
                fetchProyecto();
            }
        } catch (error) {
            showNotification("error", error.message);
        }
    };

    return (
        <Modal
            scrollable
            show={show}
            onHide={handleClose}
            size="xl"
            centered
            dialogClassName="proyecto-modal"
        >
            {contextHolder}
            <Modal.Header closeButton>
                <Modal.Title>
                    {proyecto?.nombre || "Detalles del Proyecto"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-0">
                {!proyecto ? (
                    <div className="text-center p-5">
                        <p>Cargando proyecto...</p>
                    </div>
                ) : (
                    <div className="proyecto-modal-content">
                        <Tab.Container
                            id="proyecto-tabs"
                            defaultActiveKey="detalles"
                        >
                            <div className="tabs-header border-bottom">
                                <Nav variant="tabs" className="flex-nowrap">
                                    <Nav.Item>
                                        <Nav.Link eventKey="detalles">
                                            Detalles
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="actualizaciones">
                                            Actualizaciones
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </div>

                            <Tab.Content>
                                <Tab.Pane eventKey="detalles">
                                    <div className="p-4">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h5 className="mb-0">
                                                Información del Proyecto
                                            </h5>
                                        </div>

                                        <div className="proyecto-info mb-4">
                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <div className="info-item">
                                                        <div className="text-muted mb-1">
                                                            Fecha de Solicitud
                                                        </div>
                                                        <div className="fw-medium">
                                                            {new Date(
                                                                proyecto.fecha_creacion
                                                            ).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="info-item">
                                                        <div className="text-muted mb-1">
                                                            Fecha de Entrega
                                                        </div>
                                                        <div className="fw-medium">
                                                            {new Date(
                                                                proyecto.fecha_entrega
                                                            ).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <div className="info-item">
                                                        <div className="text-muted mb-1">
                                                            Estado
                                                        </div>
                                                        <div className="estado-badge fw-medium">
                                                            <span
                                                                className={`badge ${
                                                                    proyecto.estado ===
                                                                    "Por Hacer"
                                                                        ? "badge badge-azul"
                                                                        : proyecto.estado ===
                                                                            "En Progreso"
                                                                          ? "badge-amarillo"
                                                                          : proyecto.estado ===
                                                                              "Finalizado"
                                                                            ? "badge-verde"
                                                                            : proyecto.estado ===
                                                                                "En Revisión"
                                                                              ? "badge-naranja"
                                                                              : proyecto.estado ===
                                                                                  "Cancelado"
                                                                                ? "badge-rojo"
                                                                                : "badge-gris"
                                                                }`}
                                                            >
                                                                {
                                                                    proyecto.estado
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="info-item">
                                                        <div className="text-muted mb-1">
                                                            Urgente
                                                        </div>
                                                        <div className="urgente-badge fw-medium">
                                                            <span
                                                                className={`badge ${proyecto.urgente ? "badge-rojo" : "badge-gris"}`}
                                                            >
                                                                {proyecto.urgente
                                                                    ? "Sí"
                                                                    : "No"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <div className="info-item">
                                                        <div className="text-muted mb-1">
                                                            Cliente
                                                        </div>
                                                        <div className="fw-medium">
                                                            {proyecto.cliente_id
                                                                ?.nombre || "-"}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="info-item">
                                                        <div className="text-muted mb-1">
                                                            Colaboradores
                                                            Asignados
                                                        </div>
                                                        <div className="fw-medium">
                                                            {proyecto
                                                                .colaboradores
                                                                .length > 0 ? (
                                                                <ul className="list-unstyled mb-0">
                                                                    {proyecto.colaboradores.map(
                                                                        (
                                                                            colaborador
                                                                        ) => (
                                                                            <li
                                                                                key={
                                                                                    colaborador
                                                                                        .colaborador_id
                                                                                        ._id
                                                                                }
                                                                            >
                                                                                {
                                                                                    colaborador
                                                                                        .colaborador_id
                                                                                        .nombre
                                                                                }
                                                                            </li>
                                                                        )
                                                                    )}
                                                                </ul>
                                                            ) : (
                                                                <span>
                                                                    Sin
                                                                    colaboradores
                                                                    asignados
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="descripcion-section">
                                            <h6 className="mb-2">
                                                Descripción
                                            </h6>
                                            <div className="descripcion-content p-3 bg-light rounded">
                                                {proyecto.descripcion ? (
                                                    <p className="mb-0">
                                                        {proyecto.descripcion}
                                                    </p>
                                                ) : (
                                                    <p className="text-muted mb-0">
                                                        Sin descripción
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Tab.Pane>

                                <Tab.Pane eventKey="actualizaciones">
                                    <Row className="g-0">
                                        <Col className="comentarios-panel p-4">
                                            <h5 className="mb-4">Respuestas</h5>

                                            {proyecto.historial_respuestas
                                                .length > 0 ? (
                                                <div className="comentarios-list">
                                                    {proyecto.historial_respuestas.map(
                                                        (respuesta) => (
                                                            <div
                                                                className="comentario-item mb-4 border-bottom pb-3"
                                                                key={
                                                                    respuesta._id
                                                                }
                                                            >
                                                                <div className="d-flex justify-content-between mb-2">
                                                                    <div className="usuario fw-bold">
                                                                        {
                                                                            respuesta
                                                                                .usuario_id
                                                                                .nombre
                                                                        }
                                                                    </div>
                                                                    <div className="fecha text-muted small">
                                                                        {new Date(
                                                                            respuesta.fecha_envio
                                                                        ).toLocaleDateString()}
                                                                    </div>
                                                                </div>
                                                                <div className="contenido mb-2">
                                                                    {
                                                                        respuesta.contenido
                                                                    }
                                                                </div>

                                                                {respuesta.files &&
                                                                    respuesta
                                                                        .files
                                                                        .length >
                                                                        0 && (
                                                                        <div className="archivos-adjuntos">
                                                                            {respuesta.files.map(
                                                                                (
                                                                                    file
                                                                                ) => (
                                                                                    <div
                                                                                        className="archivo-item d-inline-block me-2 mb-2"
                                                                                        key={
                                                                                            file.key
                                                                                        }
                                                                                    >
                                                                                        <a
                                                                                            href={
                                                                                                file.url
                                                                                            }
                                                                                            target="_blank"
                                                                                            rel="noopener noreferrer"
                                                                                            className="thm-btn thm-btn-small"
                                                                                        >
                                                                                            {file
                                                                                                .fileName
                                                                                                .length >
                                                                                            15
                                                                                                ? file.fileName.substring(
                                                                                                      0,
                                                                                                      12
                                                                                                  ) +
                                                                                                  "..."
                                                                                                : file.fileName}
                                                                                            <FontAwesomeIcon
                                                                                                icon={
                                                                                                    faFileArrowDown
                                                                                                }
                                                                                                className="ms-1"
                                                                                            />
                                                                                        </a>

                                                                                        {Date.now() -
                                                                                            new Date(
                                                                                                respuesta.fecha_envio
                                                                                            ).getTime() <=
                                                                                            3600000 && (
                                                                                            <button
                                                                                                className="thm-btn thm-btn-small btn-rojo ms-1"
                                                                                                onClick={() =>
                                                                                                    handleDelete(
                                                                                                        file.key
                                                                                                    )
                                                                                                }
                                                                                            >
                                                                                                <FontAwesomeIcon
                                                                                                    icon={
                                                                                                        faTrash
                                                                                                    }
                                                                                                />
                                                                                            </button>
                                                                                        )}
                                                                                    </div>
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    )}
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-muted">
                                                    No hay respuestas todavía.
                                                </div>
                                            )}

                                            <div className="responder-form mt-4">
                                                <form onSubmit={handleSubmit}>
                                                    <h6 className="mb-3">
                                                        Responder:
                                                    </h6>
                                                    <div className="form-group mb-3">
                                                        <textarea
                                                            name="message"
                                                            className="form-control form_input form-textarea"
                                                            rows="3"
                                                            placeholder="Por favor escriba su respuesta"
                                                            required
                                                        ></textarea>
                                                    </div>

                                                    {/* Implementación del Dragger */}
                                                    <div className="form-group mb-3">
                                                        <label className="form-label">
                                                            Archivos adjuntos
                                                        </label>
                                                        <ConfigProvider
                                                            theme={{
                                                                components: {
                                                                    Upload: {
                                                                        lineWidth:
                                                                            "1px",
                                                                        lineType:
                                                                            "solid",
                                                                        colorBorder:
                                                                            "#8788ab",
                                                                        colorBgContainer:
                                                                            "transparent",
                                                                    },
                                                                },
                                                            }}
                                                        >
                                                            <Dragger
                                                                name="filesUploaded"
                                                                multiple={true}
                                                                action="#"
                                                                beforeUpload={() =>
                                                                    false
                                                                }
                                                                onChange={
                                                                    handleFileChange
                                                                }
                                                                className="custom-dragger"
                                                                style={{
                                                                    borderRadius:
                                                                        "12px",
                                                                    borderColor:
                                                                        isHovered
                                                                            ? "#110d27"
                                                                            : "#8788ab",
                                                                    borderWidth:
                                                                        "1px",
                                                                    borderStyle:
                                                                        "solid",
                                                                    backgroundColor:
                                                                        "transparent",
                                                                    transition:
                                                                        "border-color 0.3s",
                                                                }}
                                                                onMouseEnter={
                                                                    handleMouseEnter
                                                                }
                                                                onMouseLeave={
                                                                    handleMouseLeave
                                                                }
                                                            >
                                                                <p className="ant-upload-drag-icon custom-icon">
                                                                    <InboxOutlined
                                                                        style={{
                                                                            color: isHovered
                                                                                ? "#110d27"
                                                                                : "#8788ab",
                                                                            transition:
                                                                                "color 0.3s",
                                                                        }}
                                                                    />
                                                                </p>
                                                                <p className="ant-upload-text">
                                                                    Haz clic o
                                                                    arrastra tus
                                                                    archivos
                                                                    aquí para
                                                                    subirlos
                                                                </p>
                                                                <p className="ant-upload-hint">
                                                                    Puedes subir
                                                                    múltiples
                                                                    archivos
                                                                </p>
                                                            </Dragger>
                                                        </ConfigProvider>
                                                    </div>

                                                    <div className="d-flex justify-content-end">
                                                        <button
                                                            type="submit"
                                                            className="thm-btn"
                                                            disabled={loading}
                                                        >
                                                            {loading
                                                                ? "Enviando..."
                                                                : "Enviar"}
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </Col>
                                    </Row>
                                </Tab.Pane>
                            </Tab.Content>
                        </Tab.Container>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <button className="thm-btn btn-gris" onClick={handleClose}>
                    Cerrar
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalVerProyecto;
