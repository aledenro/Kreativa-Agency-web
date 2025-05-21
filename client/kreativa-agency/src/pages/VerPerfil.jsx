import "../App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { UserRound } from "lucide-react";
import AdminLayout from "../components/AdminLayout/AdminLayout";

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
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/usuarios/${decoded.id}`, {
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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`${import.meta.env.VITE_API_URL}/usuarios/${usuario._id}`, formData, {
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
        <AdminLayout>
            <div className="perfil-view-container">
                <div className="perfil-view-card">
                    <div className="perfil-view-header">
                        <UserRound size={60} color="#ff0072" strokeWidth={2.5} />
                        <h1 className="perfil-view-title">Mi Perfil</h1>
                    </div>

                    {loading ? (
                        <p className="perfil-view-loading">Cargando...</p>
                    ) : error ? (
                        <p className="perfil-view-error">{error}</p>
                    ) : (
                        <>
                            <h2 className="perfil-view-nombre">{usuario.nombre}</h2>
                            <div className="perfil-view-info">
                                {editMode ? (
                                    <>
                                        <div className="perfil-view-field">
                                            <label>Usuario:</label>
                                            <input
                                                type="text"
                                                name="usuario"
                                                value={formData.usuario}
                                                onChange={handleChange}
                                                className="perfil-view-input"
                                            />
                                        </div>
                                        <div className="perfil-view-field">
                                            <label>Email:</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="perfil-view-input"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p><strong>Rol:</strong> {usuario.tipo_usuario}</p>
                                        <p><strong>Usuario:</strong> {usuario.usuario}</p>
                                        <p><strong>Email:</strong> {usuario.email}</p>
                                        <p><strong>Cédula:</strong> {usuario.cedula}</p>
                                        <p><strong>Estado:</strong> {usuario.estado}</p>
                                        <p><strong>Fecha de Registro:</strong> {new Date(usuario.fecha_creacion).toLocaleDateString()}</p>
                                    </>
                                )}
                            </div>
                        </>
                    )}

                    <div className="perfil-view-buttons">
                        {editMode ? (
                            <>
                                <button className="perfil-view-btn" onClick={() => setEditMode(false)}>Volver</button>
                                <button className="perfil-view-btn" onClick={handleSave}>Guardar</button>
                            </>
                        ) : (
                            <>
                                <button className="perfil-view-btn" onClick={() => navigate("/usuarios")}>Volver</button>
                                <button className="perfil-view-btn" onClick={() => setEditMode(true)}>Editar Perfil</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default VerPerfil;