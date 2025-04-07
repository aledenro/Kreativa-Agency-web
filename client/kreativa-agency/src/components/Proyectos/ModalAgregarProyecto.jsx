import axios from "axios";
import { useEffect, useState, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";

function construirJsonRequest(
    nombre,
    descripcion,
    cliente,
    urgente,
    fechaEntrega,
    colaboradores
) {
    const user_id = localStorage.getItem("user_id");
    return {
        cliente_id: cliente,
        nombre: nombre,
        descripcion: descripcion,
        urgente: urgente,
        fecha_entrega: fechaEntrega,
        log: [
            {
                usuario_id: user_id,
                accion: "Crear proyecto.",
            },
        ],
        notificiaciones: [],
        estado: "Por Hacer",
        historial_respuestas: [],
        colaboradores: colaboradores,
    };
}

const ModalAgregarProyecto = ({ show, handleClose, onUpdate }) => {
    const [clientes, setClientes] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertVariant, setAlertVariant] = useState("danger");
    const [empleados, setEmpleados] = useState([]);
    const formRef = useRef(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const enviar = confirm("¿Desea crear este proyecto?");

        if (!enviar) {
            return;
        }

        const formData = new FormData(event.target);

        const nombre = formData.get("nombre");
        const descripcion = formData.get("descripcion");
        const cliente = formData.get("cliente");
        const urgente = formData.get("urgente") === "on";
        const fechaEntrega = formData.get("fecha_entrega");
        const colab = formData.getAll("colab");

        const colabFormateado = [];

        colab.forEach((colaborador) => {
            colabFormateado.push({ colaborador_id: colaborador });
        });

        const data = construirJsonRequest(
            nombre,
            descripcion,
            cliente,
            urgente,
            fechaEntrega,
            colabFormateado
        );

        try {
            const res = await axios.post(
                "http://localhost:4000/api/proyectos/crear",
                data
            );

            if (res.status == 201) {
                setAlertMessage("Proyecto creado correctamente.");
                setAlertVariant("success");
                setShowAlert(true);

                if (formRef.current) {
                    formRef.current.reset();
                }

                if (typeof onUpdate === "function") {
                    onUpdate();
                }

                setTimeout(() => {
                    setShowAlert(false);
                    handleClose();
                }, 2000);
            }
        } catch (error) {
            console.error(error.message);

            setAlertMessage(
                "Error al crear el proyecto, por favor trate nuevamente o comuníquese con el soporte técnico."
            );
            setAlertVariant("danger");
            setShowAlert(true);
        }
    };

    useEffect(() => {
        if (show) {
            fetchClientes();
            fetchEmpleados();
        }
    }, [show]);

    async function fetchClientes() {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:4000/api/usuarios/clientes",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setClientes(response.data);
        } catch (error) {
            console.error(`Error al obtener los clientes: ${error.message}`);
        }
    }

    async function fetchEmpleados() {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:4000/api/usuarios/empleados",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setEmpleados(response.data);
        } catch (error) {
            console.error(`Error al obtener los empleados: ${error.message}`);
        }
    }

    const getFechaHoy = () => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    };

    const handleSaveClick = () => {
        if (formRef.current) {
            formRef.current.dispatchEvent(
                new Event("submit", { cancelable: true, bubbles: true })
            );
        }
    };

    return (
        <Modal
            scrollable
            show={show}
            onHide={handleClose}
            size="xl"
            centered
            dialogClassName="proyecto-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title>Agregar Proyecto</Modal.Title>
            </Modal.Header>
            <Modal.Body
                className="p-4"
                style={{ maxHeight: "70vh", overflowY: "auto" }}
            >
                <form onSubmit={handleSubmit} ref={formRef}>
                    {showAlert && (
                        <Alert
                            variant={alertVariant}
                            onClose={() => setShowAlert(false)}
                            dismissible
                        >
                            {alertMessage}
                        </Alert>
                    )}
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
                            rows={5}
                            placeholder="Describa su solicitud"
                            required
                        ></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="cliente" className="form-label">
                            Cliente
                        </label>
                        <select
                            className="form_input form-select"
                            name="cliente"
                            id="cliente"
                            required
                        >
                            <option value="" disabled selected>
                                Seleccione un cliente
                            </option>
                            {clientes.map((cliente) => (
                                <option key={cliente._id} value={cliente._id}>
                                    {cliente.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="colab" className="form-label ">
                            Colaboradores:
                        </label>
                        <select
                            className="form-select"
                            name="colab"
                            id="colab"
                            multiple
                        >
                            {empleados.map((colab) => (
                                <option key={colab._id} value={colab._id}>
                                    {colab.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3 form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input form-checkbox"
                                    id="urgente"
                                    name="urgente"
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="urgente"
                                >
                                    Urgente
                                </label>
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
                                    className="form-control"
                                    id="fecha_entrega"
                                    name="fecha_entrega"
                                    required
                                    min={getFechaHoy()}
                                />
                            </div>
                        </div>
                    </div>
                </form>
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
                >
                    Crear Proyecto
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalAgregarProyecto;
