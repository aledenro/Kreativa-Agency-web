import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { Checkbox } from "@heroui/react";

const FormContacto = () => {
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        correo: "",
        telefono: "",
        nombre_negocio: "",
        dedicacion_negocio: "",
        link_sitio_web: "",
        redes_sociales: [""],
        objetivos: "",
        servicios_id: [],
    });

    const [servicios, setServicios] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchServicios = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:4000/api/servicios/nombres"
                );

                if (Array.isArray(response.data)) {
                    setServicios(response.data);
                } else {
                    setServicios([]);
                }
            } catch (err) {
                console.error("Error al cargar los servicios:", err);
                setError("No se pudieron cargar los servicios.");
            }
        };

        fetchServicios();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            servicios_id: checked
                ? [...prevState.servicios_id, value]
                : prevState.servicios_id.filter((id) => id !== value),
        }));
    };

    const handleRedesChange = (index, value) => {
        const nuevasRedes = [...formData.redes_sociales];
        nuevasRedes[index] = value;
        setFormData((prevData) => ({
            ...prevData,
            redes_sociales: nuevasRedes,
        }));
    };

    const agregarRedSocial = () => {
        setFormData((prevData) => ({
            ...prevData,
            redes_sociales: [...prevData.redes_sociales, ""],
        }));
    };

    const eliminarRedSocial = (index) => {
        setFormData((prevData) => {
            if (prevData.redes_sociales.length > 1) {
                const nuevasRedes = prevData.redes_sociales.filter(
                    (_, i) => i !== index
                );
                return {
                    ...prevData,
                    redes_sociales: nuevasRedes.length ? nuevasRedes : [""],
                };
            }
            return prevData;
        });
    };

    const handleFocus = (index) => {
        if (index === formData.redes_sociales.length - 1) {
            agregarRedSocial();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensaje("");
        setError("");

        try {
            const response = await axios.post(
                "http://localhost:4000/api/contacto",
                formData
            );
            setMensaje("Formulario enviado exitosamente");
            setFormData({
                nombre: "",
                apellido: "",
                correo: "",
                telefono: "",
                nombre_negocio: "",
                dedicacion_negocio: "",
                link_sitio_web: "",
                redes_sociales: [""],
                objetivos: "",
                servicios_id: [],
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
                            <h2>Contactá con nosotros</h2>
                        </div>
                        <div>
                            <p className="mb-5">
                                "¡Lleva tu negocio al siguiente nivel! Déjanos
                                tus datos y uno de nuestros expertos en
                                marketing digital se pondrá en contacto contigo
                                para ofrecerte una solución personalizada."
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
                                </div>
                                <div className="col">
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

                            <div className="row">
                                <div className="col">
                                    <label className="form-label">
                                        Nombre del Negocio
                                    </label>
                                    <input
                                        className="form_input"
                                        type="text"
                                        name="nombre_negocio"
                                        value={formData.nombre_negocio}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <label className="form-label">
                                        Dedicación del Negocio
                                    </label>
                                    <textarea
                                        className="form_input form-textarea"
                                        type="text"
                                        rows="3"
                                        name="dedicacion_negocio"
                                        value={formData.dedicacion_negocio}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <label className="form-label">
                                        Link del Sitio Web
                                    </label>
                                    <input
                                        className="form_input"
                                        type="url"
                                        placeholder="https://..."
                                        name="link_sitio_web"
                                        value={formData.link_sitio_web}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <label className="form-label">
                                        Redes Sociales
                                    </label>
                                    {formData.redes_sociales.map(
                                        (red, index) => (
                                            <div
                                                key={index}
                                                className="d-flex align-items-center mb-2"
                                            >
                                                <input
                                                    className="form_input"
                                                    type="url"
                                                    placeholder="https://..."
                                                    value={red}
                                                    onChange={(e) =>
                                                        handleRedesChange(
                                                            index,
                                                            e.target.value
                                                        )
                                                    }
                                                    onFocus={() =>
                                                        handleFocus(index)
                                                    }
                                                    required
                                                />
                                                {index > 0 && (
                                                    <button
                                                        type="button"
                                                        className="icon-btn inline-btn"
                                                        onClick={() =>
                                                            eliminarRedSocial(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faX}
                                                        />
                                                    </button>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <label className="form-label">
                                        Objetivos
                                    </label>
                                    <textarea
                                        className="form_input form-textarea"
                                        as="textarea"
                                        name="objetivos"
                                        value={formData.objetivos}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <label className="form-label">
                                        Servicios
                                    </label>
                                    {servicios.length > 0 ? (
                                        <div className="row row-cols-2">
                                            {servicios.map((servicio) => (
                                                <div
                                                    className="col"
                                                    key={servicio._id}
                                                >
                                                    <Form.Check
                                                        type="checkbox"
                                                        label={servicio.nombre}
                                                        value={servicio._id}
                                                        checked={formData.servicios_id.includes(
                                                            servicio._id
                                                        )}
                                                        onChange={
                                                            handleCheckboxChange
                                                        }
                                                        className="custom-checkbox"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>No tenemos servicios disponibles </p>
                                    )}
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

export default FormContacto;
