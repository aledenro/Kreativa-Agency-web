import { Modal } from "react-bootstrap";
import axios from "axios";
import lodash from "lodash";
import PropTypes from "prop-types";
import { useState } from "react";

const ModalVerTareas = ({ tareaModal, show, handleClose }) => {
    const [tarea, setTarea] = useState(tareaModal);

    return (
        <Modal show={show && !lodash.isEmpty(tarea)} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Ver Detalles Tarea</Modal.Title>
            </Modal.Header>
            <div className="card p-4 shadow-lg">
                <div className="row mb-3">
                    <div className="col mx-3">
                        Fecha de Solicitud:{" "}
                        <small>
                            {tarea.fecha_creacion
                                ? new Date(
                                      tarea.fecha_creacion
                                  ).toLocaleDateString()
                                : ""}
                        </small>
                    </div>
                    <div className="col mx-3">
                        <label htmlFor="estado">Estado</label>
                        <select
                            className="form-select"
                            name="estado"
                            id="estado"
                            disabled
                        >
                            <option value="">
                                {tarea.estado ? tarea.estado : ""}
                            </option>
                        </select>
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="proyecto" className="form-label">
                        Proyecto
                    </label>
                    <select
                        className="form-select"
                        name="proyecto"
                        id="proyecto"
                        disabled
                    >
                        <option value="">
                            {tarea.proyecto_id ? tarea.proyecto_id.nombre : ""}
                        </option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">
                        Nombre
                    </label>
                    <input
                        type="text"
                        className="form_input"
                        id="nombre"
                        name="nombre"
                        required
                        value={tarea.nombre ? tarea.nombre : ""}
                        disabled
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="descripcion" className="form-label">
                        Descripción
                    </label>
                    <textarea
                        name="descripcion"
                        className="form_input form-textarea"
                        id="descripcion"
                        rows={7}
                        placeholder="Describa su solicitud"
                        required
                        value={tarea.descripcion ? tarea.descripcion : ""}
                        disabled
                    ></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="colab" className="form-label">
                        Colaborador
                    </label>
                    <select
                        className="form-select"
                        name="colab"
                        id="colab"
                        disabled
                    >
                        <option value="">
                            {tarea.colaborador_id
                                ? tarea.colaborador_id.nombre
                                : ""}
                        </option>
                    </select>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="mb-3">
                            <label className="form-label" htmlFor="prioridad">
                                Prioridad
                            </label>
                            <select
                                className="form-select"
                                name="prioridad"
                                id="prioridad"
                                disabled
                            >
                                <option value="">
                                    {tarea.prioridad ? tarea.prioridad : ""}
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
                                    tarea.fecha_vencimiento
                                        ? new Date(tarea.fecha_vencimiento)
                                              .toISOString()
                                              .split("T")[0]
                                        : ""
                                }
                                disabled
                            />
                        </div>
                    </div>
                </div>
                <hr />
                <div className="row">
                    {tarea.comentarios.length > 0 ? (
                        tarea.comentarios.map((comentario) => (
                            <div className="card" key={comentario._id}>
                                <div className="card-body">
                                    <div className="d-flex flex-start align-items-center">
                                        <div className="container row">
                                            <h6 className="fw-bold mb-1  col">
                                                {comentario.usuario_id.nombre}
                                            </h6>
                                            <small className="col text-end">
                                                {comentario.fecha
                                                    ? new Date(comentario.fecha)
                                                          .toISOString()
                                                          .split("T")[0]
                                                    : ""}
                                            </small>
                                        </div>
                                    </div>
                                    <hr />
                                    <p className="mt-1 mb-4 pb-2">
                                        {comentario.contenido}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No hay comentarios todavía.</p>
                    )}
                    <div className="card-footer border-0">
                        <div className="d-flex flex-start w-100">
                            <div
                                data-mdb-input-init
                                className="form-outline w-100"
                            >
                                <textarea
                                    className="form-control"
                                    id="textAreaExample"
                                    rows="4"
                                ></textarea>
                                <label
                                    className="form-label"
                                    htmlFor="textAreaExample"
                                >
                                    Message
                                </label>
                            </div>
                        </div>
                        <div className="float-end mt-2 pt-1">
                            <button
                                type="button"
                                data-mdb-button-init
                                data-mdb-ripple-init
                                className="btn btn-primary btn-sm"
                            >
                                Post comment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
ModalVerTareas.propTypes = {
    tareaModal: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
};

export default ModalVerTareas;
