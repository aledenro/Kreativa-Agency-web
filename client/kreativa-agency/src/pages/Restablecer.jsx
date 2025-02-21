import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";

const Restablecer = () => {
    const { token } = useParams();
    const [nuevaContraseña, setNuevaContraseña] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:4000/api/restablecer", {
                token,
                nuevaContraseña
            });
            Swal.fire("¡Éxito!", response.data.mensaje, "success").then(() => {
                navigate("/login");
            });
        } catch (error) {
            Swal.fire("Error", "No se pudo restablecer la contraseña", "error");
        }
    };

    return (
        <div className="container mt-5 text-center">
            <h2>Restablecer Contraseña</h2>
            <p>Ingresa tu nueva contraseña.</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    className="form-control mb-3"
                    placeholder="Nueva contraseña"
                    value={nuevaContraseña}
                    onChange={(e) => setNuevaContraseña(e.target.value)}
                    required
                />
                <button type="submit" className="btn btn-success">Restablecer</button>
            </form>
        </div>
    );
};

export default Restablecer;