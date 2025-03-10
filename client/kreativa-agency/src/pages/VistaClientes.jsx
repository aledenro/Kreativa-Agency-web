import React from "react";
import Navbar from "../components/Navbar/Navbar";

const VistaClientes = () => {
    return (
        <div>
            <Navbar />
            <div className="container mt-5 text-center">
                <h2>Vista Temporal</h2>
                <p>Estás en la vista de Cliente.</p>
            </div>
        </div>
    );
};

export default VistaClientes;