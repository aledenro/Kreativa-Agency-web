import React, { useState } from "react";
import { Form, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";

const { Dragger } = Upload;

const FormReclutaciones = () => {
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        correo: "",
        telefono: "",
        cv: null,
    });

    const [mensaje, setMensaje] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpload = (info) => {
        const { status, originFileObj } = info.file;
        if (status === "done") {
            message.success(`${info.file.name} subido correctamente.`);
            setFormData({ ...formData, cv: originFileObj });
        } else if (status === "error") {
            message.error(`${info.file.name} falló al subir.`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensaje("");
        setError("");

        try {
            const response = await axios.post(
                "http://localhost:4000/api/reclutaciones",
                formData
            );
            setMensaje("Formulario enviado exitosamente");
            setFormData({
                nombre: "",
                apellido: "",
                correo: "",
                telefono: "",
            });
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
            setError(
                "Hubo un error al enviar el formulario. Inténtalo de nuevo."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="container mt-4">
                <div className="mx-auto align-items-center justify-content-center d-flex">
                    <div className="col-xl-8">
                        <div className="section-title text-center">
                            <h2>Estámos contratando</h2>
                        </div>
                        <div>
                            <p className="mb-5 text-center">
                                En Kreativa estamos en búsqueda de talento
                                creativo y apasionado para formar parte de
                                nuestro equipo de marketing digital. Si te
                                encanta la innovación, el trabajo en equipo y
                                quieres crecer en un entorno dinámico, ¡esta es
                                tu oportunidad! Completa el formulario y
                                cuéntanos más sobre ti. Queremos conocerte.
                            </p>
                        </div>

                        {mensaje && <Alert variant="success">{mensaje}</Alert>}
                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form onSubmit={handleSubmit} className="contacto_form">
                            <div className="row">
                                <div className="col">
                                    <label className="form-label" for="nombre">
                                        Nombre
                                    </label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        required
                                        aria-label="Nombre"
                                        className="form_input"
                                    />
                                </div>
                                <div className="col">
                                    <label className="form-label">
                                        Apellido
                                    </label>
                                    <input
                                        className="form_input"
                                        type="text"
                                        name="apellido"
                                        value={formData.apellido}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <label className="form-label">
                                        Correo Electrónico
                                    </label>
                                    <input
                                        className="form_input"
                                        type="email"
                                        name="correo"
                                        value={formData.correo}
                                        onChange={handleChange}
                                        required
                                    />
                                    <label className="form-label">
                                        Teléfono
                                    </label>
                                    <input
                                        className="form_input"
                                        type="tel"
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="d-flex justify-content-center mt-3">
                                <button
                                    className="thm-btn form-btn"
                                    variant="primary"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Spinner animation="border" size="sm" />
                                    ) : (
                                        "Enviar"
                                    )}
                                </button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormReclutaciones;
