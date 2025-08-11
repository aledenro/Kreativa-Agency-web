import { useEffect, useState } from "react";
import axios from "axios";
import lodash from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faSort } from "@fortawesome/free-solid-svg-icons";
import ModalVerReclutacion from "../components/Reclutaciones/ModalVerReclutacion";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import TablaPaginacion from "../components/ui/TablaPaginacion";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { Modal } from "react-bootstrap";
import Loading from "../components/ui/LoadingComponent";
import { useFormStatus } from "../context/FormStatusContext";
import { useNavigate } from "react-router-dom";
import TokenUtils, { updateSessionStatus } from "../utils/validateToken";


const RespuestasReclutaciones = () => {
	const [formularios, setFormularios] = useState([]);
	const [formularioSeleccionado, setFormularioSeleccionado] = useState(null);
	const [mostrarModal, setMostrarModal] = useState(false);
	const [itemsPag, setItemsPag] = useState(5);
	const [pagActual, setPagActual] = useState(1);
	const [sortField, setSortField] = useState("fecha_envio");
	const [sortOrder, setSortOrder] = useState("desc");
	const [filtroEstado, setFiltroEstado] = useState("todos");

	const { formActive: isFormActive, setFormActive } = useFormStatus();
	const [loading, setLoading] = useState(true);
	const [toggleLoading, setToggleLoading] = useState(false);

	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [modalAction, setModalAction] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const fetchFormularios = async () => {
			const token = localStorage.getItem("token");
			const user = localStorage.getItem("user_name");

			if (!token) {
				navigate("/error", {
					state: {
						errorCode: 401,
						mensaje: "Debe iniciar sesión para continuar.",
					},
				});
			}

			try {
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/reclutaciones`,
					{
						headers: { 
						Authorization: `Bearer ${token}`,
						user: user
				
					},
					}
				);
				setFormularios(response.data);
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
					"Error al obtener los formularios de reclutamiento",
					error
				);
			} finally {
				setLoading(false);
			}
		};

		const fetchFormStatus = async () => {
			const token = localStorage.getItem("token");
			const user = localStorage.getItem("user_name");

			if (!token) {
				navigate("/error", {
					state: {
						errorCode: 401,
						mensaje: "Debe iniciar sesión para continuar.",
					},
				});
			}

			try {
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/form-status`,
					{
						headers: { 
						Authorization: `Bearer ${token}`,
						user: user
				
					},
					}
				);
				setFormActive(response.data.active);
			} catch (error) {
				if (error.status === 401) {
				await updateSessionStatus();					navigate("/error", {
						state: {
							errorCode: 401,
							mensaje: "Debe volver a iniciar sesión para continuar.",
						},
					});
					return;
				}
				console.error("Error al obtener estado del formulario");
			} finally {
				setLoading(false);
			}
		};

		fetchFormularios();
	}, []);

	const confirmToggleFormStatus = () => {
		setModalAction(isFormActive ? "desactivar" : "activar");
		setShowConfirmModal(true);
	};

	const toggleFormStatus = async () => {
		const token = localStorage.getItem("token");
		const user = localStorage.getItem("user_name");

		if (!token) {
			navigate("/error", {
				state: {
					errorCode: 401,
					mensaje: "Acceso no autorizado.",
				},
			});
			return;
		}

		try {
			setToggleLoading(true);

			const response = await axios.put(
				`${import.meta.env.VITE_API_URL}/form-status`,
				{},
				{
					headers: { 
						Authorization: `Bearer ${token}`,
						user: user
				
					},
				}
			);
			setFormActive(response.data.active);
		} catch (error) {
			if (error.status === 401) {
				await updateSessionStatus();				localStorage.clear();
				navigate("/error", {
					state: {
						errorCode: 401,
						mensaje: "Debe volver a iniciar sesión para continuar.",
					},
				});

				return;
			}
			console.error("Error al cambiar estado del formulario");
		} finally {
			setToggleLoading(false);
			setShowConfirmModal(false);
		}
	};

	const handleVerFormulario = (form) => {
		setFormularioSeleccionado(form);
		setMostrarModal(true);
	};

	const refetchFormularios = async () => {
		const token = localStorage.getItem("token");
		const user = localStorage.getItem("user_name");
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/reclutaciones`,
				{
					headers: { 
						Authorization: `Bearer ${token}`,
						user: user
				
					},
				}
			);
			setFormularios(response.data);
		} catch (error) {
			console.error("Error al recargar formularios", error);
		}
	};

	const formulariosFilter = formularios.filter((form) => {
		if (filtroEstado === "todos") return true;
		if (filtroEstado === "activos") return form.activo === true;
		if (filtroEstado === "inactivos") return form.activo === false;
		return true;
	});

	const formulariosOrdenados = [...formulariosFilter].sort((a, b) => {
		const valueA = lodash.get(a, sortField);
		const valueB = lodash.get(b, sortField);

		return sortOrder === "asc"
			? new Date(valueA) - new Date(valueB)
			: new Date(valueB) - new Date(valueA);
	});

	const formulariosPaginados = formulariosOrdenados.slice(
		(pagActual - 1) * itemsPag,
		pagActual * itemsPag
	);

	const totalPags = Math.ceil(formulariosOrdenados.length / itemsPag);

	const handleSort = (field) => {
		if (sortField === field) {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortOrder("asc");
		}
	};

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
				<h1 className="mb-4">Formularios de Reclutamiento</h1>
				<div className="admin-panel">
					<h2>Panel de Control</h2>
					<div className="control-item d-flex align-items-center gap-3 flex-wrap mb-4">
						<span>
							¡El formulario actualmente se encuentra{" "}
							<strong className={isFormActive ? "text-success" : "text-danger"}>
								{isFormActive ? "activo" : "inactivo"}
							</strong>
							!
						</span>
						<button
							onClick={confirmToggleFormStatus}
							disabled={toggleLoading}
							className={`thm-btn thm-btn-small ${isFormActive ? "btn-rojo" : "btn-verde"}`}
						>
							{toggleLoading
								? "Cargando..."
								: isFormActive
									? "Desactivar"
									: "Activar"}
						</button>
					</div>
				</div>

				<div className="row mb-3">
					<div className="col-3">
						<label htmlFor="filterEstado">Filtrar por estado:</label>
						<select
							className="form-select form_input"
							value={filtroEstado}
							onChange={(e) => {
								setFiltroEstado(e.target.value);
								setPagActual(1);
							}}
							id="filterEstado"
						>
							<option value="todos">Todos</option>
							<option value="activos">Activos</option>
							<option value="inactivos">Inactivos</option>
						</select>
					</div>
				</div>

				<div className="div-table">
					<Table className="main-table tabla-trabajo">
						<Thead>
							<Tr>
								<Th className="col-nombre">Nombre</Th>
								<Th className="col-correo">Correo</Th>
								<Th className="col-telefono">Teléfono</Th>
								<Th className="col-estado">Estado</Th>
								<Th
									className="col-fecha"
									onClick={() => handleSort("fecha_envio")}
									style={{ cursor: "pointer" }}
								>
									Fecha{" "}
									<span className="sort-icon">
										<FontAwesomeIcon icon={faSort} />
									</span>
								</Th>
								<Th className="col-acciones">Acciones</Th>
							</Tr>
						</Thead>
						<Tbody>
							{formulariosPaginados.length > 0 ? (
								formulariosPaginados.map((form) => (
									<Tr key={form._id}>
										<Td className="col-nombre">
											{form.nombre} {form.apellido}
										</Td>
										<Td className="col-correo">{form.correo}</Td>
										<Td className="col-telfono">{form.telefono}</Td>
										<Td className="col-estado text-center">
											<span
												className={`badge ${form.activo ? "badge-verde" : "badge-rojo"}`}
											>
												{form.activo ? "Activo" : "Inactivo"}
											</span>
										</Td>
										<Td className="col-fecha">
											{new Date(form.fecha_envio).toLocaleDateString()}
										</Td>
										<Td className="text-center col-acciones">
											<button
												className="thm-btn thm-btn-small btn-amarillo"
												onClick={() => handleVerFormulario(form)}
												title="Ver detalles"
											>
												<FontAwesomeIcon icon={faEye} />
											</button>
										</Td>
									</Tr>
								))
							) : (
								<Tr>
									<Td colSpan="6" className="text-center">
										No hay formularios disponibles
									</Td>
								</Tr>
							)}
						</Tbody>
					</Table>
				</div>

				<TablaPaginacion
					totalItems={formulariosOrdenados.length}
					itemsPorPagina={itemsPag}
					paginaActual={pagActual}
					onItemsPorPaginaChange={(cant) => {
						setItemsPag(cant);
						setPagActual(1);
					}}
					onPaginaChange={(pagina) => setPagActual(pagina)}
				/>

				{mostrarModal && formularioSeleccionado && (
					<ModalVerReclutacion
						show={mostrarModal}
						handleClose={() => setMostrarModal(false)}
						form={formularioSeleccionado}
						onUpdate={refetchFormularios}
					/>
				)}
			</div>

			<Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Confirmar Acción</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					¿Seguro que desea {modalAction} el formulario de reclutamiento?
				</Modal.Body>
				<Modal.Footer>
					<button
						className="thm-btn thm-btn-small btn-gris mx-1"
						onClick={() => setShowConfirmModal(false)}
					>
						Cancelar
					</button>
					<button className="thm-btn thm-btn-small" onClick={toggleFormStatus}>
						Sí
					</button>
				</Modal.Footer>
			</Modal>
		</AdminLayout>
	);
};

export default RespuestasReclutaciones;
