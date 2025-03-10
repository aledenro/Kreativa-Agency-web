import "../App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

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

    const validateForm = () => {
        let newErrors = {};
        if (!formData.fecha_inicio)
            newErrors.fecha_inicio = "La fecha de inicio es obligatoria";
        if (!formData.fecha_fin)
            newErrors.fecha_fin = "La fecha de fin es obligatoria";
        if (new Date(formData.fecha_inicio) > new Date(formData.fecha_fin)) {
            newErrors.fecha_fin =
                "La fecha de fin debe ser posterior a la fecha de inicio";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

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

            await axios.post("http://localhost:4000/api/pto", formData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            Swal.fire({
                title: "¡Éxito!",
                text: "Tu solicitud de PTO fue enviada correctamente.",
                icon: "success",
                confirmButtonColor: "#ff0072",
            }).then(() => {
                navigate("/ver-pto");
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
        <div>
            <Navbar />
            <div className="container mt-5">
                <div className="section-title text-center">
                    <h1 className="kreativa-title">Solicitar PTO</h1>
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="col-lg-6 mx-auto kreativa-form"
                >
                    <div className="form-group mb-3">
                        <label className="form-label">Fecha de Inicio</label>
                        <input
                            type="date"
                            name="fecha_inicio"
                            value={formData.fecha_inicio}
                            onChange={handleChange}
                            className="form_input"
                            required
                        />
                        {errors.fecha_inicio && (
                            <small className="text-danger">
                                {errors.fecha_inicio}
                            </small>
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
                            required
                        />
                        {errors.fecha_fin && (
                            <small className="text-danger">
                                {errors.fecha_fin}
                            </small>
                        )}
                    </div>
                    <div className="form-group mb-3">
                        <label className="form-label">
                            Comentario (Opcional)
                        </label>
                        <textarea
                            name="comentario"
                            value={formData.comentario}
                            onChange={handleChange}
                            className="form_input form-textarea"
                        ></textarea>
                    </div>
                    <div className="d-flex justify-content-between">
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
    );
};

export default AgregarPTO;
