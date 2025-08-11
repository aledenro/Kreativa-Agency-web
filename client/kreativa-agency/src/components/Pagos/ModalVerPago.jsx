import { Modal } from "react-bootstrap";
import lodash from "lodash";
import PropTypes from "prop-types";
import {validTokenActive, updateSessionStatus} from "../../utils/validateToken";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ModalVerPago = ({ pago, show, handleClose, rol }) => {
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

    return (
        <Modal show={show && !lodash.isEmpty(pago)} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Ver Detalles Pago</Modal.Title>
            </Modal.Header>
            <div className="card p-4 shadow-lg">
                <div className="row mb-3">
                    <div className="col mx-3">
                        Fecha de Creación:{" "}
                        <small>
                            {pago.fecha_creacion
                                ? new Date(
                                      pago.fecha_creacion
                                  ).toLocaleDateString()
                                : ""}
                        </small>
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">
                        Titulo
                    </label>
                    <input
                        type="text"
                        className="form_input"
                        id="nombre"
                        name="nombre"
                        required
                        value={pago.titulo ? pago.titulo : ""}
                        disabled
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="descripcion" className="form-label">
                        Detalle
                    </label>
                    <textarea
                        name="descripcion"
                        className="form_input form-textarea"
                        id="descripcion"
                        rows={7}
                        placeholder="Describa su solicitud"
                        required
                        value={pago.detalle ? pago.detalle : ""}
                        disabled
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
                        <label htmlFor="colab" className="form-label">
                            Cliente
                        </label>
                        <select
                            className="form-select"
                            name="colab"
                            id="colab"
                            disabled
                        >
                            <option value="">
                                {pago.cliente_id ? pago.cliente_id.nombre : ""}
                            </option>
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
                                disabled
                            >
                                <option value="">
                                    {pago.estado ? pago.estado : ""}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div className="col">
                        <div className="mb-3">
                            <label
                                htmlFor="fecha_entrega"
                                className="form-label"
                            >
                                Fecha de Entrega
                            </label>
                            <input
                                type="date"
                                className="form-control"
                                id="fecha_entrega"
                                name="fecha_entrega"
                                required
                                value={
                                    pago.fecha_vencimiento
                                        ? new Date(pago.fecha_vencimiento)
                                              .toISOString()
                                              .split("T")[0]
                                        : ""
                                }
                                disabled
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
ModalVerPago.propTypes = {
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
};

export default ModalVerPago;
