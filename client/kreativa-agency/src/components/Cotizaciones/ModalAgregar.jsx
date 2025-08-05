import axios from "axios";
import PropTypes from "prop-types";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import Tab from "react-bootstrap/Tab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import lodash from "lodash";
import fileUpload from "../../utils/fileUpload";
import { InboxOutlined } from "@ant-design/icons";
import { ConfigProvider, Upload, notification } from "antd";
import { useNavigate } from "react-router-dom";

const { Dragger } = Upload;

const ModalAgregar = ({ show, handleClose }) => {
    ModalAgregar.propTypes = {
        show: PropTypes.bool.isRequired,
        handleClose: PropTypes.func.isRequired,
    };
    const [loading, setLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const [isHovered, setIsHovered] = useState(false);
    const [files, setFiles] = useState([]);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    const navigate = useNavigate();

    const handleFileChange = (info) => {
        // Verificar archivos seleccionados
        if (info.fileList && info.fileList.length > 0) {
            const fileObjects = info.fileList.map((file) => file.originFileObj);
            setFiles(fileObjects);
        } else {
            setFiles([]);
        }
    };

    const showNotification = (type, message) => {
        api[type]({
            message: type === "success" ? "Éxito" : "Error",
            description: message,
            placement: "bottomRight",
            duration: 3,
        });
    };

    const clearDragger = () => {
        setFiles([]);
    };

    function construirJsonRequest(titulo, descripcion, urgente) {
        const user_id = localStorage.getItem("user_id");
        return {
            cliente_id: user_id,
            titulo: titulo,
            detalles: descripcion,
            urgente: urgente,
            historial_respuestas: [],
            estado: "Nuevo",
            files: [],
        };
    }

    const fileUploadErrorHandler = async (files, respuestaDbId) => {
        try {
            if (!files || files.length === 0) {
                return;
            }

            await fileUpload(
                files,
                "cotizaciones",
                "cotizacion",
                respuestaDbId
            );
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
            showNotification(
                "error",
                "Error al subir los archivos, por favor intente de nuevo o contacte al soporte técnico."
            );
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const enviar = confirm("¿Desea enviar su cotización?");

        if (!enviar) {
            return;
        }

        const formData = new FormData(event.target);

        const titulo = formData.get("titulo");
        const descripcion = formData.get("descripcion");
        const urgente = formData.get("urgente") === "on";
        const filesArray = files.filter((file) => file.name && file.size > 0);

        const data = construirJsonRequest(titulo, descripcion, urgente);

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/error", {
                state: {
                    errorCode: 401,
                    mensaje: "Debe iniciar sesión para continuar.",
                },
            });
        }

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/cotizaciones/crear`,
                data,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.status == 201) {
                showNotification(
                    "success",
                    "Cotización enviada correctamente."
                );
                if (filesArray.length > 0 && !lodash.isEmpty(res.data)) {
                    await fileUploadErrorHandler(filesArray, res.data._id);
                }

                event.target.reset();
                clearDragger();
                handleClose();
            }
        } catch (error) {
            if (error.status === 401) {
                navigate("/error", {
                    state: {
                        errorCode: 401,
                        mensaje: "Debe volver a iniciar sesión para continuar.",
                    },
                });
            }

            showNotification(
                "error",
                "Error al enviar su cotización, por favor trate nuevamente o comuniquese con el soporte técnico."
            );
        }
    };
    return (
        <Modal
            show={show}
            onHide={handleClose}
            size="xl"
            centered
            dialogClassName="proyecto-modal"
            scrollable
        >
            {contextHolder}
            <Modal.Header closeButton>
                <Modal.Title>Solicitar Cotización</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-0">
                <div className="proyecto-modal-content">
                    <Tab.Container
                        id="proyecto-tabs"
                        defaultActiveKey="detalles"
                    >
                        <div className="p-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <Button
                                    variant="light"
                                    className="btn-sm rounded-circle"
                                >
                                    <FontAwesomeIcon icon={faEllipsisH} />
                                </Button>
                            </div>

                            <div className="proyecto-info mb-4">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label
                                            htmlFor="titulo"
                                            className="form-label"
                                        >
                                            Titulo
                                        </label>
                                        <input
                                            type="text"
                                            className="form_input"
                                            id="titulo"
                                            name="titulo"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label
                                            htmlFor="descripcion"
                                            className="form-label"
                                        >
                                            Descripción
                                        </label>
                                        <textarea
                                            name="descripcion"
                                            className="form_input form-textarea"
                                            id="descripcion"
                                            rows={5}
                                            placeholder="Describa su solicitud"
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="mb-3 form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="urgente"
                                            name="urgente"
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor="urgente"
                                        >
                                            Urgente
                                        </label>
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="form-label">
                                            Archivos adjuntos
                                        </label>
                                        <ConfigProvider
                                            theme={{
                                                components: {
                                                    Upload: {
                                                        lineWidth: "1px",
                                                        lineType: "solid",
                                                        colorBorder: "#8788ab",
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
                                                beforeUpload={() => false}
                                                onChange={handleFileChange}
                                                className="custom-dragger"
                                                style={{
                                                    borderRadius: "12px",
                                                    borderColor: isHovered
                                                        ? "#110d27"
                                                        : "#8788ab",
                                                    borderWidth: "1px",
                                                    borderStyle: "solid",
                                                    backgroundColor:
                                                        "transparent",
                                                    transition:
                                                        "border-color 0.3s",
                                                }}
                                                onMouseEnter={handleMouseEnter}
                                                onMouseLeave={handleMouseLeave}
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
                                                    Haz clic o arrastra tus
                                                    archivos aquí para subirlos
                                                </p>
                                                <p className="ant-upload-hint">
                                                    Puedes subir múltiples
                                                    archivos
                                                </p>
                                            </Dragger>
                                        </ConfigProvider>
                                    </div>
                                    <button type="submit" className="thm-btn">
                                        Enviar
                                    </button>
                                </form>
                            </div>
                        </div>
                    </Tab.Container>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button className="thm-btn btn-gris" onClick={handleClose}>
                    Cerrar
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalAgregar;
