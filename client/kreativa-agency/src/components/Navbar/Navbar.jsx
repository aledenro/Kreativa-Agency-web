import React, { useState } from "react";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className="navbar">
            <div className="hamburger" onClick={toggleMenu}>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <div className="logo">
                <img src="\src\assets\img\logo.png" alt="Logo" />
            </div>
            <div className={`menu ${menuOpen ? "active" : ""}`}>
                <a href="#">Inicio</a>
                <a href="#">Servicios</a>
                <a href="#">Estamos contratando</a>
                <a href="#">Conózcanos</a>
            </div>
            <button className="login-button">Iniciar Sesión</button>
        </nav>
    );
}
