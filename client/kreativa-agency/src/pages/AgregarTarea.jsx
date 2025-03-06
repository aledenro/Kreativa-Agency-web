import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Alert from "react-bootstrap/Alert";
import sendEmail from "../utils/emailSender";

function construirJsonRequest(
    proyecto,
    nombre,
    descripcion,
    colaborador,
    prioridad,
    fechaEntrega
) {
    const user_id = localStorage.getItem("user_id");

    return {
        proyecto_id: proyecto,
        nombre: nombre,
        descripcion: descripcion,
        colaborador_id: colaborador,
        prioridad: prioridad,
        fecha_vencimiento: fechaEntrega,
        log: [
            {
                usuario_id: user_id,
                accion: "Crear tarea.",
            },
        ],
        comentarios: [],
        estado: "Por Hacer",
    };
}

const AgregarTarea = () => {
    const [empleados, setEmpleados] = useState([]);
    const [proyectos, setProyectos] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertVariant, setAlertVariant] = useState("danger");
    const prioridades = ["Baja", "Media", "Alta"];

    const handleSubmit = async (event) => {
        event.preventDefault();

        const enviar = confirm("¿Desea enviar su tarea?");

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

        try {
            const res = await axios.post(
                "http://localhost:4000/api/tareas/crear",
                data
            );

            if (res.status == 201) {
                setAlertMessage("Tarea creada correctamente.");
                setAlertVariant("success");
                setShowAlert(true);
                event.target.reset();

                await sendEmail(
                    colab,
                    "Se le ha asignado una nueva tarea.",
                    "Nueva Asignación de Trabajo",
                    "Ver",
                    "test"
                );
            }
        } catch (error) {
            console.error(error.message);

            setAlertMessage(
                "Error al enviar la tarea, por favor trate nuevamente o comuniquese con el soporte técnico."
            );
            setAlertVariant("danger");
            setShowAlert(true);
        }
    };

    useEffect(() => {
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

        async function fetchProyectos() {
            try {
                const response = await axios.get(
                    "http://localhost:4000/api/proyectos/getAllProyectosLimitedData"
                );

                setProyectos(response.data.proyectos);
            } catch (error) {
                console.error(
                    `Error al obtener los proyectos: ${error.message}`
                );
            }
        }

        fetchProyectos();
        fetchEmpleados();
    }, []);

    return (
        <div>
            <Navbar></Navbar>
            <div className="container d-flex align-items-center justify-content-center">
                <div className="card p-4 shadow-lg w-50">
                    <h3 className="text-center section-title">Agregar Tarea</h3>
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
                            <label htmlFor="proyecto" className="form-label">
                                Proyecto
                            </label>
                            <select
                                className="form-select"
                                name="proyecto"
                                id="proyecto"
                            >
                                {proyectos.map((proyecto) => (
                                    <option
                                        key={proyecto._id}
                                        value={proyecto._id}
                                    >
                                        {proyecto.nombre}
                                    </option>
                                ))}
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
                            >
                                {empleados.map((colab) => (
                                    <option key={colab._id} value={colab._id}>
                                        {colab.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div className="mb-3">
                                    <label
                                        className="form-label"
                                        htmlFor="prioridad"
                                    >
                                        Prioridad
                                    </label>
                                    <select
                                        className="form-select"
                                        name="prioridad"
                                        id="prioridad"
                                    >
                                        {prioridades.map((prioridad) => (
                                            <option
                                                key={prioridad}
                                                value={prioridad}
                                            >
                                                {prioridad}
                                            </option>
                                        ))}
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
        </div>
    );
};

export default AgregarTarea;
