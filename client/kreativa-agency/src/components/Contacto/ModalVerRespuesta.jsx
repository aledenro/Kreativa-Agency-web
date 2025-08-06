import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import validTokenActive from "../../utils/validateToken";

const ModalVerRespuesta = ({ form, onClose }) => {
    const navigate = useNavigate();

    useEffect(() => {
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

        if (!validTokenActive()) {
            navigate("/error", {
                state: {
                    errorCode: 401,
                    mensaje: "Debe volver a iniciar sesión para continuar.",
                },
            });
            return;
        }
    });

    if (!form) return null;

    return (
        <Modal
            show
            onHide={onClose}
            centered
            size="lg"
            dialogClassName="modal-dialog-scrollable"
        >
            <Modal.Header closeButton>
                <Modal.Title>Detalles del Formulario</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>Sobre el negocio</h5>
                <hr />
                {form.nombre && form.apellido && (
                    <p>
                        <strong>
                            {form.nombre} {form.apellido}
                        </strong>
                    </p>
                )}
                {form.correo && (
                    <p>
                        <strong>Correo:</strong> {form.correo}
                    </p>
                )}
                {form.telefono && (
                    <p>
                        <strong>Teléfono:</strong> {form.telefono}
                    </p>
                )}
                <h5>Sobre el negocio</h5>
                <hr />
                {form.nombre_negocio && (
                    <p>
                        <strong>Negocio:</strong> {form.nombre_negocio}
                    </p>
                )}
                {form.dedicacion_negocio && (
                    <p>
                        <strong>Dedicación:</strong> {form.dedicacion_negocio}
                    </p>
                )}
                {form.link_sitio_web && (
                    <p>
                        <strong>Página Web:</strong>{" "}
                        <a
                            href={form.link_sitio_web}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {form.link_sitio_web}
                        </a>
                    </p>
                )}
                {form.redes_sociales && form.redes_sociales.length > 0 && (
                    <>
                        <p>
                            <strong>Redes sociales:</strong>
                        </p>
                        <ul>
                            {form.redes_sociales.map((red, index) => (
                                <li key={index}>
                                    <a
                                        href={red}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {red}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
                {form.objetivos && (
                    <p>
                        <strong>Objetivos por cumplir:</strong> {form.objetivos}
                    </p>
                )}
                {form.servicios_id && form.servicios_id.length > 0 && (
                    <>
                        <p>
                            <strong>Servicios de interés:</strong>
                        </p>
                        <ul>
                            {form.servicios_id.map((servicio, index) => (
                                <li key={index}>{servicio.nombre}</li>
                            ))}
                        </ul>
                    </>
                )}
                {form.fecha_envio && (
                    <p>
                        <strong>Fecha de Envío:</strong>{" "}
                        {new Date(form.fecha_envio).toLocaleDateString()}
                    </p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <button className="thm-btn thm-btn-small" onClick={onClose}>
                    Cerrar
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalVerRespuesta;
