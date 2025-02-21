import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

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
            console.log("Respuesta del servidor:", response.data);

            const { token } = response.data;

            if (!token) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se recibió token del servidor",
                    confirmButtonColor: "#E91E63"
                });
                return;
            }

            localStorage.setItem("token", token);

            const decodedToken = jwtDecode(token);
            console.log("Token decodificado:", decodedToken);

            localStorage.setItem("tipo_usuario", decodedToken.tipo_usuario);

            Swal.fire({
                icon: "success",
                title: "Inicio de sesión exitoso",
                showConfirmButton: false,
                timer: 1500,
            });

            setTimeout(() => {
                if (decodedToken.tipo_usuario === "Administrador") {
                    navigate("/usuarios");
                } else if (decodedToken.tipo_usuario === "Colaborador") {
                    navigate("/vista-colaborador");
                } else if (decodedToken.tipo_usuario === "Cliente") {
                    navigate("/vista-clientes");
                } else {
                    Swal.fire({
                        icon: "warning",
                        title: "Acceso restringido",
                        text: "No tienes permisos para acceder.",
                        confirmButtonColor: "#E91E63",
                    });
                    localStorage.removeItem("token");
                    localStorage.removeItem("tipo_usuario");
                }
            }, 1500);

        } catch (error) {
            console.error("Error al iniciar sesión:", error.response?.data || error);

            if (error.response) {
                const mensajeError = error.response.data.mensaje;

                if (mensajeError === "Tu cuenta está inactiva. Contacta al administrador.") {
                    Swal.fire({
                        icon: "warning",
                        title: "Cuenta inactiva",
                        text: "Tu cuenta está inactiva. Contacta al administrador.",
                        confirmButtonColor: "#E91E63"
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Usuario o contraseña incorrectos",
                        confirmButtonColor: "#E91E63",
                    });
                }
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Error de conexión con el servidor",
                    confirmButtonColor: "#E91E63",
                });
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h2>Bienvenido a Kreativa</h2>
                    <p>Accede con tus credenciales</p>
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label>Usuario</label>
                        <input
                            type="text"
                            name="usuario"
                            placeholder="Ingresa tu usuario"
                            value={formData.usuario}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            name="contraseña"
                            placeholder="Ingresa tu contraseña"
                            value={formData.contraseña}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>


                    <div className="login-buttons">
                        <button
                            type="button"
                            className="thm-btn thm-btn-secondary"
                            onClick={() => navigate("/")}
                        >
                            Volver
                        </button>
                        <button
                            type="submit"
                            className="thm-btn login-btn"
                        >
                            Iniciar Sesión
                        </button>
                    </div>
                    <span style={{ display: "inline-block", width: "20px" }}></span>
                    <p style={{ textAlign: "left", marginTop: "10px" }}>
                        <a href="/recuperar" style={{ color: "#ff4081", textDecoration: "none", fontWeight: "bold" }}>
                            ¿Olvidaste tu contraseña?
                        </a>
                    </p>

                </form>
            </div>
        </div>
    );
};

export default Login;