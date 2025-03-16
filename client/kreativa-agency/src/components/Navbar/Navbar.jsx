import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav
            className={`navbar ${isScrolled ? "navbar-scrolled" : "navbar-fixed"} ${
                location.pathname === "/" ? "navbar-transparent" : ""
            }`}
        >
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
                    <Link to="/">Inicio</Link>
                </li>
                <li>
                    <Link to="/usuarios">Usuarios</Link>
                </li>

                <li className="dropdown">
                    <Link to="#">Empleados</Link>
                    <ul className="dropdown-menu">
                        <li>
                            <Link to="/agregar-pto">Agregar PTO</Link>
                        </li>
                        <li>
                            <Link to="/ver-pto-empleados">
                                Ver PTO Empleado
                            </Link>
                        </li>
                        <li>
                            <Link to="/jerarquia">Jerarquía</Link>
                        </li>
                        <li>
                            <Link to="/perfil">Perfil</Link>
                        </li>
                    </ul>
                </li>

                <li className="dropdown">
                    <Link to="#">Servicios</Link>
                    <ul className="dropdown-menu">
                        <li>
                            <Link to="/servicios">Servicios</Link>
                        </li>
                        <li>
                            <Link to="/servicio/agregar">Agregar Servicio</Link>
                        </li>
                    </ul>
                </li>

                <li className="dropdown">
                    <Link to="#">Cotizaciones</Link>
                    <ul className="dropdown-menu">
                        <li>
                            <Link to="/cotizacion/">Ver Cotizaciones</Link>
                        </li>
                    </ul>
                </li>

                <li className="dropdown">
                    <Link to="#">Proyectos</Link>
                    <ul className="dropdown-menu">
                        <li>
                            <Link to="/proyecto/agregar">Agregar Proyecto</Link>
                        </li>
                        <li>
                            <Link to="/proyecto/67cc94cf9ee53834562aa6d4">
                                Ver Detalle Proyecto
                            </Link>
                        </li>
                    </ul>
                </li>

                <li className="dropdown">
                    <Link to="#">Tareas</Link>
                    <ul className="dropdown-menu">
                        <li>
                            <Link to="/tareas">Listado de Tareas</Link>
                        </li>
                    </ul>
                </li>

                <li className="dropdown">
                    <Link to="#">Contabilidad</Link>
                    <ul className="dropdown-menu">
                        <li>
                            <Link to="/egresos">Ver Egresos</Link>
                        </li>
                        <li>
                            <Link to="/egreso/agregar">Agregar Egreso</Link>
                        </li>
                        <li>
                            <Link to="/ingresos">Ver Ingresos</Link>
                        </li>
                        <li>
                            <Link to="/ingreso/agregar">Agregar Ingreso</Link>
                        </li>
                        <li>
                            <Link to="/pagos/">Pagos</Link>
                        </li>
                    </ul>
                </li>
            </ul>

            <Link to="/login">
                <button className="login-button">Iniciar Sesión</button>
            </Link>
        </nav>
    );
}
