import { Modal } from "react-bootstrap";
import axios from "axios";
import PropTypes from "prop-types";
import { useState } from "react";
import { notification } from "antd";
import lodash from "lodash";
import forceFileDownload from "../../utils/forceFileDownload";

const columnasIngresos = [
    "Fecha",
    "Monto",
    "Descripcion",
    "Nombre",
    "Categoria",
    "Estado",
];
const columnasEgresos = [
    "Fecha",
    "Monto",
    "Categoria",
    "Descripcion",
    "Proveedor",
    "Estado",
];

const ModalImprimirReportes = ({ show, handleClose }) => {
    const [error, setError] = useState("");
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

    const getDataSinglePageData = async (url) => {
        const res = await axios.get(url);

        return res.data;
    };

    const handleImprimirReporte = async (event) => {
        event.preventDefault();

        const ingresos = event.target.Ingresos.checked;
        const egresos = event.target.Egresos.checked;
        const fechaInicio = event.target.fechaInicio.value;
        const fechaFin = event.target.fechaFin.value;

        let errorMsg =
            !ingresos && !egresos
                ? "Debe seleccionar egresos, ingresos o ambos para poder imprimir un reporte."
                : "";

        if (errorMsg) {
            openErrorNotification(errorMsg);
            return;
        }

        if ((ingresos && !egresos) || (!ingresos && egresos)) {
            const dataReport = ingresos ? "ingresos" : "egresos";

            const url = `http://localhost:4000/api/${dataReport}/getByDateRange?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
            const fileName = `reporte_de_${dataReport}_${fechaInicio}_${fechaFin}`;

            try {
                const data = await getDataSinglePageData(url);

                if (lodash.isEmpty(data)) {
                    openErrorNotification(
                        `No hay datos de ${dataReport} entre ${fechaInicio} y ${fechaFin}.`
                    );
                    return;
                }

                const response = await axios.post(
                    "http://localhost:3000/printExcel/singlePage",
                    {
                        cols: ingresos ? columnasIngresos : columnasEgresos,
                        data: data,
                        fileName: fileName,
                        sheetName: dataReport,
                    },
                    {
                        responseType: "blob",
                    }
                );

                if (response.status === 200) {
                    const blob = new Blob([response.data], {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    });

                    forceFileDownload(blob, fileName);

                    openSuccessNotification(
                        `Reporte  de ${dataReport} generado correctamente.`
                    );
                    event.target.reset();
                    return;
                }
            } catch (error) {
                console.error(error.message);
                openErrorNotification(
                    `Error al generar el  reporte de ${dataReport}.`
                );
            }
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            {contextHolder}
            <Modal.Header closeButton>
                <Modal.Title>Imprimir Reporte Ingresos/Egresos</Modal.Title>
            </Modal.Header>
            <div className="card p-4 shadow-lg">
                <form onSubmit={handleImprimirReporte}>
                    <div className="row mb-3">
                        <div className="col mx-3">
                            <div className="mb-3 form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="Ingresos"
                                    name="Ingresos"
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="Ingresos"
                                >
                                    Ingresos
                                </label>
                            </div>
                        </div>
                        <div className="col mx-3">
                            <div className="mb-3 form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="Egresos"
                                    name="Egresos"
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="Egresos"
                                >
                                    Egresos
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="rowss">
                        <div className="col">
                            <div className="mb-3">
                                <label
                                    htmlFor="fechaInicio"
                                    className="form-label"
                                >
                                    Fecha de Inicio
                                </label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="fechaInicio"
                                    name="fechaInicio"
                                    required
                                />
                            </div>
                        </div>
                        <div className="col">
                            <div className="mb-3">
                                <label
                                    htmlFor="fechaFin"
                                    className="form-label"
                                >
                                    Fecha Fin
                                </label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="fechaFin"
                                    name="fechaFin"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="thm-btn">
                        Imprimir
                    </button>
                </form>
            </div>
        </Modal>
    );
};
ModalImprimirReportes.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
};

export default ModalImprimirReportes;
