import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faEye } from "@fortawesome/free-solid-svg-icons";
import lodash from "lodash";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import ModalVerCotizacion from "../components/Cotizaciones/ModalVerDetalles";
import ModalAgregar from "../components/Cotizaciones/ModalAgregar";
import TablaPaginacion from "../components/ui/TablaPaginacion";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

const getEstado = (status) => {
	switch (status) {
		case "Nuevo":
			return "badge badge-azul";
		case "Aceptado":
			return "badge badge-verde";
		case "Cancelado":
			return "badge badge-rojo";
		default:
			return "badge badge-gris";
	}
};

const getUrgencyClass = (urgente) => {
	return urgente ? "badge badge-rojo" : "badge badge-gris";
};

const VerCotizaciones = () => {
	const [cotizaciones, setCotizaciones] = useState([]);
	const [itemsPag, setItemsPag] = useState(5);
	const [pagActual, setPagActual] = useState(1);
	const [sortField, setsortField] = useState("fecha_solicitud");
	const [sortOrder, setsortOrder] = useState("desc");
	const [showModalDetalles, setShowModalDetalles] = useState(false);
	const [selectedId, setSelectedId] = useState(null);
	const [showModalCrear, setShowModalCrear] = useState(false);
	const tipoUsuario = localStorage.getItem("tipo_usuario");
	const user_id = localStorage.getItem("user_id");

	const getCotizaciones = useCallback(async () => {
		try {
			let url = `${import.meta.env.VITE_API_URL}/cotizaciones/`;

			url += tipoUsuario === "Cliente" ? `getByUser/${user_id}` : "";

			const response = await axios.get(url);
			setCotizaciones(response.data.cotizaciones);
			setsortField("fecha_solicitud");
			setsortOrder("desc");
		} catch (error) {
			console.error(error.message);
		}
	}, [tipoUsuario, user_id]);

	useEffect(() => {
		getCotizaciones();
	}, [getCotizaciones]);

	function handleVerDetalles(id) {
		setSelectedId(id);
		setShowModalDetalles(true);
	}

	const handleChangeCantItems = (event) => {
		setItemsPag(event.target.value);
		setPagActual(1);
	};

	const cotizacionesOrdenadas = cotizaciones.sort((a, b) => {
		const valorA = lodash.get(a, sortField);
		const valorB = lodash.get(b, sortField);

		if (typeof valorA === "boolean" && typeof valorB === "boolean") {
			return sortOrder === "asc"
				? Number(valorA) - Number(valorB)
				: Number(valorB) - Number(valorA);
		}

		if (typeof valorA === "string" && typeof valorB === "string") {
			return sortOrder === "asc"
				? valorA.localeCompare(valorB)
				: valorB.localeCompare(valorA);
		}

		return sortOrder === "asc"
			? valorA > valorB
				? 1
				: -1
			: valorA < valorB
				? 1
				: -1;
	});

	const cotizacionesPags =
		itemsPag !== cotizacionesOrdenadas.length
			? cotizacionesOrdenadas.slice(
					(pagActual - 1) * itemsPag,
					pagActual * itemsPag
				)
			: cotizacionesOrdenadas;

	const totalPags = Math.ceil(cotizaciones.length / itemsPag);

	if (!cotizaciones) {
		return (
			<div className="container d-flex align-items-center justify-content-center">
				<p>Cargando cotizaciones...</p>
			</div>
		);
	}

	return (
		<AdminLayout>
			<div className="main-container mx-auto">
				<div className="espacio-top-responsive"></div>
				<div className="d-flex justify-content-between align-items-center mb-4">
					<h1>Listado de Cotizaciones</h1>
					<button className="thm-btn" onClick={() => setShowModalCrear(true)}>
						Solicitar Cotización
					</button>
				</div>

				<div className="div-table">
					<Table className="main-table tabla-cotizaciones">
						<Thead>
							<Tr>
								<Th
									className="col-nombre"
									onClick={() => {
										if (sortField === "titulo") {
											setsortOrder(sortOrder === "asc" ? "desc" : "asc");
											return;
										}
										setsortField("titulo");
										setsortOrder("asc");
									}}
								>
									Título{" "}
									<span className="sort-icon">
										<FontAwesomeIcon icon={faSort} />
									</span>
								</Th>
								<Th
									className="col-cliente"
									onClick={() => {
										if (sortField === "cliente_id.nombre") {
											setsortOrder(sortOrder === "asc" ? "desc" : "asc");
											return;
										}
										setsortField("cliente_id.nombre");
										setsortOrder("asc");
									}}
								>
									Cliente{" "}
									<span className="sort-icon">
										<FontAwesomeIcon icon={faSort} />
									</span>
								</Th>
								<Th
									className="col-estado"
									onClick={() => {
										if (sortField === "estado") {
											setsortOrder(sortOrder === "asc" ? "desc" : "asc");
											return;
										}
										setsortField("estado");
										setsortOrder("asc");
									}}
								>
									Estado{" "}
									<span className="sort-icon">
										<FontAwesomeIcon icon={faSort} />
									</span>
								</Th>
								<Th
									className="col-fecha"
									onClick={() => {
										if (sortField === "fecha_solicitud") {
											setsortOrder(sortOrder === "asc" ? "desc" : "asc");
											return;
										}
										setsortField("fecha_solicitud");
										setsortOrder("asc");
									}}
								>
									Fecha{" "}
									<span className="sort-icon">
										<FontAwesomeIcon icon={faSort} />
									</span>
								</Th>
								<Th
									className="col-prioridad"
									onClick={() => {
										if (sortField === "urgente") {
											setsortOrder(sortOrder === "asc" ? "desc" : "asc");
											return;
										}
										setsortField("urgente");
										setsortOrder("asc");
									}}
								>
									Urgente{" "}
									<span className="sort-icon">
										<FontAwesomeIcon icon={faSort} />
									</span>
								</Th>
								<Th className="col-acciones">Acciones</Th>
							</Tr>
						</Thead>
						<Tbody>
							{cotizacionesPags.map((cotizacion) => (
								<Tr key={cotizacion._id}>
									<Td className="col-nombre">{cotizacion.titulo}</Td>
									<Td className="col-cliente">
										{cotizacion.cliente_id?.nombre ?? "Sin cliente"}
									</Td>
									<Td className="col-estado text-center">
										<div className={`${getEstado(cotizacion.estado)}`}>
											{cotizacion.estado}
										</div>
									</Td>
									<Td className="col-fecha">
										{new Date(cotizacion.fecha_solicitud).toLocaleDateString()}
									</Td>
									<Td className="col-prioridad">
										<div className={`${getUrgencyClass(cotizacion.urgente)}`}>
											{cotizacion.urgente ? "Sí" : "No"}
										</div>
									</Td>
									<Td className="col-acciones">
										<button
											className="thm-btn thm-btn-small btn-amarillo"
											onClick={() => handleVerDetalles(cotizacion._id)}
										>
											<FontAwesomeIcon icon={faEye} />
										</button>
									</Td>
								</Tr>
							))}
						</Tbody>
					</Table>
				</div>

				<TablaPaginacion
					totalItems={cotizacionesOrdenadas.length}
					itemsPorPagina={itemsPag}
					paginaActual={pagActual}
					onItemsPorPaginaChange={(cant) => {
						setItemsPag(cant);
						setPagActual(1);
					}}
					onPaginaChange={(pagina) => setPagActual(pagina)}
				/>
			</div>

			{showModalDetalles && selectedId !== null && (
				<ModalVerCotizacion
					show={showModalDetalles}
					handleClose={() => setShowModalDetalles(false)}
					cotizacionId={selectedId}
				/>
			)}

			{showModalCrear && (
				<ModalAgregar
					show={showModalCrear}
					handleClose={() => {
						setShowModalCrear(false);
						setTimeout(() => getCotizaciones(), 50);
					}}
				/>
			)}
		</AdminLayout>
	);
};

export default VerCotizaciones;
