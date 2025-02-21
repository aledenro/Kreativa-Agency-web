import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Recuperar = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:4000/api/recuperar", { email });
            Swal.fire("¡Éxito!", response.data.mensaje, "success");
        } catch (error) {
            Swal.fire("Error", "No se pudo enviar el correo de recuperación", "error");
        }
    };

    return (
        <div className="container mt-5 text-center">
            <h2>Recuperar Contraseña</h2>
            <p>Ingresa tu correo electrónico para recibir un enlace de recuperación.</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    className="form-control mb-3"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit" className="btn btn-primary">Enviar</button>
            </form>
        </div>
    );
};

export default Recuperar;