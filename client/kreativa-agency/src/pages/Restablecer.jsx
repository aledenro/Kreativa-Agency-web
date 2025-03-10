import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import "../App.css"; 

const Restablecer = () => {
    const { token } = useParams();
    const [nuevaContraseña, setNuevaContraseña] = useState("");
    const [confirmarContraseña, setConfirmarContraseña] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (nuevaContraseña !== confirmarContraseña) {
            Swal.fire({
                title: "Error",
                text: "Las contraseñas no coinciden",
                icon: "error",
                confirmButtonText: "Intentar de nuevo",
                customClass: {
                    confirmButton: "swal-button-kreativa",
                }
            });
            return;
        }

        try {
            const response = await axios.post("http://localhost:4000/api/restablecer", {
                token,
                nuevaContraseña
            });

            Swal.fire({
                title: "¡Éxito!",
                text: response.data.mensaje,
                icon: "success",
                confirmButtonText: "Iniciar sesión",
                customClass: {
                    confirmButton: "swal-button-kreativa",
                }
            }).then(() => {
                navigate("/login");
            });

        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "No se pudo restablecer la contraseña",
                icon: "error",
                confirmButtonText: "Intentar de nuevo",
                customClass: {
                    confirmButton: "swal-button-kreativa",
                }
            });
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h2>Restablecer Contraseña</h2>
                    <p>Ingresa tu nueva contraseña.</p>
                </div>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Nueva Contraseña</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Nueva contraseña"
                            value={nuevaContraseña}
                            onChange={(e) => setNuevaContraseña(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Confirmar Contraseña</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Confirmar contraseña"
                            value={confirmarContraseña}
                            onChange={(e) => setConfirmarContraseña(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="thm-btn">Restablecer</button>
                </form>
            </div>
        </div>
    );
};

export default Restablecer;