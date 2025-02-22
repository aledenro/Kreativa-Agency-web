import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../App.css"; 

const JerarquiaUsuarios = () => {
    const [jerarquia, setJerarquia] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchJerarquiaUsuarios = async () => {
            try {
                const response = await axios.get("http://localhost:4000/api/usuarios/jerarquia");
                if (response.data.mensaje) {
                    setError(response.data.mensaje);
                } else {
                    setJerarquia(response.data);
                }
            } catch (error) {
                setError("Error al cargar los datos.");
            } finally {
                setLoading(false);
            }
        };

        fetchJerarquiaUsuarios();
    }, []);

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h2>Jerarquía de la Empresa</h2>
                    <p>A continuación, se muestra la organización de empleados y clientes.</p>
                </div>

                {loading ? (
                    <p className="loading-text">Cargando...</p>
                ) : error ? (
                    <p className="error-text">{error}</p>
                ) : (
                    Object.keys(jerarquia).map((tipo) => (
                        <div key={tipo} className="jerarquia-section">
                            <h3 className="jerarquia-title">{tipo}</h3>
                            <div className="jerarquia-container">
                                {jerarquia[tipo].map((usuario) => (
                                    <div key={usuario.email} className="jerarquia-card">
                                        <h4>{usuario.nombre}</h4>
                                        <p>Email: {usuario.email}</p>
                                        <span className={`estado-${usuario.estado.toLowerCase()}`}>
                                            {usuario.estado}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default JerarquiaUsuarios;