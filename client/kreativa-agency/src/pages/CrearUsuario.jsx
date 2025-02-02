import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CrearUsuario = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: "",
        usuario: "",
        email: "",
        contraseña: "",
        tipo_usuario: "",
    });
    const [error, setError] = useState("");

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:4000/api/usuarios", formData);
            navigate("/usuarios");
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setError(error.response.data.mensaje);
            } else {
                setError("Error al crear el usuario");
            }
        }
    };

    return (
        <div className="container mt-5">
            <h1>Crear Usuario</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                        type="text"
                        name="nombre"
                        className="form-control"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Usuario</label>
                    <input
                        type="text"
                        name="usuario"
                        className="form-control"
                        value={formData.usuario}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input
                        type="password"
                        name="contraseña"
                        className="form-control"
                        value={formData.contraseña}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Tipo de Usuario</label>
                    <select
                        name="tipo_usuario"
                        className="form-control"
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
                <div className="d-flex gap-3">
                    <button type="submit" className="btn btn-primary">
                        Crear Usuario
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate("/usuarios")}
                    >
                        Volver
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CrearUsuario;