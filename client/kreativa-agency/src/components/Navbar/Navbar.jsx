import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const rol = localStorage.getItem("tipo_usuario");

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

            <div>
                <button className="login-button ">Ir al Dashboard</button>
                <button className="login-button mx-2">Iniciar Sesión</button>
            </div>
        </nav>
    );
}
