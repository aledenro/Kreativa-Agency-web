import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";
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
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import Loading from "../components/ui/LoadingComponent";
import ModalCrearUsuario from "../components/Usuarios/ModalCrearUsuario";
import ModalEditarUsuario from "../components/Usuarios/ModalEditarUsuario";
import ModalVerUsuario from "../components/Usuarios/ModalVerUsuario";
import TokenUtils, { updateSessionStatus } from "../utils/validateToken";


const useUsuarios = () => {
	const navigate = useNavigate();
	const [usuarios, setUsuarios] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const fetchUsuarios = useCallback(async () => {
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				navigate("/error", {
					state: {
						errorCode: 401,
						mensaje: "Debe iniciar sesión para continuar.",
					},
				});
				return;
			}

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
			if (error.status === 401) {
				await updateSessionStatus();				
				navigate("/error", {
					state: {
						errorCode: 401,
						mensaje: "Debe volver a iniciar sesión para continuar.",
					},
				});
				return;
			}
			console.error(
				"Error al cargar los usuarios:",
				error.response?.data || error
			);
			setError("Error al cargar los usuarios");
		} finally {
			setLoading(false);
		}
	}, [navigate]);

	const actualizarEstadoUsuario = useCallback((id, nuevoEstado) => {
		setUsuarios((prevUsuarios) =>
			prevUsuarios.map((usuario) =>
				usuario._id === id ? { ...usuario, estado: nuevoEstado } : usuario
			)
		);
	}, []);

	return {
		usuarios,
		loading,
		error,
		setError,
		fetchUsuarios,
		actualizarEstadoUsuario,
	};
};

const validateUsuario = (usuario) => {
	return (
		usuario &&
		usuario._id &&
		usuario.cedula &&
		usuario.nombre &&
		usuario.email &&
		usuario.estado
	);
};

const FiltrosUsuarios = memo(
	({ onSearchChange, onEstadoChange, onTipoChange, onCrearUsuario }) => {
		return (
			<div className="row mb-3">
				<div className="col-lg-3 col-md-12 mb-2 mb-lg-0">
					<button className="thm-btn btn-verde" onClick={onCrearUsuario}>
						Crear Usuario
					</button>
				</div>
				<div className="col-lg-3 col-md-12 mb-2 mb-lg-0">
					<input
						type="text"
						className="form_input"
						placeholder="Buscar por cédula..."
						onChange={(e) => onSearchChange(e.target.value)}
					/>
				</div>
				<div className="col-lg-3 col-md-12 mb-2 mb-lg-0">
					<select
						className="form-select form_input"
						onChange={(e) => onEstadoChange(e.target.value)}
					>
						<option value="">Todos los estados</option>
						<option value="Activo">Activos</option>
						<option value="Inactivo">Inactivos</option>
					</select>
				</div>
				<div className="col-lg-3 col-md-12">
					<select
						className="form-select form_input"
						onChange={(e) => onTipoChange(e.target.value)}
					>
						<option value="">Todos los tipos</option>
						<option value="Administrador">Administrador</option>
						<option value="Colaborador">Colaborador</option>
						<option value="Cliente">Cliente</option>
					</select>
				</div>
			</div>
		);
	}
);

const AccionesUsuario = memo(
	({ usuario, onVer, onEditar, onActivarDesactivar }) => {
		if (!validateUsuario(usuario)) {
			return <div className="text-center">Datos inválidos</div>;
		}

		return (
			<div className="botones-grupo">
				<button
					className="thm-btn thm-btn-small btn-amarillo"
					onClick={() => onVer(usuario._id)}
				>
					<FontAwesomeIcon icon={faEye} />
				</button>
				<button
					className="thm-btn thm-btn-small btn-azul"
					onClick={() => onEditar(usuario._id)}
				>
					<FontAwesomeIcon icon={faPencil} />
				</button>
				<button
					className={`thm-btn thm-btn-small ${
						usuario.estado === "Activo" ? "btn-verde" : "btn-rojo"
					}`}
					onClick={() => onActivarDesactivar(usuario._id, usuario.estado)}
				>
					<FontAwesomeIcon
						icon={usuario.estado === "Activo" ? faToggleOff : faToggleOn}
					/>
				</button>
			</div>
		);
	}
);

const Usuarios = () => {
	const navigate = useNavigate();
	const {
		usuarios,
		loading,
		error,
		setError,
		fetchUsuarios,
		actualizarEstadoUsuario,
	} = useUsuarios();

	const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
	const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
	const [mostrarModalVer, setMostrarModalVer] = useState(false);
	const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

	const [search, setSearch] = useState("");
	const [estadoFiltro, setEstadoFiltro] = useState("");
	const [tipoFiltro, setTipoFiltro] = useState("");
	const [paginaActual, setPaginaActual] = useState(1);
	const [usuariosPorPagina, setUsuariosPorPagina] = useState(5);

	useEffect(() => {
		fetchUsuarios();
	}, [fetchUsuarios]);

	const usuariosFiltrados = useMemo(() => {
		return usuarios
			.filter((usuario) => {
				if (!validateUsuario(usuario)) return false;
				return usuario.cedula.includes(search);
			})
			.filter((usuario) =>
				estadoFiltro ? usuario.estado === estadoFiltro : true
			)
			.filter((usuario) =>
				tipoFiltro ? usuario.tipo_usuario === tipoFiltro : true
			);
	}, [usuarios, search, estadoFiltro, tipoFiltro]);

	const usuariosPaginados = useMemo(() => {
		const indexOfLastUser = paginaActual * usuariosPorPagina;
		const indexOfFirstUser = indexOfLastUser - usuariosPorPagina;
		return usuariosFiltrados.slice(indexOfFirstUser, indexOfLastUser);
	}, [usuariosFiltrados, paginaActual, usuariosPorPagina]);

	const totalPaginas = useMemo(() => {
		return usuariosPorPagina >= usuariosFiltrados.length
			? 1
			: Math.ceil(usuariosFiltrados.length / usuariosPorPagina);
	}, [usuariosFiltrados.length, usuariosPorPagina]);

	const handleVerUsuario = useCallback((id) => {
		setUsuarioSeleccionado(id);
		setMostrarModalVer(true);
	}, []);

	const handleEditarUsuario = useCallback((id) => {
		setUsuarioSeleccionado(id);
		setMostrarModalEditar(true);
	}, []);

	const handleCrearUsuario = useCallback(() => {
		setMostrarModalCrear(true);
	}, []);

	const handleCerrarModales = useCallback(() => {
		setMostrarModalCrear(false);
		setMostrarModalEditar(false);
		setMostrarModalVer(false);
		setUsuarioSeleccionado(null);
	}, []);

	const handleUpdateUsuarios = useCallback(() => {
		fetchUsuarios();
	}, [fetchUsuarios]);

	const handleActivarDesactivar = useCallback(
		async (id, estadoActual) => {
			const nuevoEstado = estadoActual === "Activo" ? "Inactivo" : "Activo";
			const result = await Swal.fire({
				title: `¿Estás seguro?`,
				text: `Este usuario será marcado como ${nuevoEstado.toLowerCase()}.`,
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#3085d6",
				cancelButtonColor: "#d33",
				confirmButtonText: `Sí, ${nuevoEstado.toLowerCase()}`,
				cancelButtonText: "Cancelar",
			});

			if (!result.isConfirmed) return;

			try {
				const token = localStorage.getItem("token");
				if (!token) {
					navigate("/error", {
						state: {
							errorCode: 401,
							mensaje: "Debe iniciar sesión para continuar.",
						},
					});
					return;
				}

				await axios.put(
					`${import.meta.env.VITE_API_URL}/usuarios/${id}`,
					{ estado: nuevoEstado },
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);

				actualizarEstadoUsuario(id, nuevoEstado);

				Swal.fire({
					title: "¡Éxito!",
					text: `El usuario ha sido marcado como ${nuevoEstado.toLowerCase()}.`,
					icon: "success",
					timer: 2000,
					showConfirmButton: false,
				});
			} catch (error) {
				if (error.status === 401) {
				await updateSessionStatus();					
				localStorage.clear();
					navigate("/error", {
						state: {
							errorCode: 401,
							mensaje: "Debe volver a iniciar sesión para continuar.",
						},
					});
					return;
				}
				setError("Error al cambiar el estado del usuario.");

				Swal.fire({
					title: "Error",
					text: "No se pudo actualizar el estado del usuario.",
					icon: "error",
				});
			}
		},
		[navigate, setError, actualizarEstadoUsuario]
	);

	const handleSearchChange = useCallback((searchValue) => {
		setSearch(searchValue);
		setPaginaActual(1);
	}, []);

	const handleEstadoChange = useCallback((estado) => {
		setEstadoFiltro(estado);
		setPaginaActual(1);
	}, []);

	const handleTipoChange = useCallback((tipo) => {
		setTipoFiltro(tipo);
		setPaginaActual(1);
	}, []);

	if (loading) {
		return (
			<AdminLayout>
				<div className="main-container mx-auto">
					<Loading />
				</div>
			</AdminLayout>
		);
	}

	return (
		<AdminLayout>
			<div className="main-container mx-auto">
				<div className="espacio-top-responsive"></div>
				<h1 className="mb-4">Gestión de Usuarios</h1>
				<div style={{ marginBottom: "30px" }}></div>
				<div className="row mb-3">
					<FiltrosUsuarios
						onSearchChange={handleSearchChange}
						onEstadoChange={handleEstadoChange}
						onTipoChange={handleTipoChange}
						onCrearUsuario={handleCrearUsuario}
					/>
				</div>

				<div className="div-table">
					<Table className="main-table tabla-usuarios">
						<Thead>
							<Tr>
								<Th className="col-nombre">Nombre</Th>
								<Th className="col-usuario">Usuario</Th>
								<Th className="col-cedula">Cédula</Th>
								<Th className="col-email">Email</Th>
								<Th className="col-tipo">Tipo</Th>
								<Th className="col-estado">Estado</Th>
								<Th className="col-acciones">Acciones</Th>
							</Tr>
						</Thead>
						<Tbody>
							{usuariosPaginados.map((usuario) => {
								if (!validateUsuario(usuario)) {
									console.warn(`Usuario con datos inválidos:`, usuario);
									return null;
								}

								return (
									<Tr key={usuario._id}>
										<Td className="col-nombre" data-label="Nombre">
											{usuario.nombre}
										</Td>
										<Td className="col-usuario" data-label="Usuario">
											{usuario.usuario}
										</Td>
										<Td className="col-cedula" data-label="Cédula">
											{usuario.cedula}
										</Td>
										<Td className="col-email" data-label="Email">
											{usuario.email}
										</Td>
										<Td className="col-tipo" data-label="Tipo">
											{usuario.tipo_usuario}
										</Td>
										<Td className="col-estado" data-label="Estado">
											<span
												className={`badge ${
													usuario.estado === "Activo"
														? "badge-verde"
														: "badge-rojo"
												}`}
											>
												{usuario.estado}
											</span>
										</Td>
										<Td
											className="text-center col-acciones"
											data-label="Acciones"
										>
											<AccionesUsuario
												usuario={usuario}
												onVer={handleVerUsuario}
												onEditar={handleEditarUsuario}
												onActivarDesactivar={handleActivarDesactivar}
											/>
										</Td>
									</Tr>
								);
							})}
						</Tbody>
					</Table>
				</div>

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

				<ModalCrearUsuario
					show={mostrarModalCrear}
					handleClose={handleCerrarModales}
					onUpdate={handleUpdateUsuarios}
				/>

				<ModalEditarUsuario
					show={mostrarModalEditar}
					handleClose={handleCerrarModales}
					usuarioId={usuarioSeleccionado}
					onUpdate={handleUpdateUsuarios}
				/>

				<ModalVerUsuario
					show={mostrarModalVer}
					handleClose={handleCerrarModales}
					usuarioId={usuarioSeleccionado}
				/>
			</div>
		</AdminLayout>
	);
};

export default Usuarios;
