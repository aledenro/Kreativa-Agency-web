import axios from "axios";
import Navbar from "../components/Navbar/Navbar";
import Alert from "react-bootstrap/Alert";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function construirJsonRequest(titulo, descripcion, urgente) {
    const user_id = localStorage.getItem("user_id");
    return {
        cliente_id: user_id,
        titulo: titulo,
        detalles: descripcion,
        urgente: urgente,
        historial_respuestas: [],
        estado: "Nuevo",
    };
}

const AgregarCotizacion = () => {
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertVariant, setAlertVariant] = useState("danger");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const enviar = confirm("¿Desea enviar su cotización?");

        if (!enviar) {
            return;
        }

        const formData = new FormData(event.target);

        const titulo = formData.get("titulo");
        const descripcion = formData.get("descripcion");
        const urgente = formData.get("urgente") === "on";

        const data = construirJsonRequest(titulo, descripcion, urgente);
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
                `${import.meta.env.VITE_API_URL}/cotizaciones/crear`,
                data,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.status == 201) {
                setAlertMessage("Cotización enviada correctamente.");
                setAlertVariant("success");
                setShowAlert(true);
                event.target.reset();
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
                "Error al enviar su cotización, por favor trate nuevamente o comuniquese con el soporte técnico."
            );
            setAlertVariant("danger");
            setShowAlert(true);
        }
    };

    return (
        <div>
            <Navbar></Navbar>
            <div className="container d-flex align-items-center justify-content-center">
                <div className="card p-4 shadow-lg w-50">
                    <h3 className="text-center section-title">
                        Agregar Cotización
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
                            <label htmlFor="titulo" className="form-label">
                                Titulo
                            </label>
                            <input
                                type="text"
                                className="form_input"
                                id="titulo"
                                name="titulo"
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
                        <button type="submit" className="thm-btn">
                            Enviar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AgregarCotizacion;
