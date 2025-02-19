import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";

function jsonRequests(nombre, descripcion, categoria) {
    return {
        nombre: nombre,
        descripcion: descripcion,
        categoria: categoria,
        paquetes: [],
    };
}

const AgregarServicio = () => {
    // para validar si se completo y avisar que se agrego
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertVariant, setAlertVariant] = useState("danger");

    const handleSubmit = async (event) => {
        event.preventDefault();

        const nombre = event.target.nombre.value.trim();
        const descripcion = event.target.descripcion.value.trim();
        const categoria = event.target.categoria.value.trim();

        if (!nombre || !descripcion || !categoria) {
            setAlertMessage("Todos los campos son obligatorios");
            setAlertVariant("danger");
            setShowAlert(true);
            return;
        }

        const data = jsonRequests(nombre, descripcion, categoria);

        try {
            const res = await axios.post(
                "http://localhost:4000/api/servicios/agregar",
                data
            );
            console.log(res.data);
            setAlertMessage("Servicio agregado exitosamente.");
            setAlertVariant("success");
            setShowAlert(true);
            event.target.reset();
        } catch (error) {
            console.error(error.message);
            setAlertMessage("Hubo un error al agregar el servicio.");
            setAlertVariant("danger");
            setShowAlert(true);
        }
    };

    return (
        <div>
            <Navbar></Navbar>
            <div className="container">
                <div className="section-title text-center">
                    <h2>Agregar nuevo servicio</h2>
                </div>
                <div className="mx-auto align-items-center justify-content-center d-flex">
                    <div className="col-xl-8">
                        {showAlert && (
                            <Alert
                                variant={alertVariant}
                                onClose={() => setShowAlert(false)}
                                dismissible
                            >
                                {alertMessage}
                            </Alert>
                        )}
                        <Form onSubmit={handleSubmit} className="servicio_form">
                            <div className="row">
                                <div className="">
                                    <label
                                        htmlFor="nombre"
                                        className="form-label"
                                    >
                                        Nombre del servicio
                                    </label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        className="form_input"
                                    />
                                </div>
                                <div className="col">
                                    <label
                                        htmlFor="nombre"
                                        className="form-label"
                                    >
                                        Categoría del servicio
                                    </label>
                                    <input
                                        type="text"
                                        name="categoria"
                                        className="form_input"
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <label
                                        className="form-label"
                                        htmlFor="nombre"
                                    >
                                        Descripción
                                    </label>
                                    <textarea
                                        placeholder="Describa la información del paquete aquí..."
                                        name="descripcion"
                                        className="form_input form-textarea"
                                    />
                                    <div className="d-flex justify-content-center mt-3">
                                        <button
                                            type="submit"
                                            className="thm-btn form-btn"
                                        >
                                            Agregar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgregarServicio;
