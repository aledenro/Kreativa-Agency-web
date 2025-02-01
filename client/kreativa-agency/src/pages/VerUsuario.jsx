import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const VerUsuario = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const { data } = await axios.get(`http://localhost:4000/api/usuarios/${id}`);
                setUsuario(data);
            } catch (error) {
                setError("Error al cargar el usuario");
            }
        };
        fetchUsuario();
    }, [id]);

    return (
        <div className="container mt-5">
            <h1>Detalles del Usuario</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            {usuario ? (
                <div>
                    <p><strong>Nombre:</strong> {usuario.nombre}</p>
                    <p><strong>Usuario:</strong> {usuario.usuario}</p>
                    <p><strong>Email:</strong> {usuario.email}</p>
                    <p><strong>Tipo de Usuario:</strong> {usuario.tipo_usuario}</p>
                    <p><strong>Estado:</strong> {usuario.estado}</p>
                    <div className="d-flex gap-3">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate("/usuarios")}
                        >
                            Volver
                        </button>
                    </div>
                </div>
            ) : (
                <p>Cargando...</p>
            )}
        </div>
    );
};

export default VerUsuario;