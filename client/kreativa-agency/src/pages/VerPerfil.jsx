import "../App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Swal from "sweetalert2";

const VerPerfil = () => {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ usuario: "", email: "" });

    useEffect(() => {
        const fetchPerfil = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    Swal.fire({
                        title: "Error",
                        text: "No hay token disponible. Inicia sesión nuevamente.",
                        icon: "error",
                        confirmButtonColor: "#ff0072",
                    });
                    navigate("/login");
                    return;
                }

                const decoded = jwtDecode(token);
                console.log("Usuario logueado:", decoded);

                const response = await axios.get(`http://localhost:4000/api/usuarios/${decoded.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setUsuario(response.data);
                setFormData({
                    usuario: response.data.usuario,
                    email: response.data.email
                });

            } catch (error) {
                console.error("Error al obtener el perfil:", error);
                setError("Hubo un problema al obtener la información del perfil.");
            } finally {
                setLoading(false);
            }
        };

        fetchPerfil();
    }, [navigate]);

    // Manejar cambios en los inputs
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Guardar cambios en el backend
    const handleSave = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:4000/api/usuarios/${usuario._id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            Swal.fire({
                title: "¡Perfil actualizado!",
                text: "Tus datos se han actualizado correctamente.",
                icon: "success",
                confirmButtonColor: "#ff0072",
            });

            setUsuario({ ...usuario, ...formData });
            setEditMode(false);
        } catch (error) {
            console.error("Error al actualizar perfil:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudo actualizar el perfil. Inténtalo de nuevo.",
                icon: "error",
                confirmButtonColor: "#ff0072",
            });
        }
    };

    return (
        <div>
            <Navbar />
            <div className="perfil-container">
                <div className="section-title text-center">
                    <h1 className="kreativa-title">Mi Perfil</h1>
                </div>

                {loading ? (
                    <p className="loading-text">Cargando...</p>
                ) : error ? (
                    <p className="error-text">{error}</p>
                ) : (
                    <div className="perfil-card">
                        <div className="perfil-header">
                            <h2>{usuario.nombre}</h2>
                        </div>

                        {editMode ? (
                            <div className="perfil-info">
                                <div className="perfil-field" style={{ marginBottom: '15px' }}>
                                    <label className="perfil-label"><strong>Usuario:</strong></label>
                                    <input
                                        type="text"
                                        name="usuario"
                                        value={formData.usuario}
                                        onChange={handleChange}
                                        className="form_input"
                                    />
                                </div>

                                <div className="perfil-field" style={{ marginBottom: '15px' }}>
                                    <label className="perfil-label"><strong>Email:</strong></label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="form_input"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="perfil-info">
                                <p><strong>Rol:</strong> {usuario.tipo_usuario}</p>
                                <p><strong>Usuario:</strong> {usuario.usuario}</p>
                                <p><strong>Email:</strong> {usuario.email}</p>
                                <p><strong>Cédula:</strong> {usuario.cedula}</p>
                                <p><strong>Estado:</strong> {usuario.estado}</p>
                                <p><strong>Fecha de Registro:</strong> {new Date(usuario.fecha_creacion).toLocaleDateString()}</p>
                            </div>
                        )}
                    </div>
                )}
                <div className="perfil-btn-container" style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                    {editMode ? (
                        <>
                            <button className="thm-btn btn-volver" onClick={() => setEditMode(false)}>Volver</button>
                            <button className="thm-btn btn-volver" onClick={handleSave}>Guardar</button>
                        </>
                    ) : (
                        <>
                            <button className="thm-btn btn-volver" onClick={() => navigate("/dashboard")}>Volver</button>
                            <button className="thm-btn btn-volver" onClick={() => setEditMode(true)}>Editar Perfil</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerPerfil;