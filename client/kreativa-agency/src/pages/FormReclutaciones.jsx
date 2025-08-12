import React, { useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import { InboxOutlined } from "@ant-design/icons";
import { ConfigProvider, Upload, notification } from "antd";
import axios from "axios";
import fileUpload from "../utils/fileUpload";
import sendEmailExterno from "../utils/sendEmailExterno";
import { useFormStatus } from "../context/FormStatusContext";

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
    const [loading, setLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const [isHovered, setIsHovered] = useState(false);
    const [draggerKey, setDraggerKey] = useState(0);

    const { formActive, checkingStatus } = useFormStatus();

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    const showNotification = (type, message) => {
        api[type]({
            message: type === "success" ? "Éxito" : "Error",
            description: message,
            placement: "bottomRight",
            duration: 3,
        });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { nombre, apellido, correo, telefono } = formData;

        if (
            !nombre.trim() ||
            !apellido.trim() ||
            !correo.trim() ||
            !telefono.trim() ||
            files.length === 0
        ) {
            showNotification(
                "error",
                "Debes completar todos los campos y adjuntar un CV."
            );
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
            showNotification(
                "error",
                "Por favor ingresa un correo electrónico válido."
            );
            return;
        }

        const phoneRegex = /^[\d\s\+\-\(\)]+$/;
        if (!phoneRegex.test(telefono)) {
            showNotification(
                "error",
                "El teléfono solo debe contener números, espacios y los símbolos + - ( )"
            );
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/reclutaciones`,
                { nombre, apellido, correo, telefono, cv: [] }
            );

            const reclutacionId = response.data._id;
            let uploadedFiles = [];

            if (files.length > 0) {
                try {
                    uploadedFiles = await fileUpload(
                        files,
                        "landingpage",
                        "reclutacion",
                        reclutacionId
                    );

                    await axios.put(
                        `${import.meta.env.VITE_API_URL}/reclutaciones/actualizar/${reclutacionId}`,
                        { cv: uploadedFiles }
                    );
                } catch (error) {
                    console.error("Error al subir archivos:", error);
                    showNotification(
                        "error",
                        "No se pudo subir el CV. Inténtalo de nuevo."
                    );
                    await axios.delete(
                        `${import.meta.env.VITE_API_URL}/reclutaciones/${reclutacionId}`
                    );
                    throw error;
                }
            }

            showNotification("success", "Formulario enviado exitosamente.");

            setFormData({
                nombre: "",
                apellido: "",
                correo: "",
                telefono: "",
                cv: [],
            });
            setFiles([]);
            setDraggerKey((prev) => prev + 1);

            if (response.status === 201) {
                await sendEmailExterno(
                    formData.correo,
                    "Tu mensaje ha sido enviado. Pronto un miembro del equipo de Kreativa se pondrá en contacto.",
                    "Mensaje enviado"
                );
            }
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
            showNotification(
                "error",
                "Hubo un error al enviar el formulario. Inténtalo de nuevo."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (info) => {
        const allowedTypes = ["application/pdf"];

        if (info.fileList.length > 0) {
            const file = info.fileList[0].originFileObj;
            if (!allowedTypes.includes(file.type)) {
                showNotification("error", "Solo se permiten archivos PDF.");
                return;
            }

            setFiles([file]);
        } else {
            setFiles([]);
        }
    };

    if (checkingStatus || !formActive) {
        return <div style={{ height: "100px" }}></div>;
    }

    return (
        <div style={{ position: "relative" }}>
            {contextHolder}
            <img
                src="https://kreativa-public.s3.us-east-2.amazonaws.com/landing/img/75.svg"
                alt="decoración"
                className="doodle-top-left"
            />
            <img
                src="https://kreativa-public.s3.us-east-2.amazonaws.com/landing/img/103.svg"
                alt="decoración"
                className="doodle-bottom-right"
            />
            <div className="container mt-4">
                <div className="mx-auto align-items-center justify-content-center d-flex">
                    <div className="col-lg-8 mx-4 form-container">
                        <div className="section-title text-center">
                            <h2 className="main-heading">
                                Estámos contratando
                            </h2>
                            <p className="mb-5 text-center subtitle">
                                En Kreativa estamos en búsqueda de talento
                                creativo y apasionado para formar parte de
                                nuestro equipo de marketing digital. Si te
                                encanta la innovación, el trabajo en equipo y
                                quieres crecer en un entorno dinámico, ¡esta es
                                tu oportunidad! Completa el formulario y
                                cuéntanos más sobre ti. Queremos conocerte.
                            </p>
                        </div>

                        <Form
                            onSubmit={handleSubmit}
                            className="contacto_form"
                            noValidate
                        >
                            <div className="row">
                                <div className="col">
                                    <label
                                        className="form-label"
                                        htmlFor="nombre"
                                    >
                                        Nombre{" "}
                                        <span className="text-danger">*</span>
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
                                        Apellido{" "}
                                        <span className="text-danger">*</span>
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
                                        Correo Electrónico{" "}
                                        <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        className="form_input"
                                        type="text"
                                        name="correo"
                                        value={formData.correo}
                                        onChange={handleChange}
                                    />
                                    <label className="form-label">
                                        Teléfono{" "}
                                        <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        className="form_input"
                                        type="text"
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="row mb-5">
                                <div className="col">
                                    <label className="form-label">
                                        Envíanos tu CV{" "}
                                        <span className="text-danger">*</span>
                                    </label>
                                    <ConfigProvider
                                        theme={{
                                            components: {
                                                Upload: {
                                                    lineWidth: "1px",
                                                    lineType: "solid",
                                                    colorBorder: "#8788ab",
                                                    colorBgContainer:
                                                        "transparent",
                                                },
                                            },
                                        }}
                                    >
                                        <Dragger
                                            key={draggerKey}
                                            name="file"
                                            multiple={false}
                                            action="#"
                                            beforeUpload={() => false}
                                            onChange={handleFileChange}
                                            className="custom-dragger"
                                            accept=".pdf"
                                            maxCount={1}
                                            style={{
                                                borderRadius: "12px",
                                                borderColor: isHovered
                                                    ? "#110d27"
                                                    : "#eee",
                                                borderWidth: "1px",
                                                borderStyle: "solid",
                                                backgroundColor: "white",
                                                transition: "border-color 0.3s",
                                            }}
                                            onMouseEnter={handleMouseEnter}
                                            onMouseLeave={handleMouseLeave}
                                        >
                                            <p className="ant-upload-drag-icon custom-icon">
                                                <InboxOutlined
                                                    style={{
                                                        color: isHovered
                                                            ? "#110d27"
                                                            : "#8788ab",
                                                        transition:
                                                            "color 0.3s",
                                                    }}
                                                />
                                            </p>
                                            <p className="ant-upload-text">
                                                Haz clic o arrastra tu archivo
                                                aquí para subirlo
                                            </p>
                                            <p className="ant-upload-hint">
                                                Solo se permite subir un archivo
                                                PDF.
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
                                    style={{
                                        margin: "20px",
                                    }}
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
