import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { UserIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import LogoKreativa from "../assets/img/logo.png";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        usuario: "",
        contraseña: "",
    });

    const [mostrarContrasena, setMostrarContrasena] = useState(false);
    const [error, setError] = useState("");
    const [mostrarContrasena, setMostrarContrasena] = useState(false);
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
            if (!token) return;

            localStorage.setItem("token", token);
            const decodedToken = jwtDecode(token);
            console.log("Token decodificado:", decodedToken);
            // Contexto usuario 
            login({
                nombre: decodedToken.usuario, 
                email: decodedToken.email || "", 
                tipo_usuario: decodedToken.tipo_usuario,
                id: decodedToken.id,
              });
            localStorage.setItem("tipo_usuario", decodedToken.tipo_usuario);
            localStorage.setItem("user_id", decodedToken.id);

            Swal.fire({ icon: "success", title: "Inicio de sesión exitoso", showConfirmButton: false, timer: 1500 });

            setTimeout(() => {
                switch (decodedToken.tipo_usuario) {
                    case "Administrador": navigate("/usuarios"); break;
                    case "Colaborador": navigate("/vista-colaborador"); break;
                    case "Cliente": navigate("/vista-clientes"); break;
                    default:
                        Swal.fire({ icon: "warning", title: "Acceso restringido", text: "No tienes permisos para acceder." });
                        localStorage.clear();
                }
            }, 1500);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.mensaje || "Usuario o contraseña incorrectos",
            });
        }
    };

    return (
        <div className="login-split-container">
            <div className="login-left">
                <div className="logo-container">
                    <img src={LogoKreativa} alt="Logo Kreativa" className="logo-kreativa" />
                </div>
                <h2 className="login-title">Iniciar Sesión</h2>
                <p className="login-subtitle">Accedé con tus credenciales</p>
                <form onSubmit={handleSubmit} className="login-form">
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
                        <span className="eye-icon" onClick={() => setMostrarContrasena(!mostrarContrasena)}>
                            {mostrarContrasena ? <EyeSlashIcon className="icon-eye" /> : <EyeIcon className="icon-eye" />}
                        </span>
                    </div>
                    <div className="login-footer">
                        <a href="/recuperar" className="kreativa-link">¿Olvidaste tu contraseña?</a>
                    </div>
                    <div className="login-buttons">
                        <button type="button" className="thm-btn btn-volver" onClick={() => navigate("/")}>Volver</button>
                        <button type="submit" className="thm-btn btn-kreativa">Iniciar Sesión</button>
                    </div>
                </form>
            </div>
            <div className="login-right">
                <h2 className="welcome-text">TU ESPACIO KREATIVO</h2>
                <p className="slogan-text">El punto de acceso para gestionar todo en un solo lugar.</p>
            </div>
        </div>
    );
};

export default Login;