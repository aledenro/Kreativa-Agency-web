import { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

const ModificarPaqueteModal = ({ paquete, show, handleClose, servicioId }) => {
    const [paqueteEditado, setPaqueteEditado] = useState({ ...paquete });
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertVariant, setAlertVariant] = useState("danger");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPaqueteEditado((prev) => ({ ...prev, [name]: value }));
    };

    const handleBeneficioChange = (index, value) => {
        const nuevosBeneficios = [...paqueteEditado.beneficios];
        nuevosBeneficios[index] = value;
        setPaqueteEditado((prev) => ({
            ...prev,
            beneficios: nuevosBeneficios,
        }));
    };

    const agregarBeneficio = (event) => {
        event.preventDefault();
        setPaqueteEditado((prev) => ({
            ...prev,
            beneficios: [...prev.beneficios, ""],
        }));
    };

    const eliminarBeneficio = (index, event) => {
        event.preventDefault();
        if (paqueteEditado.beneficios.length > 1) {
            const nuevosBeneficios = paqueteEditado.beneficios.filter(
                (_, i) => i !== index
            );
            setPaqueteEditado((prev) => ({
                ...prev,
                beneficios: nuevosBeneficios,
            }));
        }
    };

    const handleSubmit = async () => {
        console.log(
            "Enviando a:",
            `http://localhost:4000/api/servicios/${servicioId}/paquetes/${paqueteEditado._id}`
        );

        try {
            const res = await axios.put(
                `http://localhost:4000/api/servicios/${servicioId}/paquetes/${paqueteEditado._id}`,
                paqueteEditado
            );
            console.log("Respuesta del backend:", res.data);
            setAlertMessage("Paquete editado exitosamente");
            setAlertVariant("success");
            setShowAlert(true);

            setTimeout(() => {
                setShowAlert(false);
                handleClose();
            }, 1500);
        } catch (error) {
            console.error("Error al editar el paquete:", error);
            setAlertMessage("Error al editar el paquete");
            setAlertVariant("danger");
            setShowAlert(true);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Paquete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {showAlert && (
                    <Alert variant={alertVariant}>{alertMessage}</Alert>
                )}
                <Form>
                    <Form.Group>
                        <label>Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            value={paqueteEditado.nombre}
                            onChange={handleChange}
                            className="form_input"
                        />
                    </Form.Group>
                    <Form.Group>
                        <label>Descripción</label>
                        <textarea
                            name="descripcion"
                            rows="3"
                            value={paqueteEditado.descripcion}
                            onChange={handleChange}
                            className="form_input form_textarea"
                        />
                    </Form.Group>
                    <Form.Group>
                        <label>Duración</label>
                        <input
                            type="text"
                            name="duracion"
                            value={paqueteEditado.duracion}
                            onChange={handleChange}
                            className="form_input"
                        />
                    </Form.Group>
                    <Form.Group>
                        <label>Precio</label>
                        <input
                            type="number"
                            name="precio"
                            value={paqueteEditado.precio}
                            onChange={handleChange}
                            className="form_input"
                        />
                    </Form.Group>
                    <Form.Group>
                        <label>Beneficios</label>
                        {paqueteEditado.beneficios.map((beneficio, index) => (
                            <div
                                key={index}
                                className="d-flex align-items-center"
                            >
                                <input
                                    type="text"
                                    className="form_input"
                                    value={beneficio}
                                    onChange={(e) =>
                                        handleBeneficioChange(
                                            index,
                                            e.target.value
                                        )
                                    }
                                />
                                {index > 0 && (
                                    <button
                                        className="icon-btn"
                                        onClick={(e) =>
                                            eliminarBeneficio(index, e)
                                        }
                                    >
                                        <FontAwesomeIcon icon={faX} />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            className="thm-btn thm-btn-small"
                            onClick={(e) => agregarBeneficio(e)}
                        >
                            Agregar Beneficio
                        </button>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <button
                    className="thm-btn-2 thm-btn-small"
                    onClick={handleClose}
                >
                    Cancelar
                </button>
                <button
                    className="thm-btn thm-btn-small"
                    onClick={handleSubmit}
                >
                    Guardar Cambios
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModificarPaqueteModal;
