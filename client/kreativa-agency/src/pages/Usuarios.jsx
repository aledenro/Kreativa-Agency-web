import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faChevronDown } from '@fortawesome/free-solid-svg-icons';

import {
    faEye,
    faPencil,
    faToggleOff,
    faToggleOn,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";

const Usuarios = () => {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [estadoFiltro, setEstadoFiltro] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const usuariosPorPagina = 5;

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("No hay token disponible");
                    return;
                }

                const decodedToken = jwtDecode(token);
                console.log("Token decodificado:", decodedToken);

                const { data } = await axios.get(
                    "http://localhost:4000/api/usuarios",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                setUsuarios(
                    data.sort(
                        (a, b) =>
                            new Date(b.fecha_creacion) -
                            new Date(a.fecha_creacion)
                    )
                );
            } catch (error) {
                console.error(
                    "Error al cargar los usuarios:",
                    error.response?.data || error
                );
                setError("Error al cargar los usuarios");
            }
        };
        fetchUsuarios();
    }, []);

    //  Obtener detalles de un usuario
    const handleVerUsuario = async (id) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("No hay token disponible");
                return;
            }

            const { data } = await axios.get(
                `http://localhost:4000/api/usuarios/${id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            console.log("Detalles del usuario:", data);
            navigate(`/usuario/${id}`);
        } catch (error) {
            setError("Error al obtener los detalles del usuario.");
            console.error(
                "Error al obtener usuario:",
                error.response?.data || error
            );
        }
    };

    //  Redirigir a la edición de un usuario
    const handleEditarUsuario = (id) => {
        navigate(`/usuario/editar/${id}`);
    };

    // Activar/Desactivar usuario
    const handleActivarDesactivar = async (id, estadoActual) => {
        const nuevoEstado = estadoActual === "Activo" ? "Inactivo" : "Activo";
        if (
            !window.confirm(
                `¿Seguro que deseas ${nuevoEstado.toLowerCase()} este usuario?`
            )
        )
            return;
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `http://localhost:4000/api/usuarios/${id}`,
                { estado: nuevoEstado },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setUsuarios(
                usuarios.map((usuario) =>
                    usuario._id === id
                        ? { ...usuario, estado: nuevoEstado }
                        : usuario
                )
            );
        } catch (error) {
            setError("Error al cambiar el estado del usuario.");
        }
    };

    // Eliminar usuario
    const handleEliminar = async (id) => {
        if (
            !window.confirm(
                "¿Estás seguro de que deseas eliminar este usuario?"
            )
        )
            return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:4000/api/usuarios/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setUsuarios(usuarios.filter((usuario) => usuario._id !== id));
        } catch (error) {
            setError("Error al eliminar el usuario permanentemente");
        }
    };

    // Filtrar usuarios por CÉDULA
    const usuariosFiltrados = usuarios
        .filter((usuario) => usuario.cedula.includes(search))
        .filter((usuario) =>
            estadoFiltro ? usuario.estado === estadoFiltro : true
        );

    //  Paginación
    const indexOfLastUser = paginaActual * usuariosPorPagina;
    const indexOfFirstUser = indexOfLastUser - usuariosPorPagina;
    const usuariosPaginados = usuariosFiltrados.slice(
        indexOfFirstUser,
        indexOfLastUser
    );

    const totalPaginas = Math.ceil(
        usuariosFiltrados.length / usuariosPorPagina
    );

    return (
        <AdminLayout>
            <div className="full-width-container">
                <div style={{ height: "90px" }}></div>
                <h1>Gestión de Usuarios</h1>
                {error && <div className="alert alert-danger">{error}</div>}
                <div style={{ marginBottom: "50px" }}></div>
                <div className="d-flex justify-content-between mb-3">
                    <button
                        className="thm-btn btn-verde"
                        onClick={() => navigate("/usuario/crear")}
                    >
                        Crear Usuario
                    </button>

                    <div className="search-container">
                        <FontAwesomeIcon icon={faSearch} className="icon-search" />
                        <input
                            type="text"
                            className="form-control search-input"
                            placeholder="Buscar por cédula..."
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="select-container">
                        <select
                            className="form-control select-input"
                            onChange={(e) => setEstadoFiltro(e.target.value)}
                        >
                            <option value="">Todos</option>
                            <option value="Activo">Activos</option>
                            <option value="Inactivo">Inactivos</option>
                        </select>
                        <FontAwesomeIcon icon={faChevronDown} className="icon-arrow" />
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
                        {usuariosPaginados.map((usuario) => (
                            <tr key={usuario._id}>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.usuario}</td>
                                <td>{usuario.cedula}</td>
                                <td>{usuario.email}</td>
                                <td>{usuario.tipo_usuario}</td>
                                <td>{usuario.estado}</td>
                                <td className="acciones">
                                    <div className="botones-grupo">
                                        <button
                                            className="thm-btn thm-btn-small btn-amarillo"
                                            onClick={() =>
                                                handleVerUsuario(usuario._id)
                                            }
                                        >
                                            <FontAwesomeIcon icon={faEye} />
                                        </button>
                                        <button
                                            className="thm-btn thm-btn-small btn-azul"
                                            onClick={() =>
                                                handleEditarUsuario(usuario._id)
                                            }
                                        >
                                            <FontAwesomeIcon icon={faPencil} />
                                        </button>
                                        <button
                                            className={`thm-btn thm-btn-small ${usuario.estado === "Activo" ? "btn-verde" : "btn-naranja"}`}
                                            onClick={() =>
                                                handleActivarDesactivar(
                                                    usuario._id,
                                                    usuario.estado
                                                )
                                            }
                                        >
                                            {usuario.estado === "Activo" ? (
                                                <FontAwesomeIcon
                                                    icon={faToggleOff}
                                                />
                                            ) : (
                                                <FontAwesomeIcon
                                                    icon={faToggleOn}
                                                />
                                            )}
                                        </button>
                                        <button
                                            className="thm-btn thm-btn-small btn-rojo"
                                            onClick={() =>
                                                handleEliminar(usuario._id)
                                            }
                                        >
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
                    {Array.from({ length: totalPaginas }, (_, i) => (
                        <button
                            key={i}
                            className={`thm-btn btn-volver me-2 ${paginaActual === i + 1 ? "active" : ""}`}
                            onClick={() => setPaginaActual(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
};

export default Usuarios;
