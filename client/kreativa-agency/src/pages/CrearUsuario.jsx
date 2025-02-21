import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";

const CrearUsuario = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: "",
        usuario: "",
        cedula: "",
        email: "",
        tipo_usuario: "",
        contraseña: "",
        estado: "Activo",
    });

    const [errors, setErrors] = useState({}); 
    const [errorServidor, setErrorServidor] = useState("");

    const handleChange = async (e) => {
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
                        console.error("No hay token disponible");
                        return;
                    }
            
                    const response = await axios.get(`http://localhost:4000/api/usuarios`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
            
                    const existe = response.data.some((user) => user[name] === value);
            
                    if (existe) {
                        errorMsg = name === "usuario"
                            ? "Este usuario ya está en uso"
                            : name === "email"
                            ? "Este correo ya está registrado"
                            : "Esta cédula ya está registrada";
                    }
                } catch (error) {
                    console.error("Error al verificar disponibilidad:", error.response?.data || error);
                }
            }
        }
    
        setErrors({ ...errors, [name]: errorMsg });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorServidor("");
    
        const token = localStorage.getItem("token");
        if (!token) {
            setErrorServidor("No hay token disponible");
            return;
        }
    
        const camposConError = Object.values(errors).some((error) => error !== "");
        if (camposConError) {
            alert("Por favor, corrige los errores antes de continuar.");
            return;
        }
    
        try {
            await axios.post("http://localhost:4000/api/usuarios", formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            alert("Usuario creado exitosamente");
            navigate("/usuarios");
        } catch (error) {
            console.error("Error al crear usuario:", error.response?.data || error);
            setErrorServidor("Error al crear el usuario. Asegúrate de que los datos sean válidos.");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                <div className="section-title text-center">
                    <h1>Crear Usuario</h1>
                </div>
                {errorServidor && <div className="alert alert-danger kreativa-alert">{errorServidor}</div>}

                <form onSubmit={handleSubmit} className="col-lg-6 mx-auto">
                    <div className="form-group mb-3">
                        <label className="form-label">Nombre Completo</label>
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Nombre completo"
                            value={formData.nombre}
                            onChange={handleChange}
                            className="form_input"
                            required
                        />
                        {errors.nombre && <small className="text-danger">{errors.nombre}</small>}
                    </div>

                    <div className="form-group mb-3">
                        <label className="form-label">Usuario</label>
                        <input
                            type="text"
                            name="usuario"
                            placeholder="Usuario"
                            value={formData.usuario}
                            onChange={handleChange}
                            className="form_input"
                            required
                        />
                        {errors.usuario && <small className="text-danger">{errors.usuario}</small>}
                    </div>

                    <div className="form-group mb-3">
                        <label className="form-label">Cédula</label>
                        <input
                            type="text"
                            name="cedula"
                            placeholder="Cédula"
                            value={formData.cedula}
                            onChange={handleChange}
                            className="form_input"
                            required
                        />
                        {errors.cedula && <small className="text-danger">{errors.cedula}</small>}
                    </div>

                    <div className="form-group mb-3">
                        <label className="form-label">Correo Electrónico</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Correo electrónico"
                            value={formData.email}
                            onChange={handleChange}
                            className="form_input"
                            required
                        />
                        {errors.email && <small className="text-danger">{errors.email}</small>}
                    </div>

                    <div className="form-group mb-3">
                        <label className="form-label">Tipo de Usuario</label>
                        <select
                            name="tipo_usuario"
                            value={formData.tipo_usuario}
                            onChange={handleChange}
                            className="form_input"
                            required
                        >
                            <option value="">Seleccionar tipo de usuario</option>
                            <option value="Administrador">Administrador</option>
                            <option value="Colaborador">Colaborador</option>
                            <option value="Cliente">Cliente</option>
                        </select>
                        {errors.tipo_usuario && <small className="text-danger">{errors.tipo_usuario}</small>}
                    </div>

                    <div className="form-group mb-3">
                        <label className="form-label">Estado</label>
                        <select
                            name="estado"
                            value={formData.estado}
                            onChange={handleChange}
                            className="form_input"
                            required
                        >
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>
                    </div>

                    <div className="form-group mb-3">
                        <label className="form-label">Contraseña</label>
                        <input
                            type="password"
                            name="contraseña"
                            placeholder="Contraseña"
                            value={formData.contraseña}
                            onChange={handleChange}
                            className="form_input"
                            required
                        />
                        {errors.contraseña && <small className="text-danger">{errors.contraseña}</small>}
                    </div>

                    <div className="d-flex justify-content-between">
                        <button type="submit" className="thm-btn" disabled={Object.values(errors).some(e => e !== "")}>
                            Crear Usuario
                        </button>
                        <button
                            type="button"
                            className="thm-btn thm-btn-secondary"
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

export default CrearUsuario;