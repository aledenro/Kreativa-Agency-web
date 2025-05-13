import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import { UserCog } from "lucide-react";
import Swal from "sweetalert2";

const EditarUsuario = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: "",
        usuario: "",
        email: "",
        tipo_usuario: "",
        cedula: "",
    });

    const [errors, setErrors] = useState({});
    const [errorServidor, setErrorServidor] = useState("");

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setErrorServidor("No hay token disponible");
                    return;
                }

                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/usuarios/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setFormData({
                    nombre: data.nombre,
                    usuario: data.usuario,
                    email: data.email,
                    tipo_usuario: data.tipo_usuario,
                    cedula: data.cedula,
                });
            } catch (error) {
                console.error("Error al obtener usuario:", error.response?.data || error);
                setErrorServidor("Error al cargar los datos del usuario.");
            }
        };
        fetchUsuario();
    }, [id]);

    const handleInputChange = async (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        validarCampo(name, value);
    };

    const validarCampo = async (name, value) => {
        let errorMsg = "";

        if (!value) {
            errorMsg = "Este campo es obligatorio";
        } else {
            if (name === "email" && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
                errorMsg = "Correo no válido";
            }
            if (name === "cedula" && !/^\d{8,9}$/.test(value)) {
                errorMsg = "La cédula debe tener entre 8 y 9 dígitos";
            }
            if (["usuario", "email", "cedula"].includes(name)) {
                try {
                    const token = localStorage.getItem("token");
                    if (!token) {
                        setErrorServidor("No hay token disponible");
                        return;
                    }

                    const response = await axios.get(`${import.meta.env.VITE_API_URL}/usuarios`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    const existe = response.data.some(
                        (user) => user[name] === value && user._id !== id
                    );

                    if (existe) {
                        errorMsg =
                            name === "usuario"
                                ? "Este usuario ya está en uso"
                                : name === "email"
                                    ? "Este correo ya está registrado"
                                    : "Esta cédula ya está registrada";
                    }
                } catch (error) {
                    console.error("Error al verificar disponibilidad:", error);
                }
            }
        }

        setErrors({ ...errors, [name]: errorMsg });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorServidor("");

        const camposConError = Object.values(errors).some((error) => error !== "");
        if (camposConError) {
            alert("Por favor, corrige los errores antes de continuar.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setErrorServidor("No hay token disponible");
                return;
            }

            await axios.put(`${import.meta.env.VITE_API_URL}/usuarios/${id}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // SweetAlert de éxito 🩷
            Swal.fire({
                title: '¡Usuario actualizado!',
                text: 'Los cambios se guardaron correctamente.',
                icon: 'success',
                confirmButtonColor: '#ff7eb3',
                confirmButtonText: 'Continuar'
            }).then(() => {
                navigate("/usuarios");
            });

        } catch (error) {
            console.error("Error al actualizar usuario:", error.response?.data || error);
            setErrorServidor("Error al actualizar el usuario.");
        }
    };

    return (
        <AdminLayout>
            <div className="kreativa-form-wrapper">
                <div className="kreativa-card">
                    <div className="text-center mb-3">
                        <UserCog size={80} color="#ff0072" strokeWidth={2.5} />
                    </div>
                    <h2 className="kreativa-form-title">Editar Usuario</h2>

                    {errorServidor && (
                        <div className="alert alert-danger kreativa-alert text-center">{errorServidor}</div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <label className="form-label">Nombre Completo</label>
                            <input
                                type="text"
                                name="nombre"
                                className="form_input"
                                value={formData.nombre}
                                onChange={handleInputChange}
                                required
                            />
                            {errors.nombre && <small className="text-danger">{errors.nombre}</small>}
                        </div>

                        <div className="form-group mb-3">
                            <label className="form-label">Usuario</label>
                            <input
                                type="text"
                                name="usuario"
                                className="form_input"
                                value={formData.usuario}
                                onChange={handleInputChange}
                                required
                            />
                            {errors.usuario && <small className="text-danger">{errors.usuario}</small>}
                        </div>

                        <div className="form-group mb-3">
                            <label className="form-label">Cédula</label>
                            <input
                                type="text"
                                name="cedula"
                                className="form_input"
                                value={formData.cedula}
                                disabled
                            />
                        </div>

                        <div className="form-group mb-3">
                            <label className="form-label">Correo Electrónico</label>
                            <input
                                type="email"
                                name="email"
                                className="form_input"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                            {errors.email && <small className="text-danger">{errors.email}</small>}
                        </div>

                        <div className="form-group mb-3">
                            <label className="form-label">Tipo de Usuario</label>
                            <select
                                name="tipo_usuario"
                                className="form_input"
                                value={formData.tipo_usuario}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Seleccione...</option>
                                <option value="Administrador">Administrador</option>
                                <option value="Colaborador">Colaborador</option>
                                <option value="Cliente">Cliente</option>
                            </select>
                        </div>

                        <div className="kreativa-btn-wrapper">
                            <button
                                type="submit"
                                className="thm-btn kreativa-btn-crear"
                                disabled={Object.values(errors).some((e) => e !== "")}
                            >
                                Guardar Cambios
                            </button>

                            <button
                                type="button"
                                className="thm-btn thm-btn-secondary kreativa-btn-volver"
                                onClick={() => navigate("/usuarios")}
                            >
                                Volver
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default EditarUsuario;