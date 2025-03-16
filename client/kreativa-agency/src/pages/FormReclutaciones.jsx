import React, { useState } from "react";
import { Form, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import { InboxOutlined } from "@ant-design/icons";
import { ConfigProvider, Upload } from "antd";
import fileUpload from "../utils/fileUpload";

const { Dragger } = Upload;

const FormReclutaciones = () => {
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        correo: "",
        telefono: "",
        cv: [],
    });
    const [files, setFiles] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensaje("");
        setError("");

        const { nombre, apellido, correo, telefono } = formData;

        if (
            !nombre.trim() ||
            !apellido.trim() ||
            !correo.trim() ||
            !telefono.trim() ||
            files.length === 0
        ) {
            setError("Debes completar todos los campos y adjuntar un CV.");
            setTimeout(() => setError(""), 3000);
            setLoading(false);
            return;
        }

        try {
            console.log("Enviando datos sin archivos:", {
                nombre,
                apellido,
                correo,
                telefono,
            });

            const response = await axios.post(
                "http://localhost:4000/api/reclutaciones",
                {
                    nombre,
                    apellido,
                    correo,
                    telefono,
                    cv: [],
                }
            );

            const reclutacionId = response.data._id;
            let uploadedFiles = [];

            if (files.length > 0) {
                try {
                    uploadedFiles = await fileUpload(
                        files,
                        "reclutaciones",
                        "cv",
                        reclutacionId
                    );

                    await axios.put(
                        `http://localhost:4000/api/reclutaciones/actualizar/${reclutacionId}`,
                        {
                            uploadedFiles,
                        }
                    );
                } catch (error) {
                    console.error(
                        "Error al subir archivos:",
                        error.response?.data || error.message
                    );
                    setError("No se pudo subir el CV. Inténtalo de nuevo.");
                    setTimeout(() => setError(""), 3000);
                    setLoading(false);
                    return;
                }
            }

            setMensaje("Formulario enviado exitosamente.");
            setFormData({
                nombre: "",
                apellido: "",
                correo: "",
                telefono: "",
                cv: [],
            });
            setFiles([]);
        } catch (error) {
            console.error(
                "Error al enviar el formulario:",
                error.response?.data || error.message
            );
            setError(
                "Hubo un error al enviar el formulario. Inténtalo de nuevo."
            );
        } finally {
            setLoading(false);
            setTimeout(() => setMensaje(""), 3000);
        }
    };

    const handleFileChange = (info) => {
        const allowedTypes = ["application/pdf", "application/msword"];

        if (info.fileList.length > 0) {
            const file = info.fileList[0].originFileObj;
            if (!allowedTypes.includes(file.type)) {
                setError("Solo se permiten archivos PDF o Word.");
                setTimeout(() => setError(""), 3000);
                return;
            }

            setFiles([file]);
        } else {
            setFiles([]);
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
                                    />
                                </div>
                            </div>
                            <div className="row mb-5">
                                <div className="col">
                                    <label className="form-label">
                                        Envíanos tu CV
                                    </label>
                                    <ConfigProvider
                                        theme={{
                                            components: {
                                                Upload: {
                                                    colorBorder: "#ffebf4",
                                                    lineWidth: "0",
                                                },
                                            },
                                        }}
                                    >
                                        <Dragger
                                            name="file"
                                            multiple={false}
                                            action="#"
                                            beforeUpload={() => false}
                                            onChange={handleFileChange}
                                            className="custom-dragger"
                                        >
                                            <p className="ant-upload-drag-icon custom-icon">
                                                <InboxOutlined />
                                            </p>
                                            <p className="ant-upload-text">
                                                Haz clic o arrastra tu archivo
                                                aquí para subirlo
                                            </p>
                                            <p className="ant-upload-hint">
                                                Solo se permite subir archivos
                                                PDF o Word.
                                            </p>
                                        </Dragger>
                                    </ConfigProvider>
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
