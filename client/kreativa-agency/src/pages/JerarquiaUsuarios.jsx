import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout/AdminLayout";

const JerarquiaUsuarios = () => {
    const [jerarquia, setJerarquia] = useState({
        Administrador: [],
        Colaborador: [],
        Cliente: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJerarquia = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/usuarios/jerarquia`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setJerarquia(response.data);
            } catch (err) {
                setError("Error al obtener los usuarios.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchJerarquia();
    }, []);

    const obtenerTituloRol = (rol) => {
        switch (rol) {
            case "Administrador":
                return "Administradores";
            case "Colaborador":
                return "Colaboradores";
            case "Cliente":
                return "Clientes";
            default:
                return rol;
        }
    };

    return (
        <AdminLayout>
            <div className="kreativa-jerarquia-wrapper">
                <h2 className="kreativa-title text-center">
                    Organigrama Kreativa Agency
                </h2>

                {loading ? (
                    <div className="text-center">
                        <div className="spinner-border text-pink" />
                        <p>Cargando usuarios...</p>
                    </div>
                ) : error ? (
                    <p className="text-danger text-center">{error}</p>
                ) : (
                    <div className="jerarquia-section">
                        {Object.entries(jerarquia).map(([rol, usuarios]) => (
                            <div key={rol} className="jerarquia-group">
                                <h4
                                    className={`jerarquia-title kreativa-${rol.toLowerCase()}`}
                                >
                                    {obtenerTituloRol(rol)}
                                </h4>
                                {usuarios.length > 0 ? (
                                    usuarios.map((usuario) => (
                                        <div
                                            key={usuario._id}
                                            className="kreativa-card animate-box"
                                        >
                                            <p className="kreativa-card-title">
                                                {usuario.nombre}
                                            </p>
                                            <p className="kreativa-card-text">
                                                Email: {usuario.email}
                                            </p>
                                            <p className="kreativa-card-text">
                                                Tipo de Usuario:{" "}
                                                {obtenerTituloRol(rol)}
                                            </p>
                                            <p className="kreativa-card-text">
                                                Estado: {usuario.estado}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted text-center">
                                        No hay{" "}
                                        {obtenerTituloRol(rol).toLowerCase()}.
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default JerarquiaUsuarios;
