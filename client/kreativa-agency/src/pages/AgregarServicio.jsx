import React, { useState, useEffect } from "react";
import { Form, Alert, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";
import fileUpload from "../utils/fileUpload";

const AgregarServicio = () => {
    const [categorias, setCategorias] = useState([]);
    const [selectedCategoria, setSelectedCategoria] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [nuevaCategoria, setNuevaCategoria] = useState("");
    const [files, setFiles] = useState([]);

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertVariant, setAlertVariant] = useState("danger");

    const fetchCategorias = async () => {
        try {
            const res = await axios.get(
                "http://localhost:4000/api/servicios/categorias"
            );
            setCategorias(res.data);
        } catch (error) {
            console.error("Error cargando categorias:", error);
        }
    };

    useEffect(() => {
        fetchCategorias();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const nombre = event.target.nombre.value.trim();
        const descripcion = event.target.descripcion.value.trim();

        if (!nombre || !descripcion || !selectedCategoria) {
            setAlertMessage("Debes completar todos los campos.");
            setAlertVariant("danger");
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
            return;
        }

        try {
            const res = await axios.post(
                "http://localhost:4000/api/servicios/agregar",
                {
                    nombre,
                    descripcion,
                    categoria_id: selectedCategoria,
                    imagenes: [],
                }
            );

            const servicioId = res.data._id;

            let imagenes = [];
            if (files.length > 0) {
                try {
                    imagenes = await fileUpload(
                        files,
                        "landingpage",
                        "servicios",
                        servicioId
                    );

                    await axios.put(
                        `http://localhost:4000/api/servicios/modificar/${servicioId}`,
                        { imagenes }
                    );
                } catch (error) {
                    console.error("Error al subir archivos:", error);
                    setAlertMessage("No se pudieron subir las imágenes.");
                    setAlertVariant("danger");
                    setShowAlert(true);
                    return;
                }
            }

            setAlertMessage("Servicio agregado exitosamente.");
            setAlertVariant("success");
            setShowAlert(true);
            event.target.reset();
            setSelectedCategoria("");
            setFiles([]);
        } catch (error) {
            console.error("Error al agregar el servicio:", error);
            setAlertMessage("Hubo un error al agregar el servicio.");
            setAlertVariant("danger");
            setShowAlert(true);
        } finally {
            setTimeout(() => setShowAlert(false), 3000);
        }
    };

    const handleFileChange = (event) => {
        setFiles(Array.from(event.target.files));
    };

    const handleAgregarCategoria = async () => {
        if (!nuevaCategoria.trim()) {
            alert("Debes agregar un nombre a la categoría");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:4000/api/servicios/categorias",
                {
                    nombre: nuevaCategoria,
                }
            );

            await fetchCategorias();

            setSelectedCategoria(response.data._id);
            setShowModal(false);
            setNuevaCategoria("");
        } catch (error) {
            console.error("Error al agragar la categoria:", error);
            if (error.response) {
                console.error("Detalles del error:", error.response.data);
                alert(
                    `Error del servidor: ${
                        error.response.data.message ||
                        "No se pudo agregar la categoría"
                    }`
                );
            } else {
                alert("Error de conexión con el servidor.");
            }
        }
    };

    return (
        <div>
            <Navbar />
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
                                        required
                                    />
                                </div>
                                <div className="col">
                                    <div className="flex-grow-1">
                                        <label
                                            htmlFor="categoria"
                                            className="form-label"
                                        >
                                            Categoría del servicio
                                        </label>
                                        <div className="d-flex align-items-center gap-2">
                                            <Form.Select
                                                name="categoria"
                                                className="form_input"
                                                value={selectedCategoria}
                                                onChange={(e) =>
                                                    setSelectedCategoria(
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            >
                                                <option value="">
                                                    Seleccione una categoría
                                                </option>
                                                {categorias.map((cat) => (
                                                    <option
                                                        key={cat._id}
                                                        value={cat._id}
                                                    >
                                                        {cat.nombre}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            <button
                                                type="button"
                                                className="inline-btn btn-verde"
                                                onClick={() =>
                                                    setShowModal(true)
                                                }
                                            >
                                                Nueva
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <label
                                        className="form-label"
                                        htmlFor="descripcion"
                                    >
                                        Descripción
                                    </label>
                                    <textarea
                                        placeholder="Describa la información del paquete aquí..."
                                        name="descripcion"
                                        className="form_input form-textarea"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <label
                                        className="form-label"
                                        htmlFor="imagenes"
                                    >
                                        Imágenes del servicio
                                    </label>
                                    <input
                                        required
                                        type="file"
                                        name="files"
                                        id="files"
                                        multiple
                                        className="form_input form-control"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>
                            <div className="d-flex justify-content-center mt-3">
                                <button
                                    type="submit"
                                    className="thm-btn form-btn"
                                >
                                    Agregar
                                </button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear nueva categoría</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <label className="form-label">
                            Nombre de la nueva categoría
                        </label>
                        <input
                            type="text"
                            className="form_input"
                            value={nuevaCategoria}
                            onChange={(e) => setNuevaCategoria(e.target.value)}
                        />
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className="thm-btn-2 thm-btn-small"
                        onClick={() => setShowModal(false)}
                    >
                        Cancelar
                    </button>
                    <button
                        className="thm-btn thm-btn-small"
                        onClick={handleAgregarCategoria}
                    >
                        Guardar
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AgregarServicio;
