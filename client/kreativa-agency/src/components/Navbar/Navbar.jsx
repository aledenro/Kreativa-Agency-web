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
        <div>
            {/* <nav
                classNameName={`navbar ${isScrolled ? "navbar-scrolled" : "navbar-fixed"} ${
                    location.pathname === "/" ? "navbar-transparent" : ""
                }`}
            >
                <div classNameName="hamburger" onClick={toggleMenu}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div classNameName="logo">
                    <img src="/src/assets/img/logo.png" alt="Logo" />
                </div>
                <ul classNameName={`menu ${menuOpen ? "active" : ""}`}>
                    <li>
                        <Link to="/">Inicio</Link>
                    </li>
                    <li classNameName="dropdown">
                        <Link to="#">Empleados</Link>
                        <ul classNameName="dropdown-menu">
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
                    <li classNameName="dropdown">
                        <Link to="#">Proyectos</Link>
                        <ul classNameName="dropdown-menu">
                            <li>
                                <Link to="/proyecto/agregar">
                                    Agregar Proyecto
                                </Link>
                            </li>
                            <li>
                                <Link to="/proyecto/67cc94cf9ee53834562aa6d4">
                                    Ver Detalle Proyecto
                                </Link>
                            </li>
                        </ul>
                    </li>

                    <li classNameName="dropdown">
                        <Link to="#">Contabilidad</Link>
                        <ul classNameName="dropdown-menu">
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
                                <Link to="/ingreso/agregar">
                                    Agregar Ingreso
                                </Link>
                            </li>
                            <li>
                                <Link to="/pagos/">Pagos</Link>
                            </li>
                        </ul>
                    </li>
                </ul>
                <div>
                    <Link to="/estadisticas" classNameName="login-button">
                        Ir al Dashboard
                    </Link>
                    <Link to="/login" classNameName="login-button mx-2">
                        Iniciar Sesión
                    </Link>
                </div>
            </nav> */}
            <header className="navigation position-absolute w-100 bg-body-tertiary shadow border-bottom border-light border-opacity-10 rounded-bottom-3 rounded-bottom-sm-4">
                <nav
                    className={`navbar-expand-xl navbar ${isScrolled ? "navbar-scrolled" : "navbar-fixed"} ${
                        location.pathname === "/" ? "navbar-transparent" : ""
                    }`}
                    aria-label="Offcanvas navbar large"
                >
                    <div className="container py-1">
                        <a href="/" className="navbar-brand">
                            <img
                                src="/src/assets/img/logo.png"
                                height="40"
                                alt="logo"
                            />
                        </a>

                        <button
                            className="navbar-toggler ms-auto"
                            type="button"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvasNavbar2"
                            aria-controls="offcanvasNavbar2"
                            aria-label="Toggle navigation"
                            style={{ color: "#ff0072" }}
                        >
                            <span
                                className="navbar-toggler-icon"
                                style={{
                                    color: "#ff0072",
                                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 0, 114, 1%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e")`,
                                }}
                            ></span>
                        </button>

                        <div
                            className="offcanvas offcanvas-end border-0 rounded-start-0 rounded-start-sm-4"
                            tabIndex="-1"
                            id="offcanvasNavbar2"
                            aria-labelledby="offcanvasNavbar2Label"
                            style={{ backgroundColor: "#110d27" }}
                        >
                            <div
                                className="offcanvas-header"
                                style={{ padding: "2rem 2rem 1.5rem 2rem" }}
                            >
                                <h5
                                    className="offcanvas-title m-0"
                                    id="offcanvasNavbar2Label"
                                >
                                    <a className="navbar-brand" href="#">
                                        <img
                                            src="/src/assets/img/logo.png"
                                            height="32"
                                            alt="logo"
                                        />
                                    </a>
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close text-body-emphasis"
                                    data-bs-dismiss="offcanvas"
                                    aria-label="Close"
                                    style={{
                                        filter: "invert(24%) sepia(99%) saturate(7048%) hue-rotate(327deg) brightness(100%) contrast(105%)",
                                    }}
                                ></button>
                            </div>

                            <div className="offcanvas-body">
                                <ul className="navbar-nav align-items-xl-center flex-grow-1 column-gap-4 row-gap-4 row-gap-xl-2">
                                    <li className="nav-item ms-xl-auto">
                                        <Link
                                            to="/"
                                            className="px-3 nav-link rounded-3 text-base leading-6 link"
                                            aria-current="page"
                                        >
                                            Inicio
                                        </Link>
                                    </li>

                                    <li className="nav-item">
                                        <Link
                                            href="#servicios"
                                            className="px-3 nav-link rounded-3 text-base leading-6 link"
                                        >
                                            Servicios
                                        </Link>
                                    </li>

                                    <li className="nav-item">
                                        <a
                                            href="#contacto"
                                            className="px-3 nav-link rounded-3 text-base leading-6 link"
                                        >
                                            Contacto
                                        </a>
                                    </li>

                                    <li className="nav-item">
                                        <a
                                            href="#reclutaciones"
                                            className="px-3 nav-link rounded-3 text-base leading-6 link"
                                        >
                                            Reclutacion
                                        </a>
                                    </li>

                                    <li className="nav-item ms-xl-auto d-flex gap-2">
                                        <Link
                                            to="/estadisticas"
                                            className="login-button px-3 nav-link rounded-3 text-base leading-6 fw-semibold text-center"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            to="/login"
                                            className="login-button px-3 nav-link rounded-3 text-base leading-6 fw-semibold text-center"
                                        >
                                            Iniciar Sesión
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        </div>
    );
}
