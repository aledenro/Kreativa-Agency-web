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
                        Empleados
                    </a>
                    <ul className="dropdown-menu">
                        <li>
                            <a href="/agregar-pto">Agregar PTO</a>
                        </li>

                        <li>
                            <a href="/ver-pto-empleados">Ver PTO Empleado</a>
                        </li>
                        <li>
                            <a href="/jerarquia">Jerarquía</a>
                        </li>
                        <li>
                            <a href="/perfil">Perfil</a>
                        </li>
                    </ul>
                </li>
                <li className="dropdown">
                    <a href="#" className="dropdown-toggle">
                        Servicios
                    </a>
                    <ul className="dropdown-menu">
                        <li>
                            <a href="/servicios">Servicios</a>
                        </li>
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
                    </ul>
                </li>
                <li className="dropdown">
                    <a href="#" className="dropdown-toggle">
                        Proyectos
                    </a>
                    <ul className="dropdown-menu">
                        <li>
                            <a href="/proyecto/editar/67cc94cf9ee53834562aa6d4">
                                Editar Proyecto
                            </a>
                        </li>
                        <li>
                            <a href="/proyecto/agregar">Agregar Proyecto</a>
                        </li>
                        <li>
                            <a href={`/proyecto/67cc94cf9ee53834562aa6d4`}>
                                Ver Detalle Proyecto
                            </a>
                        </li>
                    </ul>
                </li>
                <li className="dropdown">
                    <a href="#" className="dropdown-toggle">
                        Tareas
                    </a>
                    <ul className="dropdown-menu">
                        <li>
                            <a href="/tareas">Listado de Tareas</a>
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
                        <li>
                            <a href="/egreso/agregar">Agregar Egreso</a>
                        </li>
                        <li>
                            <a href="/ingresos">Ver Ingresos</a>
                        </li>
                        <li>
                            <a href="/ingreso/agregar">Agregar Ingreso</a>
                        </li>
                    </ul>
                </li>
            </ul>
            <a href="/login">
                <button className="login-button">Iniciar Sesión</button>
            </a>
        </nav>
    );
}
