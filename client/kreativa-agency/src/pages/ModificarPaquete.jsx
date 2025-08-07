import React, { useState, useEffect } from "react";
import { Form, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import { notification } from "antd";

const ModificarPaquete = () => {
    const { servicioId, paqueteId } = useParams();
    const navigate = useNavigate();
    const [paqueteEditado, setPaqueteEditado] = useState({
        nombre: "",
        descripcion: "",
        nivel: "",
        duracion: "",
        beneficios: [""],
        precio: "",
    });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        const fetchPaquete = async () => {
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
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/servicios/${servicioId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                const servicio = res.data;

                const paquete = servicio.paquetes.find(
                    (p) => p._id === paqueteId
                );

                if (!paquete) {
                    throw new Error("Paquete no encontrado en el servicio");
                }

                setPaqueteEditado(paquete);
                setLoading(false);
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
                console.error("Error al obtener el paquete");
                openErrorNotification("Error al cargar los datos del paquete");
                setLoading(false);
            }
        };

        fetchPaquete();
    }, [servicioId, paqueteId]);

    if (loading) {
        return (
            <div className="container my-5 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    const openSuccessNotification = (message) => {
        api.success({
            message: "Éxito",
            description: message,
            placement: "top",
            duration: 4,
        });
    };

    const openErrorNotification = (message) => {
        api.error({
            message: "Error",
            description: message,
            placement: "top",
            duration: 4,
        });
    };

    if (!paqueteEditado) {
        return (
            <div className="container my-5 text-center">
                <p className="text-danger">
                    No se pudo cargar la información del paquete.
                </p>
            </div>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPaqueteEditado((prev) => ({ ...prev, [name]: value }));
    };

    const handleBeneficioChange = (index, value) => {
        const nuevosBeneficios = [...paqueteEditado.beneficios];
        nuevosBeneficios[index] = value;
        setPaqueteEditado((prev) => ({
            ...prev,
            beneficios: nuevosBeneficios,
        }));
    };

    const agregarBeneficio = () => {
        setPaqueteEditado((prev) => ({
            ...prev,
            beneficios: [...prev.beneficios, ""],
        }));
    };

    const eliminarBeneficio = (index) => {
        if (paqueteEditado.beneficios.length > 1) {
            const nuevosBeneficios = paqueteEditado.beneficios.filter(
                (_, i) => i !== index
            );
            setPaqueteEditado((prev) => ({
                ...prev,
                beneficios: nuevosBeneficios,
            }));
        }
    };

    const handleFocus = (index) => {
        if (index === paqueteEditado.beneficios.length - 1) {
            agregarBeneficio();
        }
    };

    const handleSubmit = async () => {
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
            const res = await axios.put(
                `${import.meta.env.VITE_API_URL}/servicios/${servicioId}/paquetes/${paqueteId}`,
                paqueteEditado,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Respuesta del backend:", res.data);
            openSuccessNotification("Paquete editado exitosamente");
            setShowModal(false);

            setTimeout(() => {
                navigate("/admin/paquetes");
            }, 2000);
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
            console.error("Error al editar el paquete");
            openErrorNotification("Error al editar el paquete");
            setShowModal(false);
        }
    };

    return (
        <div>
            <AdminLayout>
                <div className="container main-container">
                    <div className="section-title text-center">
                        <h2>Editar Paquete</h2>
                    </div>
                    <div className="mx-auto align-items-center justify-content-center d-flex">
                        <div className="col-xl-8">
                            {contextHolder}
                            <Form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    setShowModal(true);
                                }}
                                className="paquete_form"
                            >
                                <div className="row">
                                    <div className="col">
                                        <label className="form-label">
                                            Nombre del paquete
                                        </label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            className="form_input"
                                            value={paqueteEditado.nombre}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col">
                                        <label className="form-label">
                                            Nivel
                                        </label>
                                        <input
                                            type="text"
                                            name="nivel"
                                            className="form_input"
                                            value={paqueteEditado.nivel}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <label className="form-label">
                                            Duración
                                        </label>
                                        <input
                                            type="text"
                                            name="duracion"
                                            className="form_input"
                                            value={paqueteEditado.duracion}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col">
                                        <label className="form-label">
                                            Precio
                                        </label>
                                        <input
                                            type="number"
                                            name="precio"
                                            className="form_input"
                                            value={paqueteEditado.precio}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <label className="form-label">
                                            Descripción
                                        </label>
                                        <textarea
                                            name="descripcion"
                                            className="form_input form_textarea"
                                            rows="3"
                                            value={paqueteEditado.descripcion}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <label className="form-label">
                                            Beneficios
                                        </label>
                                        {paqueteEditado.beneficios.map(
                                            (beneficio, index) => (
                                                <div
                                                    key={index}
                                                    className="d-flex align-items-center mb-2"
                                                >
                                                    <input
                                                        type="text"
                                                        className="form_input"
                                                        value={beneficio}
                                                        onChange={(e) =>
                                                            handleBeneficioChange(
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
                                                            className="icon-btn"
                                                            onClick={() =>
                                                                eliminarBeneficio(
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
                                <div className="d-flex justify-content-center mt-3">
                                    <button
                                        type="submit"
                                        className="thm-btn form-btn"
                                    >
                                        Guardar Cambios
                                    </button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </AdminLayout>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Modificación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Seguro que desea modificar este paquete?
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
                        onClick={handleSubmit}
                    >
                        Sí
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ModificarPaquete;
