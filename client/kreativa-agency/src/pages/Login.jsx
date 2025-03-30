import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import Svg40 from "../assets/img/40.svg";
import Svg111 from "../assets/img/111.svg";
import Mujer1 from "../assets/img/Mujer1.svg";
import Hombre2 from "../assets/img/Hombre2.svg";
import Svg107 from "../assets/img/107.svg";

// Íconos minimalistas
import { UserIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ usuario: "", contraseña: "" });
    const [mostrarContrasena, setMostrarContrasena] = useState(false);
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
            localStorage.setItem("tipo_usuario", decodedToken.tipo_usuario);
            localStorage.setItem("user_id", decodedToken.id);

            Swal.fire({
                icon: "success",
                title: "Inicio de sesión exitoso",
                showConfirmButton: false,
                timer: 1500,
            });

            setTimeout(() => {
                switch (decodedToken.tipo_usuario) {
                    case "Administrador":
                        navigate("/usuarios");
                        break;
                    case "Colaborador":
                        navigate("/vista-colaborador");
                        break;
                    case "Cliente":
                        navigate("/vista-clientes");
                        break;
                    default:
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
            const mensajeError = error.response?.data?.mensaje;
            Swal.fire({
                icon: error.response ? "error" : "warning",
                title: error.response ? "Error" : "Error de conexión",
                text: mensajeError || "Usuario o contraseña incorrectos",
                confirmButtonColor: "#E91E63",
            });
        }
    };

    return (
        <div className="kreativa-login-container">
            <div className="background-decoracion-login">
                <img src={Svg40} alt="Decoración fondo" className="svg40-decorativo" />
            </div>
            <img src={Svg107} alt="Decoración inferior" className="decoracion-login-svg107" />
            <img src={Svg111} alt="Decoración esquina" className="svg111-bottom-right" />
            <img src={Mujer1} alt="Mujer Kreativa" className="mujer-kreativa-svg" />
            <img src={Hombre2} alt="Hombre Kreativa" className="hombre-kreativa-svg" />

            <h2 className="login-title-francy">¿PARTE DEL EQUIPO KREATIVA?</h2>
            <h3 className="bienvenida-kreativa">
                Bienvenidos a<br />
                Kreativa Agency
            </h3>

            <div className="kreativa-login-wrapper">
                <div className="kreativa-login-left">
                    <p className="kreativa-login-subtitle">Accedé con tus credenciales</p>
                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleSubmit} className="kreativa-login-form">
                        {/* Usuario */}
                        <div className="form-group input-icon-wrapper">
                            <UserIcon className="input-icon-min" />
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

                        {/* Contraseña */}
                        <div className="form-group input-icon-wrapper">
                            <LockClosedIcon className="input-icon-min" />
                            <input
                                type={mostrarContrasena ? "text" : "password"}
                                name="contraseña"
                                placeholder="Contraseña"
                                value={formData.contraseña}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                            <span
                                className="eye-icon"
                                onClick={() => setMostrarContrasena(!mostrarContrasena)}
                            >
                                {mostrarContrasena ? (
                                    <EyeSlashIcon className="icon-eye" />
                                ) : (
                                    <EyeIcon className="icon-eye" />
                                )}
                            </span>
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