import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";  

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
                setError("Error: No se recibió token del servidor");
                return;
            }
    
            localStorage.setItem("token", token);
    
          
            const decodedToken = jwtDecode(token);
            console.log("Token decodificado:", decodedToken); 
    
            localStorage.setItem("tipo_usuario", decodedToken.tipo_usuario);
    
            alert("Inicio de sesión exitoso");
    
            
            if (decodedToken.tipo_usuario === "Administrador") {
                navigate("/usuarios");
            } else if (decodedToken.tipo_usuario === "Colaborador") {
                navigate("/vista-colaborador");
            } else if (decodedToken.tipo_usuario === "Cliente") {
                navigate("/vista-clientes"); 
            } else {
                alert("Acceso restringido");
                localStorage.removeItem("token");
                localStorage.removeItem("tipo_usuario");
            }
        } catch (error) {
            console.error("Error al iniciar sesión:", error.response?.data || error);
            setError("Usuario o contraseña incorrectos");
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

                </form>
            </div>
        </div>
    );
};

export default Login;