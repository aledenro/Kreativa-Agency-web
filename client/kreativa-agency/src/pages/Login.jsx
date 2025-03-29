import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import Svg70 from "../assets/img/70.svg";
import Svg40 from "../assets/img/40.svg";
import Svg111 from "../assets/img/111.svg";
import Mujer1 from "../assets/img/Mujer1.svg";
import Hombre2 from "../assets/img/Hombre2.svg";

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
            const response = await axios.post(
                "http://localhost:4000/api/login",
                formData
            );
            console.log("Respuesta del servidor:", response.data);

            const { token } = response.data;

            if (!token) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se recibió token del servidor",
                    confirmButtonColor: "#E91E63",
                });
                return;
            }

            localStorage.setItem("token", token);

            const decodedToken = jwtDecode(token);
            console.log("Token decodificado:", decodedToken);

            localStorage.setItem("tipo_usuario", decodedToken.tipo_usuario);
            localStorage.setItem("user_id", decodedToken.id);

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
            console.error(
                "Error al iniciar sesión:",
                error.response?.data || error
            );

            if (error.response) {
                const mensajeError = error.response.data.mensaje;

                if (
                    mensajeError ===
                    "Tu cuenta está inactiva. Contacta al administrador."
                ) {
                    Swal.fire({
                        icon: "warning",
                        title: "Cuenta inactiva",
                        text: "Tu cuenta está inactiva. Contacta al administrador.",
                        confirmButtonColor: "#E91E63",
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
        <div className="kreativa-login-container">
            <img src={Svg70} alt="Decoración Kreativa" className="svg-decorativo" />

            <div className="background-decoracion-login">
                <img src={Svg40} alt="Decoración fondo" className="svg40-decorativo" />
            </div>
            <img src={Svg111} alt="Decoración esquina" className="svg111-bottom-right" />
            <img src={Mujer1} alt="Mujer Kreativa" className="mujer-kreativa-svg" />
            <img src={Hombre2} alt="Hombre Kreativa" className="hombre-kreativa-svg" />
            <h2 className="login-title-francy">¿PARTE DEL EQUIPO KREATIVA?</h2>
            <div className="kreativa-login-wrapper">
                <div className="kreativa-login-left">
                    
                    <p className="kreativa-login-subtitle">Accedé con tus credenciales</p>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleSubmit} className="kreativa-login-form">
                        <div className="form-group">
                            <input
                                type="text"
                                name="usuario"
                                placeholder="Usuario"
                                value={formData.usuario}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                name="contraseña"
                                placeholder="Contraseña"
                                value={formData.contraseña}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="kreativa-login-options">
                            <a href="/recuperar" className="kreativa-link">
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>

                        <div className="login-buttons">
                            <button
                                type="button"
                                className="thm-btn btn-volver"
                                onClick={() => navigate("/")}
                            >
                                Volver
                            </button>
                            <button type="submit" className="thm-btn btn-kreativa">
                                Iniciar Sesión
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
