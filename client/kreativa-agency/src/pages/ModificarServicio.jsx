import React, { useState, useEffect } from "react";
import { Form, Alert, Modal } from "react-bootstrap";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout/AdminLayout";

const ModificarServicio = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [servicio, setServicio] = useState({
        nombre: "",
        descripcion: "",
        categoria_id: "",
    });
    const [categorias, setCategorias] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertVariant, setAlertVariant] = useState("danger");
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchServicio = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:4000/api/servicios/${id}`
                );
                setServicio(res.data);
            } catch (error) {
                console.error("Error al obtener el servicio: ", error.message);
                setAlertMessage(
                    "No se pudo cargar la información del servicio"
                );
                setAlertVariant("danger");
                setShowAlert(true);
            }
        };

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

        fetchServicio();
        fetchCategorias();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setServicio((prevServicio) => ({ ...prevServicio, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (
            !servicio.nombre ||
            !servicio.descripcion ||
            !servicio.categoria_id
        ) {
            setAlertMessage("Todos los campos son obligatorios");
            setAlertVariant("danger");
            setShowAlert(true);
            return;
        }
        setShowModal(true);
    };

    const handleConfirm = async () => {
        try {
            await axios.put(
                `http://localhost:4000/api/servicios/modificar/${id}`,
                servicio
            );
            setAlertMessage("Servicio modificado exitosamente");
            setAlertVariant("success");
            setShowAlert(true);
            setShowModal(false);
            setTimeout(() => navigate("/servicios"), 2000);
        } catch (error) {
            console.error("Error al modificar el servicio: ", error.message);
            setAlertMessage("Hubo un error al modificar el servicio");
            setAlertVariant("danger");
            setShowAlert(true);
            setShowModal(false);
        }
    };

    return (
        <div>
            <AdminLayout>
                <div className="container main-container">
                    <div className="section-title text-center">
                        <h2>Modificar Servicio</h2>
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
                            <Form
                                onSubmit={handleSubmit}
                                className="servicio_form"
                            >
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
                                            value={servicio.nombre}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col">
                                        <label
                                            htmlFor="categoria"
                                            className="form-label"
                                        >
                                            Categoría
                                        </label>
                                        <Form.Select
                                            name="categoria_id"
                                            className="form_input"
                                            value={servicio.categoria_id}
                                            onChange={handleChange}
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
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <label
                                            htmlFor="descripcion"
                                            className="form-label"
                                        >
                                            Descripción
                                        </label>
                                        <textarea
                                            name="descripcion"
                                            className="form_input form-textarea"
                                            value={servicio.descripcion}
                                            onChange={handleChange}
                                            required
                                        ></textarea>
                                        <div className="d-flex justify-content-center mt-3">
                                            <button
                                                type="submit"
                                                className="thm-btn form-btn"
                                            >
                                                Modificar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>

                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmación</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        ¿Está seguro que desea modificar este servicio?
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            className="thm-btn thm-btn-small btn-rojo"
                            onClick={() => setShowModal(false)}
                        >
                            No
                        </button>
                        <button
                            className="thm-btn thm-btn-small"
                            onClick={handleConfirm}
                        >
                            Sí
                        </button>
                    </Modal.Footer>
                </Modal>
            </AdminLayout>
        </div>
    );
};

export default ModificarServicio;
