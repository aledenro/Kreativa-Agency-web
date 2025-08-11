import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import { useEffect } from "react";
import {validTokenActive, updateSessionStatus} from "../../utils/validateToken";
import { useNavigate } from "react-router-dom";

const ModalVerEgreso = ({ show, handleClose, egreso, categories = [] }) => {
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

    const getCategoryName = (catId) => {
        if (!catId) return "";
        const cat = categories.find(
            (c) => c._id?.toString() === catId.toString()
        );
        return cat ? cat.nombre : catId;
    };

    return (
        <Modal
            show={show && egreso && Object.keys(egreso).length > 0}
            onHide={handleClose}
        >
            <Modal.Header closeButton>
                <Modal.Title>Ver Egreso</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    <strong>Fecha:</strong>{" "}
                    {new Date(egreso.fecha).toLocaleDateString()}
                </p>
                <p>
                    <strong>Monto:</strong> ₡{egreso.monto}
                </p>
                <p>
                    <strong>Categoría:</strong>{" "}
                    {getCategoryName(egreso.categoria)}
                </p>
                <p>
                    <strong>Descripción:</strong> {egreso.descripcion}
                </p>
                <p>
                    <strong>Proveedor:</strong> {egreso.proveedor}
                </p>
                <p>
                    <strong>Estado:</strong> {egreso.estado}
                </p>
            </Modal.Body>
            <Modal.Footer>
                <button
                    className="thm-btn-2 thm-btn-small"
                    onClick={handleClose}
                >
                    Cerrar
                </button>
            </Modal.Footer>
        </Modal>
    );
};

ModalVerEgreso.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    egreso: PropTypes.shape({
        fecha: PropTypes.string,
        monto: PropTypes.number,
        categoria: PropTypes.string,
        descripcion: PropTypes.string,
        proveedor: PropTypes.string,
        estado: PropTypes.string,
    }).isRequired,
    categories: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            nombre: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default ModalVerEgreso;
