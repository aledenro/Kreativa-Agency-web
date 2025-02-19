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
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const { data } = await axios.get(`http://localhost:4000/api/usuarios/${id}`);
                setFormData({
                    nombre: data.nombre,
                    usuario: data.usuario,
                    email: data.email,
                    tipo_usuario: data.tipo_usuario,
                    cedula: data.cedula,  
                });
            } catch (error) {
                setError("Error al cargar los datos del usuario.");
            }
        };
        fetchUsuario();
    }, [id]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await axios.put(`http://localhost:4000/api/usuarios/${id}`, formData);
            alert("Usuario actualizado correctamente");
            navigate("/usuarios");
        } catch (error) {
            setError("Error al actualizar el usuario.");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                <h1>Editar Usuario</h1>
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
                        <label className="form-label">Cédula</label>
                        <input
                            type="text"
                            name="cedula"
                            className="form-control"
                            value={formData.cedula}
                            disabled
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
                        <button type="submit" className="thm-btn btn-editar">Guardar Cambios</button>
                        <button type="button" className="thm-btn btn-volver" onClick={() => navigate("/usuarios")}>Volver</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditarUsuario;