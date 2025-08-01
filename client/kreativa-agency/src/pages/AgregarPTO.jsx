import "../App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import { CalendarCheck } from "lucide-react";

const AgregarPTO = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        empleado_id: "",
        fecha_inicio: "",
        fecha_fin: "",
        comentario: "",
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    Swal.fire({
                        title: "Error",
                        text: "No hay token disponible. Inicia sesión nuevamente.",
                        icon: "error",
                        confirmButtonColor: "#ff0072",
                    });
                    return;
                }

                const decoded = jwtDecode(token);
                if (decoded && decoded.id) {
                    setFormData((prev) => ({
                        ...prev,
                        empleado_id: decoded.id,
                    }));
                } else {
                    Swal.fire({
                        title: "Error",
                        text: "No se pudo obtener la información del usuario.",
                        icon: "error",
                        confirmButtonColor: "#ff0072",
                    });
                }
            } catch (error) {
                console.error("Error al obtener el usuario:", error);
                Swal.fire({
                    title: "Error",
                    text: "Hubo un problema al obtener los datos del usuario.",
                    icon: "error",
                    confirmButtonColor: "#ff0072",
                });
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    };


    const validateForm = () => {
        let newErrors = {};

        if (!formData.fecha_inicio)
            newErrors.fecha_inicio = "La fecha de inicio es obligatoria";

        if (!formData.fecha_fin)
            newErrors.fecha_fin = "La fecha de fin es obligatoria";

        if (
            formData.fecha_inicio &&
            formData.fecha_fin &&
            new Date(formData.fecha_inicio) > new Date(formData.fecha_fin)
        ) {
            newErrors.fecha_fin =
                "La fecha de fin debe ser posterior a la fecha de inicio";
        }

        if (!formData.comentario.trim())
            newErrors.comentario = "El comentario es obligatorio";

        setErrors(newErrors);
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            // Si hay un error específico en comentario, lo mostramos como prioridad
            if (validationErrors.comentario) {
                Swal.fire({
                    title: "Campo requerido",
                    text: validationErrors.comentario,
                    icon: "warning",
                    confirmButtonColor: "#ff0072",
                });
            } else {
                Swal.fire({
                    title: "Formulario incompleto",
                    text: "Por favor, completá todos los campos obligatorios correctamente.",
                    icon: "warning",
                    confirmButtonColor: "#ff0072",
                });
            }
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                Swal.fire({
                    title: "Error",
                    text: "No hay token disponible.",
                    icon: "error",
                    confirmButtonColor: "#ff0072",
                });
                return;
            }

            await axios.post(`${import.meta.env.VITE_API_URL}/pto`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            Swal.fire({
                title: "¡Éxito!",
                text: "Tu solicitud de PTO fue enviada correctamente.",
                icon: "success",
                confirmButtonColor: "#ff0072",
            }).then(() => {
                navigate("/mis-pto");
            });
        } catch (error) {
            console.error("Error al enviar PTO:", error);
            Swal.fire({
                title: "Error",
                text: "Hubo un problema al enviar la solicitud. Inténtalo nuevamente.",
                icon: "error",
                confirmButtonColor: "#ff0072",
            });
        }
    };

    return (
        <AdminLayout>
            <div className="kreativa-pto-wrapper">
                <div className="kreativa-pto-card">
                    <div className="text-center mb-3">
                        <CalendarCheck size={60} color="#ff0072" strokeWidth={2.5} />
                    </div>
                    <h2 className="kreativa-title">Solicitar PTO</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <label className="form-label">Fecha de Inicio</label>
                            <input
                                type="date"
                                name="fecha_inicio"
                                value={formData.fecha_inicio}
                                onChange={handleChange}
                                className="form_input"
                                min={getTodayDate()}
                                required
                            />
                            {errors.fecha_inicio && (
                                <small className="text-danger">{errors.fecha_inicio}</small>
                            )}
                        </div>

                        <div className="form-group mb-3">
                            <label className="form-label">Fecha de Fin</label>
                            <input
                                type="date"
                                name="fecha_fin"
                                value={formData.fecha_fin}
                                onChange={handleChange}
                                className="form_input"
                                min={formData.fecha_inicio || getTodayDate()}
                                required
                            />
                            {errors.fecha_fin && (
                                <small className="text-danger">{errors.fecha_fin}</small>
                            )}
                        </div>

                        <div className="form-group mb-3">
                            <label className="form-label">Comentario</label>
                            <textarea
                                name="comentario"
                                value={formData.comentario}
                                onChange={handleChange}
                                className="form_input form-textarea"
                            ></textarea>
                        </div>

                        <div className="kreativa-btn-wrapper">
                            <button type="submit" className="thm-btn">
                                Solicitar PTO
                            </button>
                            <button
                                type="button"
                                className="thm-btn thm-btn-secondary"
                                onClick={() => navigate("/dashboard")}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AgregarPTO;