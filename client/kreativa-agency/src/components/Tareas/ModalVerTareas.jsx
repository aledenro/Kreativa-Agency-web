import axios from "axios";
import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tab from "react-bootstrap/Tab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH, faPencil } from "@fortawesome/free-solid-svg-icons";
import lodash from "lodash";
import { notification } from "antd";
import PropTypes from "prop-types";

const ModalVerTareas = ({ tareaModal, show, handleClose }) => {
    const [tarea, setTarea] = useState(tareaModal);
    const [error, setError] = useState("");
    const [editando, setEditando] = useState(false);
    const [commentEdit, setCommentEdit] = useState({});
    const [activeTab, setActiveTab] = useState("detalles");
    const [api, contextHolder] = notification.useNotification();
    const user_id = localStorage.getItem("user_id");
    const [contenido, setContenido] = useState("");

    useEffect(() => {
        if (show && !lodash.isEmpty(tareaModal)) {
            setTarea(tareaModal);
        }
    }, [tareaModal, show]);

    const showNotification = (type, message) => {
        api[type]({
            message: type === "success" ? "Éxito" : "Error",
            description: message,
            placement: "bottomRight",
            duration: 4,
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCommentEdit((prevCommentEdit) => ({
            ...prevCommentEdit,
            [name]: value,
        }));

        setContenido(e.target.value);
    };

    const handleAddCommentario = async (event) => {
        event.preventDefault();
        const content = event.target.contenido.value;

        if (lodash.isEmpty(content)) {
            setError("Debe ingresar un comentario antes de enviar.");
            setTimeout(() => {
                setError("");
            }, 2500);
            return;
        }

        const url = `${import.meta.env.VITE_API_URL}/tareas/comment/${editando ? "edit/" : ""}`;
        const data = editando
            ? commentEdit
            : {
                  usuario_id: user_id,
                  contenido: content,
                  fecha: Date.now(),
              };

        try {
            const response = await axios.put(`${url}${tarea._id}`, data);

            if (response.status === 200) {
                showNotification(
                    "success",
                    "Comentario enviado correctamente."
                );
                setTarea(response.data);
                if (editando) {
                    setCommentEdit({});
                    setEditando(false);
                }
                setContenido("");
            }
        } catch (error) {
            console.error(error.message);
            showNotification("error", "Error al enviar su comentario.");
        }
    };

    return (
        <Modal
            show={show && !lodash.isEmpty(tarea)}
            onHide={handleClose}
            size="xl"
            centered
            dialogClassName="proyecto-modal"
        >
            {contextHolder}
            <Modal.Header closeButton>
                <Modal.Title>
                    {tarea?.nombre || "Detalles de la Tarea"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-0">
                {!tarea ? (
                    <div className="text-center p-5">
                        <p>Cargando tarea...</p>
                    </div>
                ) : (
                    <div className="proyecto-modal-content">
                        <Tab.Container
                            id="tarea-tabs"
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
                                        <Nav.Link eventKey="comentarios">
                                            Comentarios
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </div>

                            <Tab.Content>
                                <Tab.Pane eventKey="detalles">
                                    <div className="p-4">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h5 className="mb-0">
                                                Información de la Tarea
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
                                                            {tarea.fecha_creacion
                                                                ? new Date(
                                                                      tarea.fecha_creacion
                                                                  ).toLocaleDateString()
                                                                : "-"}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="info-item">
                                                        <div className="text-muted mb-1">
                                                            Fecha de Entrega
                                                        </div>
                                                        <div className="fw-medium">
                                                            {tarea.fecha_vencimiento
                                                                ? new Date(
                                                                      tarea.fecha_vencimiento
                                                                  ).toLocaleDateString()
                                                                : "-"}
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
                                                                    tarea.estado ===
                                                                    "Por Hacer"
                                                                        ? "badge badge-azul"
                                                                        : tarea.estado ===
                                                                            "En Progreso"
                                                                          ? "badge-amarillo"
                                                                          : tarea.estado ===
                                                                              "Finalizado"
                                                                            ? "badge-verde"
                                                                            : tarea.estado ===
                                                                                "En Revisión"
                                                                              ? "badge-naranja"
                                                                              : tarea.estado ===
                                                                                  "Cancelado"
                                                                                ? "badge-rojo"
                                                                                : "badge-gris"
                                                                }`}
                                                            >
                                                                {tarea.estado}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="info-item">
                                                        <div className="text-muted mb-1">
                                                            Prioridad
                                                        </div>
                                                        <div className="urgente-badge fw-medium">
                                                            <span
                                                                className={`badge ${
                                                                    tarea.prioridad ===
                                                                    "Alta"
                                                                        ? "badge-rojo"
                                                                        : tarea.prioridad ===
                                                                            "Media"
                                                                          ? "badge-amarillo"
                                                                          : "badge-gris"
                                                                }`}
                                                            >
                                                                {tarea.prioridad ||
                                                                    "Baja"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <div className="info-item">
                                                        <div className="text-muted mb-1">
                                                            Proyecto
                                                        </div>
                                                        <div className="fw-medium">
                                                            {tarea.proyecto_id
                                                                ? tarea
                                                                      .proyecto_id
                                                                      .nombre
                                                                : "-"}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="info-item">
                                                        <div className="text-muted mb-1">
                                                            Colaborador Asignado
                                                        </div>
                                                        <div className="fw-medium">
                                                            {tarea.colaborador_id
                                                                ? tarea
                                                                      .colaborador_id
                                                                      .nombre
                                                                : "-"}
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
                                                {tarea.descripcion ? (
                                                    <p className="mb-0">
                                                        {tarea.descripcion}
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

                                <Tab.Pane eventKey="comentarios">
                                    <Row className="g-0">
                                        <Col className="comentarios-panel p-4">
                                            <h5 className="mb-4">
                                                Comentarios
                                            </h5>

                                            {tarea.comentarios &&
                                            tarea.comentarios.length > 0 ? (
                                                <div className="comentarios-list">
                                                    {tarea.comentarios.map(
                                                        (comentario) => (
                                                            <div
                                                                className="comentario-item mb-4 border-bottom pb-3"
                                                                key={
                                                                    comentario._id
                                                                }
                                                            >
                                                                <div className="d-flex justify-content-between mb-2">
                                                                    <div className="usuario fw-bold">
                                                                        {
                                                                            comentario
                                                                                .usuario_id
                                                                                .nombre
                                                                        }
                                                                    </div>
                                                                    <div className="text-end">
                                                                        <div className="fecha text-muted small mb-1">
                                                                            {new Date(
                                                                                comentario.fecha
                                                                            ).toLocaleDateString()}
                                                                        </div>
                                                                        {comentario
                                                                            .usuario_id
                                                                            ._id ===
                                                                            user_id &&
                                                                        tarea
                                                                            .proyecto_id
                                                                            .estado !==
                                                                            "Finalizado" &&
                                                                        tarea
                                                                            .proyecto_id
                                                                            .estado !==
                                                                            "Cancelado" ? (
                                                                            <button
                                                                                className="thm-btn thm-btn-small btn-azul"
                                                                                onClick={() => {
                                                                                    setCommentEdit(
                                                                                        comentario
                                                                                    );
                                                                                    setEditando(
                                                                                        true
                                                                                    );
                                                                                }}
                                                                            >
                                                                                <FontAwesomeIcon
                                                                                    icon={
                                                                                        faPencil
                                                                                    }
                                                                                />
                                                                            </button>
                                                                        ) : null}
                                                                    </div>
                                                                </div>
                                                                <div className="contenido mb-2">
                                                                    {
                                                                        comentario.contenido
                                                                    }
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-muted">
                                                    No hay comentarios todavía.
                                                </div>
                                            )}

                                            <div className="responder-form mt-4">
                                                <form
                                                    onSubmit={
                                                        handleAddCommentario
                                                    }
                                                >
                                                    <h6 className="mb-3">
                                                        {editando
                                                            ? "Editar comentario:"
                                                            : "Agregar comentario:"}
                                                    </h6>
                                                    <div className="form-group mb-3">
                                                        <textarea
                                                            name="contenido"
                                                            id="contenido"
                                                            className="form-control form_input form-textarea"
                                                            rows="3"
                                                            placeholder="Por favor escriba su comentario"
                                                            value={
                                                                editando
                                                                    ? commentEdit.contenido
                                                                    : contenido
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                            required
                                                        ></textarea>
                                                        {error && (
                                                            <small className="text-danger">
                                                                {error}
                                                            </small>
                                                        )}
                                                    </div>

                                                    <div className="d-flex justify-content-end">
                                                        {editando && (
                                                            <button
                                                                type="button"
                                                                className="thm-btn btn-gris me-2"
                                                                onClick={() => {
                                                                    setEditando(
                                                                        false
                                                                    );
                                                                    setCommentEdit(
                                                                        {}
                                                                    );
                                                                    setContenido(
                                                                        ""
                                                                    );
                                                                }}
                                                            >
                                                                Cancelar
                                                            </button>
                                                        )}
                                                        <button
                                                            type="submit"
                                                            className="thm-btn"
                                                        >
                                                            {editando
                                                                ? "Guardar Cambios"
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

ModalVerTareas.propTypes = {
    tareaModal: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
};

export default ModalVerTareas;
