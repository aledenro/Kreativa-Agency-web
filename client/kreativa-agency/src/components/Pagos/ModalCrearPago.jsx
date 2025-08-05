import { Modal, Alert } from "react-bootstrap";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import validTokenActive from "../../utils/validateToken";

const ModalCrearPago = ({ show, handleClose, clientes, estados }) => {
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertVariant, setAlertVariant] = useState("danger");
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

    const handleSubmit = async (event) => {
        const enviar = confirm("¿Desea enviar el pago?");

        if (!enviar) {
            return;
        }

        try {
            const formData = new FormData(event.target);

            const titulo = formData.get("titulo");
            const detalle = formData.get("detalle");
            const cliente = formData.get("cliente_id");
            const estado = formData.get("estado");
            const monto = formData.get("monto");
            const fecha_vencimiento = formData.get("fecha_vencimiento");

            const data = {
                titulo: titulo,
                detalle: detalle,
                cliente_id: cliente,
                estado: estado,
                monto: monto,
                fecha_creacion: Date.now(),
                fecha_vencimiento: fecha_vencimiento,
            };

            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/error", {
                    state: {
                        errorCode: 401,
                        mensaje: "Debe iniciar sesión para continuar.",
                    },
                });
            }

            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/pagos/`,
                data,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.status === 201) {
                setAlertMessage("Pago creado exitosamente.");
                setAlertVariant("success");
                setShowAlert(true);

                setTimeout(() => {
                    setShowAlert(false);
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
            setAlertMessage("Error al crear el pago.");
            setAlertVariant("danger");
            setShowAlert(true);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Agregar Nuevo Pago</Modal.Title>
            </Modal.Header>
            {showAlert && <Alert variant={alertVariant}>{alertMessage}</Alert>}
            <div className="card p-4 shadow-lg">
                <form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <div className="mb-3">
                            <label htmlFor="titulo" className="form-label">
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
                            <label htmlFor="detalle" className="form-label">
                                Detalle
                            </label>
                            <textarea
                                name="detalle"
                                className="form_input form-textarea"
                                id="detalle"
                                rows={7}
                                placeholder="Describa sobre qué es el pago"
                                required
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="monto" className="form-label">
                                Monto
                            </label>
                            <input
                                type="number"
                                className="form_input"
                                id="monto"
                                name="monto"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="cliente_id" className="form-label">
                                Cliente
                            </label>
                            <select
                                className="form-select"
                                name="cliente_id"
                                id="cliente_id"
                                required
                            >
                                {clientes.map((cliente) => (
                                    <option
                                        key={cliente._id}
                                        value={cliente._id}
                                    >
                                        {cliente.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="row">
                            <div className="col">
                                <div className="col mb-3">
                                    <label htmlFor="estado">Estado</label>
                                    <select
                                        className="form-select"
                                        name="estado"
                                        id="estado"
                                        required
                                    >
                                        {estados.map((estado) => (
                                            <option key={estado} value={estado}>
                                                {estado}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col">
                                <div className="mb-3">
                                    <label
                                        htmlFor="fecha_vencimiento"
                                        className="form-label"
                                    >
                                        Fecha de Entrega
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="fecha_vencimiento"
                                        name="fecha_vencimiento"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            className="thm-btn-2 thm-btn-small"
                            onClick={handleClose}
                        >
                            Cancelar
                        </button>
                        <button className="thm-btn thm-btn-small" type="submit">
                            Crear
                        </button>
                    </Modal.Footer>
                </form>
            </div>
        </Modal>
    );
};

ModalCrearPago.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    clientes: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            nombre: PropTypes.string.isRequired,
        })
    ).isRequired,
    estados: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ModalCrearPago;
