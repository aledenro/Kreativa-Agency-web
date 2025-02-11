import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar"; // Importar el Navbar

const EditarUsuario = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: "",
        usuario: "",
        email: "",
        tipo_usuario: "",
    });
    const [error, setError] = useState("");

    // Cargar datos del usuario existente
    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const { data } = await axios.get(`http://localhost:4000/api/usuarios/${id}`);
                setFormData({
                    nombre: data.nombre,
                    usuario: data.usuario,
                    email: data.email,
                    tipo_usuario: data.tipo_usuario,
                });
            } catch (error) {
                setError("Error al cargar los datos del usuario.");
            }
        };
        fetchUsuario();
    }, [id]);

    // Manejar cambios en el formulario
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Manejar la edición del usuario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await axios.put(`http://localhost:4000/api/usuarios/${id}`, formData);
            navigate("/usuarios"); // Redirigir a la página principal de usuarios
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setError(error.response.data.mensaje); // Mostrar errores de validación
            } else {
                setError("Error al actualizar el usuario.");
            }
        }
    };

    return (
        <div>
            {/* Navbar */}
            <Navbar />

            {/* Contenido principal */}
            <div className="container mt-5">
                <div className="section-title text-center">
                    <h1>Editar Usuario</h1>
                </div>
                {error && (
                    <div className="alert alert-danger kreativa-alert">{error}</div>
                )}
                <form onSubmit={handleSubmit} className="form-box mx-auto p-4">
                    <div className="mb-3">
                        <label className="form-label">Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            className="form_input"
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
                            className="form_input"
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
                            className="form_input"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
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
                    <div className="d-flex gap-3 mt-4">
                        <button type="submit" className="thm-btn">
                            Guardar Cambios
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

export default EditarUsuario;