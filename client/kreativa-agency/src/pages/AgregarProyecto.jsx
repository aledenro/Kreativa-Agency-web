import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Alert from "react-bootstrap/Alert";

function construirJsonRequest(
    nombre,
    descripcion,
    cliente,
    urgente,
    fechaEntrega
) {
    return {
        cliente_id: cliente,
        nombre: nombre,
        descripcion: descripcion,
        urgente: urgente,
        fecha_entrega: fechaEntrega,
        log: [
            {
                usuario_id: "679834de23a11c303cf6c6b5",
                accion: "Crear proyecto.",
            },
        ],
        notificiaciones: [],
        estado: "Por Hacer",
    };
}

const AgregarProyecto = () => {
    const [clientes, setClientes] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertVariant, setAlertVariant] = useState("danger");

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

        const data = construirJsonRequest(
            nombre,
            descripcion,
            cliente,
            urgente,
            fechaEntrega
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
                const response = await axios.get(
                    "http://localhost:4000/api/usuarios/clientes"
                );

                setClientes(response.data);
            } catch (error) {
                console.error(
                    `Error al obtener los clientes: ${error.message}`
                );
            }
        }

        fetchClientes();
    }, []);

    console.log(clientes);

    return (
        <div>
            <Navbar></Navbar>
            <div className="container d-flex align-items-center justify-content-center">
                <div className="card p-4 shadow-lg w-50">
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
                            <label htmlFor="descripcion" className="form-label">
                                Descripción
                            </label>
                            <textarea
                                name="descripcion"
                                className="form_text_area"
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
                                className="form-select"
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

export default AgregarProyecto;
