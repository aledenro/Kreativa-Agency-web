import axios from "axios";
import { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import sendEmail from "../utils/emailSender";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import { useNavigate } from "react-router-dom";

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
    const navigate = useNavigate();

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

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/tareas/crear`,
                data,
                { headers: { Authorization: `Bearer ${token}` } }
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
                "Error al enviar la tarea, por favor trate nuevamente o comuniquese con el soporte técnico."
            );
            setAlertVariant("danger");
            setShowAlert(true);
        }
    };

    const getFechaHoy = () => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    };

    useEffect(() => {
        async function fetchEmpleados() {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    navigate("/error", {
                        state: {
                            errorCode: 401,
                            mensaje: "Debe iniciar sesión para continuar.",
                        },
                    });
                }

                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/usuarios/empleados`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                setEmpleados(response.data);
            } catch (error) {
                if (error.status === 401) {
                    navigate("/error", {
                        state: {
                            errorCode: 401,
                            mensaje:
                                "Debe volver a iniciar sesión para continuar.",
                        },
                    });
                    return;
                }
                console.error(`Error al obtener los empleados`);
            }
        }

        async function fetchProyectos() {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/error", {
                    state: {
                        errorCode: 401,
                        mensaje: "Debe iniciar sesión para continuar.",
                    },
                });
            }

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/proyectos/getAllProyectosLimitedData`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                setProyectos(response.data.proyectos);
            } catch (error) {
                if (error.status === 401) {
                    navigate("/error", {
                        state: {
                            errorCode: 401,
                            mensaje:
                                "Debe volver a iniciar sesión para continuar.",
                        },
                    });
                    return;
                }
                console.error(`Error al obtener los proyectos`);
            }
        }

        fetchProyectos();
        fetchEmpleados();
    }, []);

    return (
        <div>
            <AdminLayout>
                <div className="container d-flex align-items-center justify-content-center">
                    <div className="card p-4 shadow-lg w-50">
                        <h3 className="text-center section-title">
                            Agregar Tarea
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
                                    rows={7}
                                    placeholder="Describa su solicitud"
                                    required
                                ></textarea>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="colab" className="form-label ">
                                    Colaborador
                                </label>
                                <select
                                    className="form-select form_input"
                                    name="colab"
                                    id="colab"
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

export default AgregarTarea;
