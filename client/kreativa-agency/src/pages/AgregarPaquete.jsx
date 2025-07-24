import React, { useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import { notification } from "antd";

const AgregarPaquete = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [paquete, setPaquete] = useState({
		nombre: "",
		descripcion: "",
		nivel: "",
		duracion: "",
		duracionNumero: "",
		duracionUnidad: "días",
		beneficios: [""],
		precio: "",
	});

	const [showModal, setShowModal] = useState(false);

	const [api, contextHolder] = notification.useNotification();

	const openSuccessNotification = (message) => {
		api.success({
			message: "Éxito",
			description: message,
			placement: "bottomRight",
			duration: 4,
		});
	};

	const openErrorNotification = (message) => {
		api.error({
			message: "Error",
			description: message,
			placement: "bottomRight",
			duration: 4,
		});
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setPaquete((prevPaquete) => ({ ...prevPaquete, [name]: value }));
	};

	const handleBeneficioChange = (index, value) => {
		const nuevosBeneficios = [...paquete.beneficios];
		nuevosBeneficios[index] = value;
		setPaquete((prevPaquete) => ({
			...prevPaquete,
			beneficios: nuevosBeneficios,
		}));
	};

	const agregarBeneficio = () => {
		setPaquete((prevPaquete) => ({
			...prevPaquete,
			beneficios: [...prevPaquete.beneficios, ""],
		}));
	};

	const eliminarBeneficio = (index) => {
		if (paquete.beneficios.length > 1) {
			const nuevosBeneficios = paquete.beneficios.filter((_, i) => i !== index);
			setPaquete((prevPaquete) => ({
				...prevPaquete,
				beneficios: nuevosBeneficios,
			}));
		}
	};

	const handleFocus = (index) => {
		if (index === paquete.beneficios.length - 1) {
			agregarBeneficio();
		}
	};

	const handleSubmit = async () => {
		const duracionNumero = Number(paquete.duracionNumero);

		if (
			isNaN(duracionNumero) ||
			duracionNumero < 1 ||
			!paquete.duracionUnidad
		) {
			openErrorNotification(
				"Por favor ingrese una duración válida (mayor o igual a 1)"
			);
			return;
		}

		const duracion = `${duracionNumero} ${paquete.duracionUnidad}`;

		const paqueteData = {
			...paquete,
			duracion,
			precio: parseFloat(paquete.precio),
		};

		try {
			const res = await axios.put(
				`${import.meta.env.VITE_API_URL}/servicios/${id}/nuevoPaquete`,
				paqueteData
			);
			console.log(res.data);
			openSuccessNotification("Paquete agregado exitosamente");
			setShowModal(false);

			setTimeout(() => {
				navigate(`/admin/paquetes`);
			}, 2000);
		} catch (error) {
			console.error("Error al agregar el paquete: ", error.message);
			openErrorNotification("Hubo un error al agregar el paquete");
			setShowModal(false);
		}
	};

	return (
		<div>
			<AdminLayout>
				<div className="container main-container">
					<div className="section-title text-center">
						<h2>Agregar Paquete</h2>
					</div>
					<div className="mx-auto align-items-center justify-content-center d-flex">
						<div className="col-xl-8">
							{contextHolder}
							<Form
								onSubmit={(e) => {
									e.preventDefault();
									setShowModal(true);
								}}
								className="paquete_form"
							>
								<div className="row">
									<div className="col">
										<label className="form-label">Nombre del paquete</label>
										<input
											type="text"
											name="nombre"
											className="form_input"
											value={paquete.nombre}
											onChange={handleChange}
											required
										/>
									</div>
									<div className="col">
										<label className="form-label">Nivel</label>
										<input
											type="text"
											name="nivel"
											className="form_input"
											value={paquete.nivel}
											onChange={handleChange}
											required
										/>
									</div>
								</div>
								<div className="row">
									<div className="col">
										<label className="form-label">Duración</label>
										<div className="d-flex flex-wrap align-items-center gap-2">
											<input
												type="number"
												name="duracionNumero"
												className="form_input"
												value={paquete.duracionNumero || ""}
												onChange={(e) => {
													const valor = parseFloat(e.target.value);
													if (valor >= 1 || e.target.value === "") {
														setPaquete((prev) => ({
															...prev,
															duracionNumero: valor,
														}));
													}
												}}
												required
												min="1"
												placeholder="Duración"
												style={{ minWidth: "120px", flex: "1 1 120px" }}
											/>
											<select
												className="form_input"
												name="duracionUnidad"
												value={paquete.duracionUnidad || "días"}
												onChange={(e) =>
													setPaquete((prev) => ({
														...prev,
														duracionUnidad: e.target.value,
													}))
												}
												style={{ minWidth: "120px", flex: "1 1 120px" }}
											>
												<option value="días">Días</option>
												<option value="semanas">Semanas</option>
												<option value="meses">Meses</option>
											</select>
										</div>
									</div>
									<div className="col">
										<label className="form-label">Precio</label>
										<input
											type="number"
											name="precio"
											className="form_input"
											value={paquete.precio}
											onChange={handleChange}
											required
										/>
									</div>
								</div>
								<div className="row">
									<div className="col">
										<label className="form-label">Descripción</label>
										<textarea
											name="descripcion"
											className="form_input form_textarea"
											rows="3"
											value={paquete.descripcion}
											onChange={handleChange}
											required
										/>
									</div>
								</div>
								<div className="row">
									<div className="col">
										<label className="form-label">Beneficios</label>
										{paquete.beneficios.map((beneficio, index) => (
											<div
												key={index}
												className="d-flex align-items-center mb-2"
											>
												<input
													type="text"
													className="form_input"
													value={beneficio}
													onChange={(e) =>
														handleBeneficioChange(index, e.target.value)
													}
													onFocus={() => handleFocus(index)}
													required
												/>
												{index > 0 && (
													<button
														type="button"
														className="icon-btn"
														onClick={() => eliminarBeneficio(index)}
													>
														<FontAwesomeIcon icon={faX} />
													</button>
												)}
											</div>
										))}
									</div>
								</div>
								<div className="d-flex justify-content-center mt-3">
									<button type="submit" className="thm-btn form-btn">
										Agregar
									</button>
								</div>
							</Form>
						</div>
					</div>
				</div>
			</AdminLayout>

			<Modal show={showModal} onHide={() => setShowModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Confirmar Agregado</Modal.Title>
				</Modal.Header>
				<Modal.Body>¿Seguro que desea agregar este paquete?</Modal.Body>
				<Modal.Footer>
					<button
						className="thm-btn thm-btn-small btn-rojo"
						onClick={() => setShowModal(false)}
					>
						No
					</button>
					<button className="thm-btn thm-btn-small" onClick={handleSubmit}>
						Sí
					</button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default AgregarPaquete;
