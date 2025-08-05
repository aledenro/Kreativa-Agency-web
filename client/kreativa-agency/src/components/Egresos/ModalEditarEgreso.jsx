import { Modal, Alert, Form } from "react-bootstrap";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const ModalEditarEgreso = ({ show, handleClose, egreso, onSave }) => {
    const [egresoEditado, setEgresoEditado] = useState({});
    const [mensaje, setMensaje] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (egreso && Object.keys(egreso).length > 0) {
            setEgresoEditado(egreso);
        }
    }, [egreso]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEgresoEditado((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            const res = await axios.put(
                `${import.meta.env.VITE_API_URL}/egresos/${egresoEditado._id}`,
                egresoEditado,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.status === 200) {
                setMensaje("Egreso actualizado exitosamente.");
                setTimeout(() => {
                    setMensaje("");
                    onSave && onSave(egresoEditado);
                    handleClose();
                }, 1500);
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
            setMensaje("Error al actualizar el egreso.");
        }
    };

    return (
        <Modal
            show={
                show && egresoEditado && Object.keys(egresoEditado).length > 0
            }
            onHide={handleClose}
        >
            <Modal.Header closeButton>
                <Modal.Title>Editar Egreso</Modal.Title>
            </Modal.Header>
            <form onSubmit={handleSubmit}>
                <Modal.Body>
                    {mensaje && <Alert variant="info">{mensaje}</Alert>}
                    <div className="mb-3">
                        <label>Fecha:</label>
                        <input
                            type="text"
                            className="form_input"
                            value={new Date(
                                egresoEditado.fecha
                            ).toLocaleDateString()}
                            disabled
                        />
                    </div>
                    <div className="mb-3">
                        <label>Monto:</label>
                        <input
                            type="number"
                            name="monto"
                            className="form_input"
                            value={egresoEditado.monto}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label>Categoría:</label>
                        <Form.Select
                            name="categoria"
                            value={egresoEditado.categoria}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione una categoría</option>
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
                            value={egresoEditado.descripcion}
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
                            value={egresoEditado.proveedor}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label>Estado:</label>
                        <Form.Select
                            name="estado"
                            value={egresoEditado.estado}
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
                        Guardar Cambios
                    </button>
                </Modal.Footer>
            </form>
        </Modal>
    );
};

ModalEditarEgreso.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    egreso: PropTypes.object.isRequired,
    onSave: PropTypes.func,
};

export default ModalEditarEgreso;
