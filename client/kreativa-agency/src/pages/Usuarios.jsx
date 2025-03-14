import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEye,
    faPencil,
    faToggleOff,
    faToggleOn,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { Home, Users, Settings, LogOut, LayoutDashboard } from "lucide-react";
import "../AdminPanel.css";

const Usuarios = () => {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [estadoFiltro, setEstadoFiltro] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const usuariosPorPagina = 5;
    const [collapsed, setCollapsed] = useState(true);

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("No hay token disponible");
                    return;
                }

                const { data } = await axios.get("http://localhost:4000/api/usuarios", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setUsuarios(data.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion)));
            } catch (error) {
                console.error("Error al cargar los usuarios:", error.response?.data || error);
                setError("Error al cargar los usuarios");
            }
        };
        fetchUsuarios();
    }, []);

    return (
        <div className="admin-container">
            <motion.aside
                className={`sidebar ${collapsed ? "collapsed" : ""}`}
                animate={{ width: collapsed ? "80px" : "250px" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                onMouseEnter={() => setCollapsed(false)}
                onMouseLeave={() => setCollapsed(true)}
            >
                <ul>
                    {[{ icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" }, { icon: Home, label: "Inicio", path: "/" }, { icon: Users, label: "Usuarios", path: "/usuarios" }, { icon: Settings, label: "Configuración", path: "/configuracion" }, { icon: LogOut, label: "Salir", path: "/logout" }].map((item, index) => (
                        <motion.li key={index} whileHover={{ scale: 1.1 }} className="menu-item" onClick={() => navigate(item.path)}>
                            <item.icon size={24} />
                            {!collapsed && (
                                <motion.span animate={{ opacity: 1, display: "inline-block" }} transition={{ duration: 0.2 }}>
                                    {item.label}
                                </motion.span>
                            )}
                        </motion.li>
                    ))}
                </ul>
            </motion.aside>

            <motion.main className="content" animate={{ marginLeft: collapsed ? "80px" : "250px" }} transition={{ duration: 0.3 }}>
                <div className="container mt-5 mb-4">
                    <h1>Gestión de Usuarios</h1>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="d-flex justify-content-between mb-3">
                        <button className="thm-btn btn-verde" onClick={() => navigate("/usuario/crear")}>
                            Crear Usuario
                        </button>

                        <div className="search-container">
                            <input
                                type="text"
                                className="form-control search-input"
                                placeholder="Buscar por cédula..."
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="select-container">
                            <select className="form-control select-input" onChange={(e) => setEstadoFiltro(e.target.value)}>
                                <option value="">Todos</option>
                                <option value="Activo">Activos</option>
                                <option value="Inactivo">Inactivos</option>
                            </select>
                        </div>
                    </div>
                    <table className="table kreativa-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Usuario</th>
                                <th>Cédula</th>
                                <th>Email</th>
                                <th>Tipo</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((usuario) => (
                                <tr key={usuario._id}>
                                    <td>{usuario.nombre}</td>
                                    <td>{usuario.usuario}</td>
                                    <td>{usuario.cedula}</td>
                                    <td>{usuario.email}</td>
                                    <td>{usuario.tipo_usuario}</td>
                                    <td>{usuario.estado}</td>
                                    <td className="acciones">
                                        <div className="botones-grupo">
                                            <button className="thm-btn thm-btn-small btn-amarillo" onClick={() => navigate(`/usuario/${usuario._id}`)}>
                                                <FontAwesomeIcon icon={faEye} />
                                            </button>
                                            <button className="thm-btn thm-btn-small btn-azul" onClick={() => navigate(`/usuario/editar/${usuario._id}`)}>
                                                <FontAwesomeIcon icon={faPencil} />
                                            </button>
                                            <button
                                                className={`thm-btn thm-btn-small ${usuario.estado === "Activo" ? "btn-verde" : "btn-naranja"}`}
                                                onClick={() => {
                                                    const nuevoEstado = usuario.estado === "Activo" ? "Inactivo" : "Activo";
                                                    if (window.confirm(`¿Seguro que deseas ${nuevoEstado.toLowerCase()} este usuario?`)) {
                                                        axios.put(`http://localhost:4000/api/usuarios/${usuario._id}`, { estado: nuevoEstado }, {
                                                            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                                                        }).then(() => {
                                                            setUsuarios(usuarios.map(u => u._id === usuario._id ? { ...u, estado: nuevoEstado } : u));
                                                        });
                                                    }
                                                }}
                                            >
                                                {usuario.estado === "Activo" ? <FontAwesomeIcon icon={faToggleOff} /> : <FontAwesomeIcon icon={faToggleOn} />}
                                            </button>
                                            <button className="thm-btn thm-btn-small btn-rojo" onClick={() => {
                                                if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
                                                    axios.delete(`http://localhost:4000/api/usuarios/${usuario._id}`, {
                                                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                                                    }).then(() => {
                                                        setUsuarios(usuarios.filter(u => u._id !== usuario._id));
                                                    });
                                                }
                                            }}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* PAGINACIÓN */}
                    <div className="d-flex justify-content-center mt-4">
                        {Array.from({ length: Math.ceil(usuarios.length / usuariosPorPagina) }, (_, i) => (
                            <button key={i} className={`thm-btn btn-volver me-2 ${paginaActual === i + 1 ? "active" : ""}`} onClick={() => setPaginaActual(i + 1)}>
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </motion.main>
        </div>
    );
};

export default Usuarios;