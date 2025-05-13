import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import sendEmailExterno from "../../utils/sendEmailExterno";

const ResponderFormularioModal = ({ form, onClose }) => {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);

    const handleSendEmail = async () => {
        if (!form?.correo) {
            alert("El campo de correo es inválido.");
            return;
        }

        if (!subject || !message) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        setSending(true);

        try {
            const success = await sendEmailExterno(
                form.correo,
                message,
                subject
            );
            setSending(false);

            if (success) {
                alert("Correo enviado con éxito.");
                onClose();
            } else {
                alert("Error al enviar el correo. Intente nuevamente.");
            }
        } catch (error) {
            console.error("Error al enviar el correo:", error);
            alert("Error al enviar el correo.");
            setSending(false);
        }
    };

    return (
        <Modal show onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    Responder a la solicitud de reclutamiento
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Para</Form.Label>
                        <input
                            className="form_input"
                            type="email"
                            value={form.correo}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <label className="form-label">Asunto</label>
                        <input
                            className="form_input"
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Ingrese el asunto"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <label className="form-label">Mensaje</label>
                        <textarea
                            className="form_input form-textarea"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Escriba su mensaje aquí..."
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <button className="thm-btn thm-btn-small" onClick={onClose}>
                    Cerrar
                </button>
                <button
                    className="thm-btn thm-btn-small btn-azul"
                    onClick={handleSendEmail}
                    disabled={sending}
                >
                    {sending ? "Enviando..." : "Enviar"}
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default ResponderFormularioModal;
