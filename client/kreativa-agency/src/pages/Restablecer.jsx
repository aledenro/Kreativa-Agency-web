import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import { LockClosedIcon } from "@heroicons/react/24/outline";

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
                },
                confirmButtonColor: " #ff0072",
            });
            return;
        }

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/restablecer`,
                {
                    token,
                    nuevaContraseña,
                }
            );

            Swal.fire({
                title: "¡Éxito!",
                text: response.data.mensaje,
                icon: "success",
                confirmButtonText: "Iniciar sesión",
                customClass: {
                    confirmButton: "swal-button-kreativa",
                },
                confirmButtonColor: " #ff0072",
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
                },
                confirmButtonColor: " #ff0072",
            });
        }
    };

    return (
        <div className="login-split-container">
            <div className="login-left">
                <div className="logo-container">
                    <img
                        src="https://kreativa-public.s3.us-east-2.amazonaws.com/landing/logo.png"
                        alt="Logo Kreativa"
                        className="logo-kreativa"
                    />
                </div>
                <h2 className="login-title">Restablecer Contraseña</h2>
                <p className="login-subtitle">
                    Ingresá y confirmá tu nueva contraseña.
                </p>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group input-icon-wrapper">
                        <LockClosedIcon className="input-icon-min" />
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Nueva contraseña"
                            value={nuevaContraseña}
                            onChange={(e) => setNuevaContraseña(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group input-icon-wrapper">
                        <LockClosedIcon className="input-icon-min" />
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Confirmar contraseña"
                            value={confirmarContraseña}
                            onChange={(e) =>
                                setConfirmarContraseña(e.target.value)
                            }
                            required
                        />
                    </div>
                    <div className="login-buttons">
                        <button type="submit" className="thm-btn btn-kreativa">
                            Restablecer
                        </button>
                    </div>
                </form>
            </div>
            <div className="login-right">
                <h2 className="welcome-text">TU ESPACIO KREATIVO</h2>
                <p className="slogan-text">
                    El punto de acceso para gestionar todo en un solo lugar.
                </p>
            </div>
        </div>
    );
};

export default Restablecer;
