import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faChevronDown,
  faEye,
  faPencil,
  faToggleOff,
  faToggleOn,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import TablaPaginacion from "../components/ui/TablaPaginacion";

const Usuarios = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  //   const usuariosPorPagina = 5;
  const [usuariosPorPagina, setUsuariosPorPagina] = useState(5);

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
          `${import.meta.env.VITE_API_URL}/usuarios`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUsuarios(
          data.sort(
            (a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion)
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

  const handleVerUsuario = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No hay token disponible");
        return;
      }

      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/usuarios/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Detalles del usuario:", data);
      navigate(`/usuario/${id}`);
    } catch (error) {
      setError("Error al obtener los detalles del usuario.");
      console.error("Error al obtener usuario:", error.response?.data || error);
    }
  };

  const handleEditarUsuario = (id) => {
    navigate(`/usuario/editar/${id}`);
  };

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
        `${import.meta.env.VITE_API_URL}/usuarios/${id}`,
        { estado: nuevoEstado },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUsuarios(
        usuarios.map((usuario) =>
          usuario._id === id ? { ...usuario, estado: nuevoEstado } : usuario
        )
      );
    } catch (error) {
      setError("Error al cambiar el estado del usuario.");
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario?"))
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_URL}/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsuarios(usuarios.filter((usuario) => usuario._id !== id));
    } catch (error) {
      setError("Error al eliminar el usuario permanentemente");
    }
  };

  const usuariosFiltrados = usuarios
    .filter((usuario) => usuario.cedula.includes(search))
    .filter((usuario) =>
      estadoFiltro ? usuario.estado === estadoFiltro : true
    );

  const indexOfLastUser = paginaActual * usuariosPorPagina;
  const indexOfFirstUser = indexOfLastUser - usuariosPorPagina;
  //   const usuariosPaginados = usuariosFiltrados.slice(
  //     indexOfFirstUser,
  //     indexOfLastUser
  //   );
  const usuariosPaginados = usuariosFiltrados.slice(
    indexOfFirstUser,
    indexOfLastUser
  );

  //   const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);
  const totalPaginas =
    usuariosPorPagina >= usuariosFiltrados.length
      ? 1
      : Math.ceil(usuariosFiltrados.length / usuariosPorPagina);

  return (
    <AdminLayout>
      <div className="full-width-container">
        <div className="espacio-top-responsive"></div>
        <h1>Gestión de Usuarios</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        <div style={{ marginBottom: "30px" }}></div>

        {/* Filtros responsivos */}
        <div className="d-flex justify-content-between flex-wrap gap-3 mb-4">
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
                <td data-label="Nombre">{usuario.nombre}</td>
                <td data-label="Usuario">{usuario.usuario}</td>
                <td data-label="Cédula">{usuario.cedula}</td>
                <td data-label="Email">{usuario.email}</td>
                <td data-label="Tipo">{usuario.tipo_usuario}</td>
                <td data-label="Estado">{usuario.estado}</td>
                <td className="acciones" data-label="Acciones">
                  <div className="botones-grupo">
                    <button
                      className="thm-btn thm-btn-small btn-amarillo"
                      onClick={() => handleVerUsuario(usuario._id)}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button
                      className="thm-btn thm-btn-small btn-azul"
                      onClick={() => handleEditarUsuario(usuario._id)}
                    >
                      <FontAwesomeIcon icon={faPencil} />
                    </button>
                    <button
                      className={`thm-btn thm-btn-small ${usuario.estado === "Activo" ? "btn-verde" : "btn-naranja"}`}
                      onClick={() =>
                        handleActivarDesactivar(usuario._id, usuario.estado)
                      }
                    >
                      {usuario.estado === "Activo" ? (
                        <FontAwesomeIcon icon={faToggleOff} />
                      ) : (
                        <FontAwesomeIcon icon={faToggleOn} />
                      )}
                    </button>
                    <button
                      className="thm-btn thm-btn-small btn-rojo"
                      onClick={() => handleEliminar(usuario._id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* <div className="kreativa-paginacion">
                    {Array.from({ length: totalPaginas }, (_, i) => (
                        <button
                            key={i}
                            className={`thm-btn btn-volver ${paginaActual === i + 1 ? "active" : ""}`}
                            onClick={() => setPaginaActual(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div> */}

        {usuariosPaginados.length > 0 && (
          <TablaPaginacion
            totalItems={usuariosFiltrados.length}
            itemsPorPagina={usuariosPorPagina}
            paginaActual={paginaActual}
            onItemsPorPaginaChange={(cant) => {
              setUsuariosPorPagina(cant);
              setPaginaActual(1);
            }}
            onPaginaChange={(pagina) => setPaginaActual(pagina)}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default Usuarios;
