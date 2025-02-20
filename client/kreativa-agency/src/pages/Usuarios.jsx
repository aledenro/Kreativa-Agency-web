import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";

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
                const { data } = await axios.get("http://localhost:4000/api/usuarios");
                setUsuarios(data.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion)));
            } catch (error) {
                setError("Error al cargar los usuarios");
            }
        };
        fetchUsuarios();
    }, []);

    const handleEliminar = async (id) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) return;
        try {
            await axios.delete(`http://localhost:4000/api/usuarios/${id}`);
            setUsuarios(usuarios.filter((usuario) => usuario._id !== id));
        } catch (error) {
            setError("Error al eliminar el usuario permanentemente");
        }
    };

    const handleActivarDesactivar = async (id, estadoActual) => {
        const nuevoEstado = estadoActual === "Activo" ? "Inactivo" : "Activo";
        if (!window.confirm(`¿Seguro que deseas ${nuevoEstado.toLowerCase()} este usuario?`)) return;
        try {
            await axios.put(`http://localhost:4000/api/usuarios/${id}`, { estado: nuevoEstado });
            setUsuarios(usuarios.map(usuario =>
                usuario._id === id ? { ...usuario, estado: nuevoEstado } : usuario
            ));
        } catch (error) {
            setError("Error al cambiar el estado del usuario.");
        }
    };

    // Filtrar usuarios por CÉDULA 
    const usuariosFiltrados = usuarios
        .filter(usuario => usuario.cedula.includes(search)) 
        .filter(usuario => (estadoFiltro ? usuario.estado === estadoFiltro : true));

    // Paginación
    const indexOfLastUser = paginaActual * usuariosPorPagina;
    const indexOfFirstUser = indexOfLastUser - usuariosPorPagina;
    const usuariosPaginados = usuariosFiltrados.slice(indexOfFirstUser, indexOfLastUser);

    return (
        <div>
            <Navbar />
            <div className="container mt-5 mb-4">
                <h1>Gestión de Usuarios</h1>
                {error && <div className="alert alert-danger">{error}</div>}
                <div style={{ marginBottom: "50px" }}></div> 
                <div className="d-flex justify-content-between mb-3">
                    <button className="thm-btn btn-crear" onClick={() => navigate("/usuario/crear")}>
                        Crear Usuario
                    </button>

                   <div className="search-container">
                        <input
                            type="text"
                            className="form-control search-input"
                            placeholder="Buscar por cédula..."
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <svg className="icon-search" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 15L21 21" stroke="#323232" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                            <path d="M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#323232" strokeWidth="2"></path>
                        </svg>
                    </div>
               
                    <div className="select-container">
                        <select className="form-control select-input" onChange={(e) => setEstadoFiltro(e.target.value)}>
                            <option value="">Todos</option>
                            <option value="Activo">Activos</option>
                            <option value="Inactivo">Inactivos</option>
                        </select>
                        <svg className="icon-arrow" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17 10.5L12.5 15L8 10.5" stroke="#121923" strokeWidth="1.2"></path>
                        </svg>
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
                                        <button className="thm-btn thm-btn-small btn-ver" onClick={() => navigate(`/usuario/${usuario._id}`)}>Ver</button>
                                        <button className="thm-btn thm-btn-small btn-editar" onClick={() => navigate(`/usuario/editar/${usuario._id}`)}>Editar</button>
                                        <button
                                            className={`thm-btn thm-btn-small ${usuario.estado === "Activo" ? "btn-desactivar" : "btn-activar"}`}
                                            onClick={() => handleActivarDesactivar(usuario._id, usuario.estado)}
                                        >
                                            {usuario.estado === "Activo" ? "Desactivar" : "Activar"}
                                        </button>
                                        <button className="thm-btn thm-btn-small btn-eliminar" onClick={() => handleEliminar(usuario._id)}>Eliminar</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

              
                <div className="d-flex justify-content-center">
                    {Array.from({ length: Math.ceil(usuariosFiltrados.length / usuariosPorPagina) }, (_, i) => (
                        <button key={i} className="thm-btn btn-volver me-2" onClick={() => setPaginaActual(i + 1)}>
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Usuarios;