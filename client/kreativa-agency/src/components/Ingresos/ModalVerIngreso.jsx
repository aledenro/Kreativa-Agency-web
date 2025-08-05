import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import validTokenActive from "../../utils/validateToken";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ModalVerIngreso = ({ show, handleClose, ingreso, categories = [] }) => {
    const navigate = useNavigate;
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
        console.log("catId recibido:", catId);
        console.log("array de categorías:", categories);
        if (!catId) return "";
        const cat = categories.find(
            (c) => c._id.toString() === catId.toString()
        );
        console.log("Categoría encontrada:", cat);
        return cat ? cat.nombre : catId;
    };

    return (
        <Modal
            show={show && ingreso && Object.keys(ingreso).length > 0}
            onHide={handleClose}
        >
            <Modal.Header closeButton>
                <Modal.Title>Ver Ingreso</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    <strong>Fecha Creación:</strong>{" "}
                    {new Date(ingreso.fecha_creacion).toLocaleDateString()}
                </p>
                <p>
                    <strong>Nombre Cliente:</strong> {ingreso.nombre_cliente}
                </p>
                <p>
                    <strong>Cédula:</strong> {ingreso.cedula}
                </p>
                <p>
                    <strong>Email:</strong> {ingreso.email}
                </p>
                <p>
                    <strong>Categoría:</strong>{" "}
                    {getCategoryName(ingreso.categoria)}
                </p>
                <p>
                    <strong>Descripción:</strong> {ingreso.descripcion}
                </p>
                <p>
                    <strong>Monto:</strong> ₡{ingreso.monto}
                </p>
                <p>
                    <strong>Fecha Vencimiento:</strong>{" "}
                    {new Date(ingreso.fecha).toLocaleDateString()}
                </p>
                <p>
                    <strong>Estado:</strong> {ingreso.estado}
                </p>
            </Modal.Body>
            <Modal.Footer>
                <button
                    className="thm-btn thm-btn-small btn-gris "
                    onClick={handleClose}
                >
                    Cerrar
                </button>
            </Modal.Footer>
        </Modal>
    );
};

ModalVerIngreso.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    ingreso: PropTypes.shape({
        fecha_creacion: PropTypes.string,
        nombre_cliente: PropTypes.string,
        cedula: PropTypes.string,
        categoria: PropTypes.string,
        descripcion: PropTypes.string,
        monto: PropTypes.number,
        fecha: PropTypes.string,
        estado: PropTypes.string,
    }).isRequired,
    categories: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            nombre: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default ModalVerIngreso;
