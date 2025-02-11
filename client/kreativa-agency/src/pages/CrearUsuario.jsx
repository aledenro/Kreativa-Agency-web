import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar"; // Importar el Navbar

const CrearUsuario = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: "",
        usuario: "",
        email: "",
        tipo_usuario: "",
        contraseña: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:4000/api/usuarios", formData);
            alert("Usuario creado exitosamente");
            navigate("/usuarios");
        } catch (error) {
            setError("Error al crear el usuario. Asegúrate de que los datos sean válidos.");
        }
    };

    return (
        <div>
            {/* Navbar */}
            <Navbar />

            {/* Contenido principal */}
            <div className="container mt-5">
                <div className="section-title text-center">
                    <h1>Crear Usuario</h1>
                </div>
                {error && (
                    <div className="alert alert-danger kreativa-alert">{error}</div>
                )}
                <form onSubmit={handleSubmit} className="col-lg-6 mx-auto">
                    <div className="form-group mb-3">
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Nombre completo"
                            value={formData.nombre}
                            onChange={handleChange}
                            className="form_input"
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <input
                            type="text"
                            name="usuario"
                            placeholder="Usuario"
                            value={formData.usuario}
                            onChange={handleChange}
                            className="form_input"
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <input
                            type="email"
                            name="email"
                            placeholder="Correo electrónico"
                            value={formData.email}
                            onChange={handleChange}
                            className="form_input"
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
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
                    </div>
                    <div className="form-group mb-3">
                        <input
                            type="password"
                            name="contraseña"
                            placeholder="Contraseña"
                            value={formData.contraseña}
                            onChange={handleChange}
                            className="form_input"
                            required
                        />
                    </div>
                    <div className="d-flex justify-content-between">
                        <button type="submit" className="thm-btn">
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