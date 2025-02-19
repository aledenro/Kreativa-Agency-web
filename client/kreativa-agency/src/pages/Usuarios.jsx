import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";

const Usuarios = () => {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [estadoFiltro, setEstadoFiltro] = useState(""); // Activo/Inactivo
    const [paginaActual, setPaginaActual] = useState(1);
    const usuariosPorPagina = 5;

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const { data } = await axios.get("http://localhost:4000/api/usuarios");
                setUsuarios(data.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion))); // Ordenar por fecha
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
            setError("Error al eliminar el usuario");
        }
    };

    // Filtrar usuarios
    const usuariosFiltrados = usuarios
        .filter(usuario => usuario.nombre.toLowerCase().includes(search.toLowerCase()))
        .filter(usuario => (estadoFiltro ? usuario.estado === estadoFiltro : true));

    // Paginación
    const indexOfLastUser = paginaActual * usuariosPorPagina;
    const indexOfFirstUser = indexOfLastUser - usuariosPorPagina;
    const usuariosPaginados = usuariosFiltrados.slice(indexOfFirstUser, indexOfLastUser);

    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                <h1>Gestión de Usuarios</h1>
                {error && <div className="alert alert-danger">{error}</div>}

                <div className="d-flex justify-content-between mb-3">
                    <button className="thm-btn btn-crear" onClick={() => navigate("/usuario/crear")}>
                        Crear Usuario
                    </button>
                    <input
                        type="text"
                        className="form-control w-25"
                        placeholder="Buscar usuario..."
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select className="form-control w-25" onChange={(e) => setEstadoFiltro(e.target.value)}>
                        <option value="">Todos</option>
                        <option value="Activo">Activos</option>
                        <option value="Inactivo">Inactivos</option>
                    </select>
                </div>

                <table className="table kreativa-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Usuario</th>
                            <th>Email</th>
                            <th>Tipo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuariosPaginados.map((usuario) => (
                            <tr key={usuario._id}>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.usuario}</td>
                                <td>{usuario.email}</td>
                                <td>{usuario.tipo_usuario}</td>
                                <td className="acciones">
                                    <div className="botones-grupo">
                                        <button className="thm-btn btn-ver me-2" onClick={() => navigate(`/usuario/${usuario._id}`)}>Ver</button>
                                        <button className="thm-btn btn-editar me-2" onClick={() => navigate(`/usuario/editar/${usuario._id}`)}>Editar</button>
                                        <button className="thm-btn btn-eliminar" onClick={() => handleEliminar(usuario._id)}>Eliminar</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Paginación */}
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