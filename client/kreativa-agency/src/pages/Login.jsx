import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        usuario: "",
        contraseña: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://localhost:4000/api/login", formData);
            localStorage.setItem("token", response.data.token);
            alert("Inicio de sesión exitoso");
            navigate("/dashboard"); // Redirigir a una página temporal 
        } catch (error) {
            setError(error.response?.data?.mensaje || "Error al iniciar sesión");
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center">Iniciar Sesión</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            
            <form onSubmit={handleSubmit} className="col-lg-4 mx-auto">
                <div className="form-group mb-3">
                    <label className="form-label">Usuario</label>
                    <input
                        type="text"
                        name="usuario"
                        className="form-control"
                        value={formData.usuario}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group mb-3">
                    <label className="form-label">Contraseña</label>
                    <input
                        type="password"
                        name="contraseña"
                        className="form-control"
                        value={formData.contraseña}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
            </form>
        </div>
    );
};

export default Login;