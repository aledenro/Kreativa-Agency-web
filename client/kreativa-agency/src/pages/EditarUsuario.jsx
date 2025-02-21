import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";

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

                const { data } = await axios.get(`http://localhost:4000/api/usuarios/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
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
        setFormData({
            ...formData,
            [name]: value,
        });

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
            if (name === "contraseña" && value.length < 6) {
                errorMsg = "La contraseña debe tener al menos 6 caracteres";
            }
            if (name === "usuario" || name === "email" || name === "cedula") {
                try {
                    const token = localStorage.getItem("token");
                    if (!token) {
                        setErrorServidor("No hay token disponible");
                        return;
                    }

                    const response = await axios.get(`http://localhost:4000/api/usuarios`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    const existe = response.data.some((user) => user[name] === value && user._id !== id);

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

            await axios.put(`http://localhost:4000/api/usuarios/${id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Usuario actualizado correctamente");
            navigate("/usuarios");
        } catch (error) {
            console.error("Error al actualizar usuario:", error.response?.data || error);
            setErrorServidor("Error al actualizar el usuario.");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                <div className="section-title text-center">
                    <h1>Editar Usuario</h1>
                </div>
                {errorServidor && <div className="alert alert-danger kreativa-alert">{errorServidor}</div>}

                <form onSubmit={handleSubmit} className="col-lg-6 mx-auto">
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

                    <div className="d-flex justify-content-between">
                        <button
                            type="submit"
                            className="thm-btn btn-guardar"
                            disabled={Object.values(errors).some((e) => e !== "")}
                        >
                            Guardar Cambios
                        </button>
                        <button
                            type="button"
                            className="thm-btn btn-volver"
                            onClick={() => navigate("/usuarios")}
                        >
                            Volver
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditarUsuario;