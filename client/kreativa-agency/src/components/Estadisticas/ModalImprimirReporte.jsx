import { Modal } from "react-bootstrap";
import axios from "axios";
import PropTypes from "prop-types";
import { useState } from "react";
import { notification } from "antd";

const ModalImprimirReportes = ({ show, handleClose }) => {
    const [error, setError] = useState("");
    const [api, contextHolder] = notification.useNotification();

    const openSuccessNotification = (message) => {
        api.success({
            message: "Éxito",
            description: message,
            placement: "bottomRight",
            duration: 4,
        });
    };

    const openErrorNotification = (message) => {
        api.error({
            message: "Error",
            description: message,
            placement: "bottomRight",
            duration: 4,
        });
    };

    return (
        <Modal show={show} onHide={handleClose}>
            {contextHolder}
            <Modal.Header closeButton>
                <Modal.Title>Imprimir Reporte Ingresos/Egresos</Modal.Title>
            </Modal.Header>
            <div className="card p-4 shadow-lg">
                <div className="row mb-3">
                    <div className="col mx-3">
                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="Ingresos"
                                name="Ingresos"
                            />
                            <label
                                className="form-check-label"
                                htmlFor="Ingresos"
                            >
                                Ingresos
                            </label>
                        </div>
                    </div>
                    <div className="col mx-3">
                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="Egresos"
                                name="Egresos"
                            />
                            <label
                                className="form-check-label"
                                htmlFor="Egresos"
                            >
                                Egresos
                            </label>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="mb-3">
                        <label htmlFor="fechaInicio" className="form-label">
                            Fecha de Inicio
                        </label>
                        <input
                            type="date"
                            className="form-control"
                            id="fechaInicio"
                            name="fechaInicio"
                            required
                        />
                    </div>
                </div>
                <div className="col">
                    <div className="mb-3">
                        <label htmlFor="fechaFin" className="form-label">
                            Fecha Fin
                        </label>
                        <input
                            type="date"
                            className="form-control"
                            id="fechaFin"
                            name="fechaFin"
                            required
                        />
                    </div>
                </div>
            </div>
            <button type="submit" className="thm-btn">
                Imprimir
            </button>
        </Modal>
    );
};
ModalImprimirReportes.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
};

export default ModalImprimirReportes;
