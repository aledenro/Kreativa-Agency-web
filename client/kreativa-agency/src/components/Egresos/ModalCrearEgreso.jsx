import { Modal, Form, Button, Alert } from "react-bootstrap";
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const ModalCrearEgreso = ({ show, handleClose, onSave }) => {
    const navigate = useNavigate();
    const [mensaje, setMensaje] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [formData, setFormData] = useState({
        fecha: "",
        monto: "",
        categoria: "",
        descripcion: "",
        proveedor: "",
        estado: "Pendiente",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/egresos`,
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (res.status === 201) {
                setTimeout(() => {
                    handleClose();
                    setShowConfirm(true);
                }, 1500);
            }
        } catch (error) {
            if (error.status === 401) {
                navigate("/error", {
                    state: {
                        errorCode: 401,
                        mensaje: "Debe volver a iniciar sesión para continuar.",
                    },
                });
                return;
            }
            setMensaje("Error al crear el egreso.");
        }
    };

    const handleConfirm = () => {
        setShowConfirm(false);
        onSave && onSave();
    };

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear Egreso</Modal.Title>
                </Modal.Header>
                <form onSubmit={handleSubmit}>
                    <Modal.Body>
                        {/* Mensaje en caso de error */}
                        {mensaje && <Alert variant="danger">{mensaje}</Alert>}
                        <div className="mb-3">
                            <label>Fecha:</label>
                            <input
                                type="date"
                                name="fecha"
                                className="form_input"
                                value={formData.fecha}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label>Monto:</label>
                            <input
                                type="number"
                                name="monto"
                                className="form_input"
                                value={formData.monto}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label>Categoría:</label>
                            <Form.Select
                                name="categoria"
                                value={formData.categoria}
                                onChange={handleChange}
                                required
                            >
                                <option value="">
                                    Seleccione una categoría
                                </option>
                                <option value="Salarios">Salarios</option>
                                <option value="Software">Software</option>
                                <option value="Servicios de contabilidad">
                                    Servicios de contabilidad
                                </option>
                                <option value="Servicios">Servicios</option>
                            </Form.Select>
                        </div>
                        <div className="mb-3">
                            <label>Descripción:</label>
                            <input
                                type="text"
                                name="descripcion"
                                className="form_input"
                                value={formData.descripcion}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label>Proveedor:</label>
                            <input
                                type="text"
                                name="proveedor"
                                className="form_input"
                                value={formData.proveedor}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label>Estado:</label>
                            <Form.Select
                                name="estado"
                                value={formData.estado}
                                onChange={handleChange}
                                required
                            >
                                <option value="Pendiente">Pendiente</option>
                                <option value="Aprobado">Aprobado</option>
                                <option value="Rechazado">Rechazado</option>
                            </Form.Select>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            type="button"
                            className="thm-btn-2 thm-btn-small"
                            onClick={handleClose}
                        >
                            Cancelar
                        </button>
                        <button type="submit" className="thm-btn thm-btn-small">
                            Crear
                        </button>
                    </Modal.Footer>
                </form>
            </Modal>

            {/* Modal de confirmación para crear */}
            <Modal
                show={showConfirm}
                onHide={() => setShowConfirm(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Egreso Creado</Modal.Title>
                </Modal.Header>
                <Modal.Body>Egreso creado exitosamente.</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleConfirm}>
                        Aceptar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

ModalCrearEgreso.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    onSave: PropTypes.func,
};

export default ModalCrearEgreso;
