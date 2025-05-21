import { Modal, Alert } from "react-bootstrap";
import lodash from "lodash";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import axios from "axios";

const ModalEditarPago = ({
    pago,
    show,
    handleClose,
    rol,
    clientes,
    estados,
}) => {
    const [pagoEditado, setPagoEditado] = useState({});
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertVariant, setAlertVariant] = useState("danger");

    useEffect(() => {
        if (pago) {
            setPagoEditado(pago);
        }
    }, [pago]);

    const handleEditar = async () => {
        try {
            const res = await axios.put(
                `${import.meta.env.VITE_API_URL}/pagos/update/${pagoEditado._id}`,
                pagoEditado
            );

            if (res.status === 200) {
                setAlertMessage("Pago editado exitosamente");
                setAlertVariant("success");
                setShowAlert(true);

                setTimeout(() => {
                    setShowAlert(false);
                    handleClose();
                }, 1500);
            }
        } catch (error) {
            console.error("Error al editar el pago:", error);
            setAlertMessage("Error al editar el pago.");
            setAlertVariant("danger");
            setShowAlert(true);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPagoEditado((prevPagoEdit) => ({
            ...prevPagoEdit,
            [name]: value,
        }));
    };

    function renderEstados(estado, pagoEstado) {
        if (estado === pagoEstado) {
            return (
                <option key={estado} defaultValue={estado} selected>
                    {estado}
                </option>
            );
        } else {
            return (
                <option key={estado} value={estado}>
                    {estado}
                </option>
            );
        }
    }

    function renderOptionsClientes(cliente, clientePago) {
        if (cliente._id === clientePago._id) {
            return (
                <option key={cliente._id} value={cliente._id} selected>
                    {cliente.nombre}
                </option>
            );
        } else {
            return (
                <option key={cliente._id} value={cliente._id}>
                    {cliente.nombre}
                </option>
            );
        }
    }

    return (
        <Modal show={show && !lodash.isEmpty(pagoEditado)} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Detalles Pago</Modal.Title>
            </Modal.Header>
            {showAlert && <Alert variant={alertVariant}>{alertMessage}</Alert>}
            <div className="card p-4 shadow-lg">
                <div className="row mb-3">
                    <div className="col mx-3">
                        Fecha de Creación:{" "}
                        <small>
                            {pagoEditado.fecha_creacion
                                ? new Date(
                                      pagoEditado.fecha_creacion
                                  ).toLocaleDateString()
                                : ""}
                        </small>
                    </div>
                </div>
                <form onSubmit={handleEditar}>
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
                                value={
                                    pagoEditado.titulo ? pagoEditado.titulo : ""
                                }
                                onChange={handleChange}
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
                                value={
                                    pagoEditado.detalle
                                        ? pagoEditado.detalle
                                        : ""
                                }
                                onChange={handleChange}
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
                                value={pago.monto ? pago.monto : 0}
                                required
                            />
                        </div>
                        {rol === "Administrador" ? (
                            <div className="mb-3">
                                <label
                                    htmlFor="cliente_id"
                                    className="form-label"
                                >
                                    Cliente
                                </label>
                                <select
                                    className="form-select"
                                    name="cliente_id"
                                    id="cliente_id"
                                    onChange={handleChange}
                                >
                                    {clientes.map((cliente) =>
                                        renderOptionsClientes(
                                            cliente,
                                            pagoEditado.cliente_id
                                                ? pagoEditado.cliente_id
                                                : ""
                                        )
                                    )}
                                </select>
                            </div>
                        ) : (
                            ""
                        )}
                        <div className="row">
                            <div className="col">
                                <div className="col mb-3">
                                    <label htmlFor="estado">Estado</label>
                                    <select
                                        className="form-select"
                                        name="estado"
                                        id="estado"
                                        onChange={handleChange}
                                    >
                                        {estados.map((estado) =>
                                            renderEstados(
                                                estado,
                                                pagoEditado ? pagoEditado : ""
                                            )
                                        )}
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
                                        value={
                                            pagoEditado.fecha_vencimiento
                                                ? new Date(
                                                      pagoEditado.fecha_vencimiento
                                                  )
                                                      .toISOString()
                                                      .split("T")[0]
                                                : ""
                                        }
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                </form>
                <Modal.Footer>
                    <button
                        className="thm-btn-2 thm-btn-small"
                        onClick={handleClose}
                    >
                        Cancelar
                    </button>
                    <button
                        className="thm-btn thm-btn-small"
                        onClick={() => handleEditar()}
                    >
                        Guardar Cambios
                    </button>
                </Modal.Footer>
            </div>
        </Modal>
    );
};

ModalEditarPago.propTypes = {
    pago: PropTypes.shape({
        fecha_creacion: PropTypes.string,
        titulo: PropTypes.string,
        detalle: PropTypes.string,
        cliente_id: PropTypes.shape({
            nombre: PropTypes.string,
        }),
        estado: PropTypes.string,
        fecha_vencimiento: PropTypes.string,
        monto: PropTypes.number,
    }),
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    rol: PropTypes.string.isRequired,
    clientes: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            nombre: PropTypes.string.isRequired,
        })
    ).isRequired,
    estados: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ModalEditarPago;
