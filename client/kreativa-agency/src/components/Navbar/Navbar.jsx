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
                <img src="/src/assets/img/logo.png" alt="Logo" />
            </div>
            <ul className={`menu ${menuOpen ? "active" : ""}`}>
                <li>
                    <a href="/">Inicio</a>
                </li>
                <li>
                    <a href="/usuarios">Usuarios</a>
                </li>
                <li className="dropdown">
                    <a href="#" className="dropdown-toggle">
                        Servicios
                    </a>
                    <ul className="dropdown-menu">
                        <li>
                            <a href="/servicio/agregar">Agregar Servicio</a>
                        </li>
                        <li>
                            <a href="/servicio/modificar/679e997dc509472dd326b37e">
                                Modificar Servicio
                            </a>
                        </li>
                        <li>
                            <a href="/servicio/agregarPaquete/679e7b6d4fb1f2469e878ee8">
                                Agregar Paquete
                            </a>
                        </li>
                    </ul>
                </li>
                <li className="dropdown">
                    <a href="#" className="dropdown-toggle">
                        Cotizaciones
                    </a>
                    <ul className="dropdown-menu">
                        <li>
                            <a href="/cotizacion/">Ver Cotizaciones</a>
                        </li>
                        <li>
                            <a href="/cotizacion/agregar">Agregar Cotización</a>
                        </li>
                    </ul>
                </li>
                <li className="dropdown">
                    <a href="#" className="dropdown-toggle">
                        Proyectos
                    </a>
                    <ul className="dropdown-menu">
                        <li>
                            <a href="/cotizacion/">Ver Cotizaciones</a>
                        </li>
                        <li>
                            <a href="/proyecto/agregar">Agregar Proyecto</a>
                        </li>
                    </ul>
                </li>
                <li className="dropdown">
                    <a href="#" className="dropdown-toggle">
                        Contabilidad
                    </a>
                    <ul className="dropdown-menu">
                        <li>
                            <a href="/egresos">Ver Egresos</a>
                        </li>
                    </ul>
                </li>
            </ul>
            <button className="login-button">Iniciar Sesión</button>
        </nav>
    );
}
