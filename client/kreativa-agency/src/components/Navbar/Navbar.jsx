import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const rol = localStorage.getItem("tipo_usuario");
        const token = localStorage.getItem("token");

        if (token) {
            setIsLoggedIn(true);
            setUserRole(rol);
        } else {
            setIsLoggedIn(false);
            setUserRole(null);
        }

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollToSection = (sectionId, event) => {
        event.preventDefault();
        const element = document.getElementById(sectionId);
        if (element) {
            if (location.pathname !== "/") {
                window.location.href = "/#" + sectionId;
                return;
            }

            const navbarHeight =
                document.querySelector(".navigation").offsetHeight;

            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition =
                elementPosition + window.pageYOffset - navbarHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });

            if (menuOpen) {
                setMenuOpen(false);
                const offcanvasElement =
                    document.getElementById("offcanvasNavbar2");
                if (offcanvasElement) {
                    const bsOffcanvas =
                        bootstrap.Offcanvas.getInstance(offcanvasElement);
                    if (bsOffcanvas) {
                        bsOffcanvas.hide();
                    }
                }
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("tipo_usuario");
        setIsLoggedIn(false);
        setUserRole(null);
        window.location.href = "/";
    };

    return (
        <div>
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
                            onClick={() => setMenuOpen(!menuOpen)}
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
                                    <a className="navbar-brand" href="/">
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
                                        <a
                                            href="/"
                                            className="px-3 nav-link rounded-3 text-base leading-6 link"
                                            onClick={(e) =>
                                                scrollToSection("servicios", e)
                                            }
                                        >
                                            Servicios
                                        </a>
                                    </li>

                                    <li className="nav-item">
                                        <a
                                            href="/"
                                            className="px-3 nav-link rounded-3 text-base leading-6 link"
                                            onClick={(e) =>
                                                scrollToSection("contacto", e)
                                            }
                                        >
                                            Contacto
                                        </a>
                                    </li>

                                    <li className="nav-item">
                                        <a
                                            href="/"
                                            className="px-3 nav-link rounded-3 text-base leading-6 link"
                                            onClick={(e) =>
                                                scrollToSection(
                                                    "reclutaciones",
                                                    e
                                                )
                                            }
                                        >
                                            Reclutación
                                        </a>
                                    </li>

                                    <li className="nav-item ms-xl-auto d-flex gap-2">
                                        {isLoggedIn && (
                                            <Link
                                                to="/estadisticas"
                                                className="login-button px-3 nav-link rounded-3 text-base leading-6 fw-semibold text-center"
                                            >
                                                Dashboard
                                            </Link>
                                        )}

                                        {!isLoggedIn ? (
                                            <Link
                                                to="/login"
                                                className="login-button px-3 nav-link rounded-3 text-base leading-6 fw-semibold text-center"
                                            >
                                                Iniciar Sesión
                                            </Link>
                                        ) : (
                                            <button
                                                onClick={handleLogout}
                                                className="login-button px-3 nav-link rounded-3 text-base leading-6 fw-semibold text-center"
                                            >
                                                Cerrar Sesión
                                            </button>
                                        )}
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
