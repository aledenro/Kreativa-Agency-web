import { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar/Navbar";
import axios from "axios";
import lodash from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSort,
    faForward,
    faCaretRight,
    faCaretLeft,
    faBackward,
    faEye,
} from "@fortawesome/free-solid-svg-icons";
import ModalVerPago from "../components/Pagos/ModalVerPago";
import ModalEditarPago from "../components/Pagos/ModalEditarPago";
import ModalCrearPago from "../components/Pagos/ModalCrearPago";

const ListadoPagos = () => {
    const [pagos, setPagos] = useState([]);
    const [itemsPag, setItemsPag] = useState(5);
    const [pagActual, setPagActual] = useState(1);
    const [sortField, setsortField] = useState("fecha_creacion");
    const [sortOrder, setsortOrder] = useState("desc");
    const [filterCliente, setFilterCliente] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [pagoModal, setPagoModal] = useState({});
    const [filterStatus, setFilterStatus] = useState("");
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [pagoModalEdit, setPagoModalEdit] = useState({});
    const estados = ["Pendiente", "Pagado", "Cancelado"];
    const [clientes, setClientes] = useState([]);
    const [showModalCrear, setShowModalCrear] = useState(false);

    const rol = localStorage.getItem("tipo_usuario");

    const fetchPagos = useCallback(async () => {
        try {
            let url = `${import.meta.env.VITE_API_URL}`;

            const idUsuario = localStorage.getItem("user_id");

            url += "/pagos";

            url += rol === "Cliente" ? `/cliente/${idUsuario}` : "";
            const token = localStorage.getItem("token");
            const user = localStorage.getItem("user_name");

            const response = await axios.get(url, {
                headers: { 
						Authorization: `Bearer ${token}`,
						user: user
				
					},
            });
            setPagos(response.data);
        } catch (error) {
            console.error(error.message);
        }
    }, [rol]);

    useEffect(() => {
        async function fetchClientes() {
            try {
                const token = localStorage.getItem("token");
                const user = localStorage.getItem("user_name");

                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/usuarios/clientes`,
                    {
                        headers: { 
						Authorization: `Bearer ${token}`,
						user: user
				
					},
                    }
                );

                setClientes(response.data);
            } catch (error) {
                console.error(
                    `Error al obtener los clientes: ${error.message}`
                );
            }
        }

        fetchPagos();
        fetchClientes();
    }, [rol, fetchPagos]);

    const handleChangeCantItems = (event) => {
        setItemsPag(event.target.value);
        setPagActual(1);
    };

    let pagosFiltradas =
        filterStatus !== ""
            ? pagos.filter(
                  (pago) =>
                      lodash.get(pago, "estado").localeCompare(filterStatus) ===
                      0
              )
            : pagos;

    pagosFiltradas =
        filterCliente !== ""
            ? pagosFiltradas.filter(
                  (pago) =>
                      lodash
                          .get(pago, "cliente_id._id")
                          .localeCompare(filterCliente) === 0
              )
            : pagosFiltradas;

    const pagosOrdenadas =
        sortOrder === "asc"
            ? pagosFiltradas.sort((a, b) =>
                  lodash
                      .get(a, sortField)
                      .localeCompare(lodash.get(b, sortField))
              )
            : pagosFiltradas.sort((a, b) =>
                  lodash
                      .get(b, sortField)
                      .localeCompare(lodash.get(a, sortField))
              );

    const pagosPags =
        itemsPag !== pagosOrdenadas.length
            ? pagosOrdenadas.slice(
                  (pagActual - 1) * itemsPag,
                  pagActual * itemsPag
              )
            : pagosOrdenadas;

    const totalPags = Math.ceil(pagosFiltradas.length / itemsPag);

    if (!pagos) {
        return (
            <div className="container d-flex align-items-center justify-content-center">
                <p>Cargando Pagos...</p>
            </div>
        );
    }

    return (
        <div>
            <Navbar></Navbar>
            <div className="main-container">
                <h3 className="section-title text-center">
                    {rol === "Administrador" ? "Listado de Pagos" : "Mis Pagos"}
                </h3>

                <div className="container pt-3  table-responsive-xl">
                    <div className="row">
                        <div className="col">
                            <label htmlFor="filterStatus">
                                Filtrar por Estado:
                            </label>
                            <select
                                className="form-select form-select-sm mb-4 input-small filter-select"
                                onChange={(e) => {
                                    setFilterStatus(e.target.value);
                                    setPagActual(1);
                                }}
                                id="filterStatus"
                            >
                                <option defaultValue={""}></option>
                                <option value={"Pendiente"}>Pendiente</option>
                                <option value={"Pagado"}>Pagado</option>
                                <option value={"Cancelado"}>Cancelado</option>
                            </select>
                        </div>
                        {rol === "Administrador" ? (
                            <div className="col text-start">
                                <label htmlFor="filterCliente">
                                    Filtrar por Cliente:
                                </label>
                                <select
                                    className="form-select form-select-sm mb-4 input-small"
                                    onChange={(e) => {
                                        setFilterCliente(e.target.value);
                                        setFilterStatus(filterStatus);
                                        setPagActual(1);
                                    }}
                                    id="filterCliente"
                                >
                                    <option defaultValue={""}></option>
                                    {clientes.map((cliente) => (
                                        <option
                                            value={cliente._id}
                                            key={cliente._id}
                                        >
                                            {cliente.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            ""
                        )}

                        {rol === "Administrador" ? (
                            <div className="col text-end">
                                <button
                                    className="thm-btn btn-crear"
                                    onClick={() => setShowModalCrear(true)}
                                >
                                    Crear Pago
                                </button>
                            </div>
                        ) : (
                            ""
                        )}
                    </div>

                    <table className="table kreativa-table">
                        <thead>
                            <tr>
                                <th
                                    onClick={() => {
                                        if (sortField === "titulo") {
                                            setsortOrder(
                                                sortOrder === "asc"
                                                    ? "desc"
                                                    : "asc"
                                            );
                                            return;
                                        }

                                        setsortField("titulo");
                                        setsortOrder("asc");
                                    }}
                                    className="sort-field"
                                >
                                    Titulo <FontAwesomeIcon icon={faSort} />
                                </th>
                                {rol === "Administrador" ? (
                                    <th
                                        onClick={() => {
                                            if (
                                                sortField ===
                                                "cliente_id.nombre"
                                            ) {
                                                setsortOrder(
                                                    sortOrder === "asc"
                                                        ? "desc"
                                                        : "asc"
                                                );
                                                return;
                                            }

                                            setsortField("cliente_id.nombre");
                                            setsortOrder("asc");
                                        }}
                                        className="sort-field"
                                    >
                                        Cliente{" "}
                                        <FontAwesomeIcon icon={faSort} />
                                    </th>
                                ) : (
                                    ""
                                )}
                                <th
                                    onClick={() => {
                                        if (sortField === "estado") {
                                            setsortOrder(
                                                sortOrder === "asc"
                                                    ? "desc"
                                                    : "asc"
                                            );
                                            return;
                                        }

                                        setsortField("estado");
                                        setsortOrder("asc");
                                    }}
                                    className="sort-field"
                                >
                                    Estado <FontAwesomeIcon icon={faSort} />
                                </th>

                                <th
                                    onClick={() => {
                                        if (sortField === "fecha_vencimiento") {
                                            setsortOrder(
                                                sortOrder === "asc"
                                                    ? "desc"
                                                    : "asc"
                                            );
                                            return;
                                        }

                                        setsortField("fecha_vencimiento");
                                        setsortOrder("asc");
                                    }}
                                    className="sort-field"
                                >
                                    Fecha de Vencimiento{" "}
                                    <FontAwesomeIcon icon={faSort} />
                                </th>
                                <th className="text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pagosOrdenadas.length !== 0 ? (
                                pagosPags.map((pago) => (
                                    <tr key={pago._id}>
                                        <td>{pago.titulo}</td>
                                        {rol === "Administrador" ? (
                                            <td>{pago.cliente_id.nombre}</td>
                                        ) : (
                                            ""
                                        )}
                                        <td>{pago.estado}</td>
                                        <td>
                                            {new Date(
                                                pago.fecha_vencimiento
                                            ).toLocaleDateString()}
                                        </td>

                                        <td className="acciones">
                                            <div className="botones-grupo">
                                                <button
                                                    className="thm-btn thm-btn-small btn-amarillo"
                                                    onClick={() => {
                                                        setPagoModal(pago);
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faEye}
                                                    />
                                                </button>
                                                {rol === "Administrador" ? (
                                                    <button
                                                        className="thm-btn thm-btn-small btn-editar"
                                                        onClick={() => {
                                                            setPagoModalEdit(
                                                                pago
                                                            );
                                                            setTimeout(
                                                                () =>
                                                                    setShowModalEdit(
                                                                        true
                                                                    ),
                                                                25
                                                            );
                                                        }}
                                                    >
                                                        Editar
                                                    </button>
                                                ) : (
                                                    ""
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7}>
                                        No hay pagos por mostar.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="d-flex justify-content-center mt-4">
                    <select
                        className="form-select form-select-sm w-10 "
                        onChange={handleChangeCantItems}
                    >
                        <option value={5} selected>
                            5
                        </option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={pagosOrdenadas.length}>Todos</option>
                    </select>{" "}
                    <button
                        className={`thm-btn btn-volver thm-btn-small me-2`}
                        onClick={() => setPagActual(1)}
                        disabled={pagActual === 1}
                    >
                        <FontAwesomeIcon icon={faBackward} />
                    </button>
                    <button
                        className={`thm-btn btn-volver thm-btn-small me-2`}
                        onClick={() => setPagActual(pagActual - 1)}
                        disabled={pagActual === 1}
                    >
                        <FontAwesomeIcon icon={faCaretLeft} />
                    </button>
                    <button
                        className={`thm-btn btn-volver thm-btn-small me-2`}
                        onClick={() => setPagActual(pagActual + 1)}
                        disabled={pagActual === totalPags || totalPags - 1 <= 0}
                    >
                        <FontAwesomeIcon icon={faCaretRight} />
                    </button>
                    <button
                        className={`thm-btn thm-btn-small btn-volver me-2`}
                        onClick={() => setPagActual(totalPags)}
                        disabled={pagActual === totalPags || totalPags - 1 <= 0}
                    >
                        <FontAwesomeIcon icon={faForward} />
                    </button>
                </div>

                {pagoModal && (
                    <ModalVerPago
                        show={showModal}
                        handleClose={() => setShowModal(false)}
                        pago={pagoModal}
                        rol={rol}
                    />
                )}

                {pagoModalEdit && (
                    <ModalEditarPago
                        show={showModalEdit}
                        handleClose={() => {
                            setShowModalEdit(false);
                            setTimeout(() => fetchPagos(), 50);
                        }}
                        pago={pagoModalEdit}
                        rol={rol}
                        clientes={clientes}
                        estados={estados}
                    />
                )}

                {showModalCrear && (
                    <ModalCrearPago
                        show={showModalCrear}
                        handleClose={() => {
                            setShowModalCrear(false);
                            setTimeout(() => fetchPagos(), 50);
                        }}
                        clientes={clientes}
                        estados={estados}
                    />
                )}
            </div>
        </div>
    );
};

export default ListadoPagos;
