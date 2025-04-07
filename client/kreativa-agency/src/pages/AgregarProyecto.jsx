import axios from "axios";
import { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import AdminLayout from "../components/AdminLayout/AdminLayout";

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

const AgregarProyecto = () => {
    const [clientes, setClientes] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertVariant, setAlertVariant] = useState("danger");
    const [empleados, setEmpleados] = useState([]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const enviar = confirm("¿Desea enviar su proyecto?");

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
                setAlertMessage("Proyecto enviado correctamente.");
                setAlertVariant("success");
                setShowAlert(true);
                event.target.reset();
            }
        } catch (error) {
            console.error(error.message);

            setAlertMessage(
                "Error al enviar su proyecto, por favor trate nuevamente o comuniquese con el soporte técnico."
            );
            setAlertVariant("danger");
            setShowAlert(true);
        }
    };

    useEffect(() => {
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
                console.error(
                    `Error al obtener los clientes: ${error.message}`
                );
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
                console.error(
                    `Error al obtener los empleados: ${error.message}`
                );
            }
        }

        fetchEmpleados();
        fetchClientes();
    }, []);

    console.log(clientes);

    const getFechaHoy = () => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    };

    return (
        <div>
            <AdminLayout>
                <div className="container align-items-center justify-content-center">
                    <div className="p-4">
                        <h3 className="text-center section-title">
                            Agregar Proyecto
                        </h3>
                        <form onSubmit={handleSubmit}>
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
                            <div className="mb-3">
                                <label htmlFor="colab" className="form-label ">
                                    Colaboradores:
                                </label>
                                <select
                                    className="form-select form_input"
                                    name="colab"
                                    id="colab"
                                    multiple
                                >
                                    {empleados.map((colab) => (
                                        <option
                                            key={colab._id}
                                            value={colab._id}
                                        >
                                            {colab.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="mb-3 form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
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
                                            className="form-control form_input"
                                            id="fecha_entrega"
                                            name="fecha_entrega"
                                            required
                                            min={getFechaHoy()}
                                        />
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="thm-btn">
                                Enviar
                            </button>
                        </form>
                    </div>
                </div>
            </AdminLayout>
        </div>
    );
};

export default AgregarProyecto;
