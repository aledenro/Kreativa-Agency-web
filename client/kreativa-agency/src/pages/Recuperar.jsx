import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom"; 
import "../App.css";

const Recuperar = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:4000/api/recuperar", { email });
            Swal.fire({
                title: "¡Éxito!",
                text: response.data.mensaje,
                icon: "success",
                confirmButtonText: "Aceptar",
                customClass: {
                    confirmButton: "swal-button-kreativa",
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/login"); 
                }
            });
        } catch (error) {
            if (error.response && error.response.status === 404) {
                Swal.fire({
                    title: "Error",
                    text: "Usuario o correo no registrado",
                    icon: "error",
                    confirmButtonText: "Intentar de nuevo",
                    customClass: {
                        confirmButton: "swal-button-kreativa",
                    }
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: "No se pudo enviar el correo de recuperación",
                    icon: "error",
                    confirmButtonText: "Intentar de nuevo",
                    customClass: {
                        confirmButton: "swal-button-kreativa",
                    }
                });
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h2>Recuperar Contraseña</h2>
                    <p>Ingresa tu correo electrónico para recibir un enlace de recuperación.</p>
                </div>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="email"
                            className="form-input"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="thm-btn">Enviar</button>
                </form>
            </div>
        </div>
    );
};

export default Recuperar;