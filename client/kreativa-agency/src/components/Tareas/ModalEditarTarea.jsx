import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";
import sendEmail from "../../utils/emailSender";
import { useNavigate } from "react-router-dom";

function construirJsonRequest(
    proyecto,
    nombre,
    descripcion,
    colaborador,
    prioridad,
    fechaEntrega
) {
    return {
        proyecto_id: proyecto,
        nombre: nombre,
        descripcion: descripcion,
        colaborador_id: colaborador,
        prioridad: prioridad,
        fecha_vencimiento: fechaEntrega,
    };
}

function renderProyectos(proyecto, proyectoTareaId) {
    if (proyecto._id === proyectoTareaId) {
        return (
            <option key={proyecto._id} value={proyecto._id} selected>
                {proyecto.nombre}
            </option>
        );
    } else {
        return (
            <option key={proyecto._id} value={proyecto._id}>
                {proyecto.nombre}
            </option>
        );
    }
}

function renderColab(colab, proyectoColabId) {
    if (colab._id === proyectoColabId) {
        return (
            <option key={colab._id} value={colab._id} selected>
                {colab.nombre}
            </option>
        );
    } else {
        return (
            <option key={colab._id} value={colab._id}>
                {colab.nombre}
            </option>
        );
    }
}

function renderPrioridades(prioridad, tareaPrioridad) {
    if (prioridad === tareaPrioridad) {
        return (
            <option key={prioridad} defaultValue={prioridad} selected>
                {prioridad}
            </option>
        );
    } else {
        return (
            <option key={prioridad} value={prioridad}>
                {prioridad}
            </option>
        );
    }
}

function renderOptionsEstados(opcion, estadoTarea) {
    if (opcion === estadoTarea) {
        return (
            <option key={estadoTarea} value={estadoTarea} selected>
                {estadoTarea}
            </option>
        );
    } else {
        return (
            <option key={opcion} value={opcion}>
                {opcion}
            </option>
        );
    }
}

const ModalEditarTarea = ({ show, handleClose, tareaId, onUpdate }) => {
    const [empleados, setEmpleados] = useState([]);
    const [proyectos, setProyectos] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertVariant, setAlertVariant] = useState("danger");
    const [tarea, setTarea] = useState(null);
    const [estado, setEstado] = useState("");
    const [colaboradorOriginal, setColaboradorOriginal] = useState("");
    const [formRef, setFormRef] = useState(null);
    const navigate = useNavigate();

    const prioridades = ["Baja", "Media", "Alta"];
    const estados = [
        "Por Hacer",
        "En Progreso",
        "Cancelado",
        "Finalizado",
        "En Revisión",
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTarea((prevTarea) => ({ ...prevTarea, [name]: value }));
    };

    const handleChangeEstado = async (event) => {
        event.preventDefault();
        const estadoEdit = event.target.value;
        const token = localStorage.getItem("token");

        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/tareas/editar/${tareaId}`,
                { estado: estadoEdit },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200) {
                setAlertMessage("Estado cambiado correctamente.");
                setAlertVariant("success");
                setShowAlert(true);
                setEstado(estadoEdit);
                await addActionLog(
                    `Cambió el estado de la tarea a: ${estadoEdit}.`
                );

                if (typeof onUpdate === "function") {
                    onUpdate();
                }

                setTimeout(() => {
                    setShowAlert(false);
                }, 3000);
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
            setAlertMessage(
                "Error al editar el estado de su tarea, por favor trate nuevamente o comuniquese con el soporte técnico."
            );
            setAlertVariant("danger");
            setShowAlert(true);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const enviar = confirm("¿Desea guardar los cambios en la tarea?");

        if (!enviar) {
            return;
        }

        const formData = new FormData(event.target);

        const nombre = formData.get("nombre").trim();
        const descripcion = formData.get("descripcion").trim();
        const colab = formData.get("colab");
        const prioridad = formData.get("prioridad");
        const proyecto = formData.get("proyecto");
        const fechaEntrega = formData.get("fecha_entrega");

        const data = construirJsonRequest(
            proyecto,
            nombre,
            descripcion,
            colab,
            prioridad,
            fechaEntrega
        );

        const token = localStorage.getItem("token");

        try {
            const res = await axios.put(
                `${import.meta.env.VITE_API_URL}/tareas/editar/${tareaId}`,
                data,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.status == 200) {
                setAlertMessage("Tarea editada correctamente.");
                setAlertVariant("success");
                setShowAlert(true);
                await addActionLog("Editó la tarea.");

                if (typeof onUpdate === "function") {
                    onUpdate();
                }

                if (colaboradorOriginal !== colab) {
                    await sendEmail(
                        colab,
                        "Se le ha asignado una nueva tarea.",
                        "Nueva Asignación de Trabajo",
                        "Ver",
                        "test"
                    );
                }
                setTimeout(() => {
                    setShowAlert(false);
                }, 3000);
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

            setAlertMessage(
                "Error al editar la tarea, por favor trate nuevamente o comuniquese con el soporte técnico."
            );
            setAlertVariant("danger");
            setShowAlert(true);
        }
    };

    const addActionLog = async (accion) => {
        const token = localStorage.getItem("token");

        try {
            const user_id = localStorage.getItem("user_id");
            await axios.put(
                `${import.meta.env.VITE_API_URL}/tareas/actualizarLog/${tareaId}`,
                {
                    usuario_id: user_id,
                    accion: accion,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
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
        }
    };

    const fetchTarea = useCallback(async () => {
        if (!tareaId) return;
        const token = localStorage.getItem("token");

        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/tareas/id/${tareaId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setTarea(response.data);
            setEstado(response.data.estado);
            setColaboradorOriginal(response.data.colaborador_id._id);
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
            console.error(`Error al obtener la tarea`);
        }
    }, [tareaId]);

    useEffect(() => {
        if (show && tareaId) {
            fetchTarea();
            fetchProyectos();
            fetchEmpleados();
        }
    }, [show, tareaId, fetchTarea]);

    async function fetchEmpleados() {
        const token = localStorage.getItem("token");

        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/usuarios/empleados`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setEmpleados(response.data);
        } catch (error) {
            console.error(`Error al obtener los empleados`);
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
        }
    }

    async function fetchProyectos() {
        const token = localStorage.getItem("token");

        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/proyectos/getAllProyectosLimitedData`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setProyectos(response.data.proyectos);
        } catch (error) {
            console.error(`Error al obtener los proyectos`);
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
        }
    }

    const handleSaveClick = () => {
        if (formRef) {
            formRef.dispatchEvent(
                new Event("submit", { cancelable: true, bubbles: true })
            );
        }
    };

    const getFechaHoy = () => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    };

    return (
        <Modal
            scrollable
            show={show}
            onHide={handleClose}
            size="lg"
            centered
            dialogClassName="tarea-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title>{tarea?.nombre || ""}</Modal.Title>
            </Modal.Header>
            <Modal.Body
                className="p-4"
                style={{ maxHeight: "70vh", overflowY: "auto" }}
            >
                {!tarea ? (
                    <div className="text-center p-5">
                        <p>Cargando tarea...</p>
                    </div>
                ) : (
                    <>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <div className="info-item">
                                    <div className="text-muted mb-1">
                                        Fecha de Solicitud
                                    </div>
                                    <div className="fw-medium">
                                        {new Date(
                                            tarea.fecha_creacion
                                        ).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="info-item">
                                    <div className="text-muted mb-1">
                                        Estado
                                    </div>
                                    <select
                                        className="form-select form_input"
                                        name="estado"
                                        id="estado"
                                        onChange={handleChangeEstado}
                                    >
                                        {estados.map((opcion) =>
                                            renderOptionsEstados(
                                                opcion,
                                                tarea.estado
                                            )
                                        )}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {showAlert && (
                            <Alert
                                variant={alertVariant}
                                onClose={() => setShowAlert(false)}
                                dismissible
                            >
                                {alertMessage}
                            </Alert>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            ref={(el) => setFormRef(el)}
                        >
                            <div className="mb-3">
                                <label
                                    htmlFor="proyecto"
                                    className="form-label"
                                >
                                    Proyecto
                                </label>
                                <select
                                    className="form-select form_input"
                                    name="proyecto"
                                    id="proyecto"
                                    disabled={
                                        estado === "Cancelado" ||
                                        estado === "Finalizado"
                                    }
                                >
                                    {proyectos.map((proyecto) =>
                                        renderProyectos(
                                            proyecto,
                                            tarea.proyecto_id
                                        )
                                    )}
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
                                    value={tarea.nombre}
                                    onChange={handleChange}
                                    disabled={
                                        estado === "Cancelado" ||
                                        estado === "Finalizado"
                                    }
                                />
                            </div>
                            <div className="mb-3">
                                <label
                                    htmlFor="descripcion"
                                    className="form-label"
                                >
                                    Descripción
                                </label>
                                <textarea
                                    name="descripcion"
                                    className="form_input form-textarea"
                                    id="descripcion"
                                    rows={5}
                                    placeholder="Describa su solicitud"
                                    required
                                    value={tarea.descripcion}
                                    onChange={handleChange}
                                    disabled={
                                        estado === "Cancelado" ||
                                        estado === "Finalizado"
                                    }
                                ></textarea>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="colab" className="form-label">
                                    Colaborador
                                </label>
                                <select
                                    className="form-select form_input"
                                    name="colab"
                                    id="colab"
                                    disabled={
                                        estado === "Cancelado" ||
                                        estado === "Finalizado"
                                    }
                                >
                                    {empleados.map((colab) =>
                                        renderColab(colab, tarea.colaborador_id)
                                    )}
                                </select>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label
                                            className="form-label"
                                            htmlFor="prioridad"
                                        >
                                            Prioridad
                                        </label>
                                        <select
                                            className="form-select form_input"
                                            name="prioridad"
                                            id="prioridad"
                                            disabled={
                                                estado === "Cancelado" ||
                                                estado === "Finalizado"
                                            }
                                        >
                                            {prioridades.map((prioridad) =>
                                                renderPrioridades(
                                                    prioridad,
                                                    tarea.prioridad
                                                )
                                            )}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label
                                            htmlFor="fecha_entrega"
                                            className="form-label"
                                        >
                                            Fecha de Entrega
                                        </label>
                                        <input
                                            type="date"
                                            className="form-control form_input"
                                            id="fecha_entrega"
                                            name="fecha_entrega"
                                            required
                                            value={
                                                new Date(
                                                    tarea.fecha_vencimiento
                                                )
                                                    .toISOString()
                                                    .split("T")[0]
                                            }
                                            min={getFechaHoy()}
                                            onChange={handleChange}
                                            disabled={
                                                estado === "Cancelado" ||
                                                estado === "Finalizado"
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <button
                    type="button"
                    className="thm-btn btn-gris me-2"
                    onClick={handleClose}
                >
                    Cerrar
                </button>
                <button
                    type="button"
                    className="thm-btn"
                    onClick={handleSaveClick}
                    disabled={
                        !tarea ||
                        estado === "Cancelado" ||
                        estado === "Finalizado"
                    }
                >
                    Guardar
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEditarTarea;
