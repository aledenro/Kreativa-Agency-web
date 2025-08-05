import { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import axios from "axios";
import lodash, { set } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEnvelope, faSort } from "@fortawesome/free-solid-svg-icons";
import ModalVerRespuesta from "../components/Contacto/ModalVerRespuesta";
import ModalResponder from "../components/Contacto/ModalResponder";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import TablaPaginacion from "../components/ui/TablaPaginacion";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import Loading from "../components/ui/LoadingComponent";

const RespuestasContacto = () => {
	const [formularios, setFormularios] = useState([]);
	const [formularioSeleccionado, setFormularioSeleccionado] = useState(null);
	const [mostrarVerModal, setMostrarVerModal] = useState(false);
	const [mostrarResponderModal, setMostrarResponderModal] = useState(false);
	const [itemsPag, setItemsPag] = useState(5);
	const [pagActual, setPagActual] = useState(1);
	const [sortField, setSortField] = useState("fecha_envio");
	const [sortOrder, setSortOrder] = useState("desc");

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchFormularios = async () => {
			const token = localStorage.getItem("token");

			try {
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/contacto`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setFormularios(response.data.forms);
			} catch (error) {
				console.error("Error al obtener los formularios de contacto:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchFormularios();
	}, []);

	const handleVerFormulario = (form) => {
		setFormularioSeleccionado(form);
		setMostrarVerModal(true);
	};

	const handleResponderFormulario = (form) => {
		setFormularioSeleccionado(form);
		setMostrarResponderModal(true);
	};

	const formulariosOrdenados = [...formularios].sort((a, b) => {
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

	const totalPags = Math.ceil(formularios.length / itemsPag);

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
				<h1 className="mb-4">Formularios de Contacto</h1>

				<div className="div-table">
					<Table className="main-table tabla-contacto">
						<Thead>
							<Tr>
								<Th className="col-nombre">Nombre</Th>
								<Th className="col-correo">Correo</Th>
								<Th className="col-telefono">Teléfono</Th>
								<Th className="col-negocio">Negocio</Th>
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
										<Td className="col-nombre">{`${form.nombre} ${form.apellido}`}</Td>
										<Td className="col-correo">{form.correo}</Td>
										<Td className="col-telefono">{form.telefono}</Td>
										<Td className="col-negocio">{form.nombre_negocio}</Td>
										<Td className="col-fecha">
											{new Date(form.fecha_envio).toLocaleDateString()}
										</Td>
										<Td className="text-center col-acciones">
											<div className="botones-grupo">
												<button
													className="thm-btn thm-btn-small btn-amarillo"
													onClick={() => handleVerFormulario(form)}
												>
													<FontAwesomeIcon icon={faEye} />
												</button>
												<button
													className="thm-btn thm-btn-small btn-azul"
													onClick={() => handleResponderFormulario(form)}
												>
													<FontAwesomeIcon icon={faEnvelope} />
												</button>
											</div>
										</Td>
									</Tr>
								))
							) : (
								<Tr>
									<Td colSpan="7" className="text-center">
										No hay formularios disponibles
									</Td>
								</Tr>
							)}
						</Tbody>
					</Table>
				</div>

				{/* <div className="table-responsive-xxl">
          <table className="table kreativa-proyecto-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Negocio</th>
                <th
                  onClick={() => handleSort("fecha_envio")}
                  style={{ cursor: "pointer" }}
                >
                  Fecha <FontAwesomeIcon icon={faSort} />
                </th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {formulariosPaginados.length > 0 ? (
                formulariosPaginados.map((form) => (
                  <tr key={form._id}>
                    <td>{form.nombre}</td>
                    <td>{form.apellido}</td>
                    <td>{form.correo}</td>
                    <td>{form.telefono}</td>
                    <td>{form.nombre_negocio}</td>
                    <td>{new Date(form.fecha_envio).toLocaleDateString()}</td>
                    <td className="acciones">
                      <div className="botones-grupo">
                        <button
                          className="thm-btn thm-btn-small btn-amarillo"
                          onClick={() => handleVerFormulario(form)}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button
                          className="thm-btn thm-btn-small btn-azul"
                          onClick={() => handleResponderFormulario(form)}
                        >
                          <FontAwesomeIcon icon={faEnvelope} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No hay formularios disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div> */}

				<TablaPaginacion
					totalItems={formularios.length}
					itemsPorPagina={itemsPag}
					paginaActual={pagActual}
					onItemsPorPaginaChange={(cant) => {
						setItemsPag(cant);
						setPagActual(1);
					}}
					onPaginaChange={(pagina) => setPagActual(pagina)}
				/>

				{mostrarVerModal && (
					<ModalVerRespuesta
						form={formularioSeleccionado}
						onClose={() => setMostrarVerModal(false)}
					/>
				)}
				{mostrarResponderModal && (
					<ModalResponder
						form={formularioSeleccionado}
						onClose={() => setMostrarResponderModal(false)}
					/>
				)}
			</div>
		</AdminLayout>
	);
};

export default RespuestasContacto;
