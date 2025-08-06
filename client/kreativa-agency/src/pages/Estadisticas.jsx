import { useState, useEffect } from "react";
import axios from "axios";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import { Form } from "react-bootstrap";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import "../AdminPanel.css";
import ModalImprimirReportes from "../components/Estadisticas/ModalImprimirReporte";
import Loading from "../components/ui/LoadingComponent";
import { useNavigate } from "react-router-dom";

// Colores de los gráficos
const COLORS = ["#ff0072", "#8d25fc", "#007bff", "#ffc02c"];

const CATEGORIAS = [
    "Salarios",
    "Software",
    "Servicios de contabilidad",
    "Servicios",
];

const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
];

const Estadisticas = () => {
    const [collapsed, setCollapsed] = useState(true);
    const [showModalReportes, setShowModalReportes] = useState(false);

    // Datos mensuales
    const [totalIngresos, setTotalIngresos] = useState(0);
    const [cantidadIngresos, setCantidadIngresos] = useState(0);
    const [resumenIngresos, setResumenIngresos] = useState({
        total: 0,
        cantidad: 0,
        detalle: [],
    });
    const [egresos, setEgresos] = useState([]);
    const [totalEgresos, setTotalEgresos] = useState(0);
    const [resumenEgresos, setResumenEgresos] = useState([]);

    // Datos anuales
    const [totalIngresosAnuales, setTotalIngresosAnuales] = useState(0);
    const [detalleIngresosAnuales, setDetalleIngresosAnuales] = useState([]);
    const [totalEgresosAnuales, setTotalEgresosAnuales] = useState(0);
    const [detalleEgresosAnuales, setDetalleEgresosAnuales] = useState([]);

    // Categorias

    const [categories, setCategories] = useState([]);

    // Seleccionar busqueda
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().getMonth() + 1
    );

    // Vista anual
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const isAnnualView =
        selectedMonth === 0 ||
        selectedYear > currentYear ||
        (selectedYear === currentYear && selectedMonth > currentMonth);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    // Carga de categorías
    useEffect(() => {
        const fetchCategories = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/error", {
                    state: {
                        errorCode: 401,
                        mensaje: "Debe iniciar sesión para continuar.",
                    },
                });
            }

            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/servicios/categorias`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setCategories(res.data);
            } catch (error) {
                if (error.status === 401) {
                    navigate("/error", {
                        state: {
                            errorCode: 401,
                            mensaje:
                                "Debe volver a iniciar sesión para continuar.",
                        },
                    });
                    return;
                }
                console.error(
                    "Error al obtener las categorías:",
                    error.message
                );
            }
        };
        fetchCategories();
    }, []);

    // Carga de datos según la vista
    useEffect(() => {
        const token = localStorage.getItem("token");
        const promises = [];

        if (!token) {
            navigate("/error", {
                state: {
                    errorCode: 401,
                    mensaje: "Debe iniciar sesión para continuar.",
                },
            });
        }

        if (isAnnualView) {
            // Vista Anual - agregar promesas
            promises.push(
                axios
                    .get(
                        `${import.meta.env.VITE_API_URL}/ingresos/anualesDetalle?anio=${selectedYear}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    )
                    .then((response) => {
                        const data = response.data;
                        setTotalIngresosAnuales(data.resumen.totalIngresos);
                        setDetalleIngresosAnuales(
                            data.detalle.map((item) => ({
                                fecha: item.fecha,
                                monto: item.monto,
                                categoria: item.categoria,
                            }))
                        );
                    })
                    .catch((error) => {
                        if (error.status === 401) {
                            navigate("/error", {
                                state: {
                                    errorCode: 401,
                                    mensaje:
                                        "Debe volver a iniciar sesión para continuar.",
                                },
                            });
                            return;
                        }
                        console.error("Error al obtener los ingresos anuales");
                        setTotalIngresosAnuales(0);
                        setDetalleIngresosAnuales([]);
                    })
            );

            promises.push(
                axios
                    .get(
                        `${import.meta.env.VITE_API_URL}/egresos/anualesDetalle?anio=${selectedYear}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    )
                    .then((response) => {
                        const data = response.data;
                        setTotalEgresosAnuales(data.resumen.totalEgresos);
                        setDetalleEgresosAnuales(data.detalle);
                    })
                    .catch((error) => {
                        if (error.status === 401) {
                            navigate("/error", {
                                state: {
                                    errorCode: 401,
                                    mensaje:
                                        "Debe volver a iniciar sesión para continuar.",
                                },
                            });
                            return;
                        }
                        console.error("Error al obtener los egresos anuales");
                        setTotalEgresosAnuales(0);
                        setDetalleEgresosAnuales([]);
                    })
            );
        } else {
            // Vista Mensual - agregar promesas
            const formattedMonth =
                selectedMonth < 10 ? `0${selectedMonth}` : selectedMonth;
            const fecha = `${selectedYear}-${formattedMonth}`;
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/error", {
                    state: {
                        errorCode: 401,
                        mensaje: "Debe iniciar sesión para continuar.",
                    },
                });
            }

            promises.push(
                axios
                    .get(
                        `${import.meta.env.VITE_API_URL}/ingresos/ingresosPorMes?mes=${formattedMonth}&anio=${selectedYear}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    )
                    .then((response) => {
                        if (!response.data.success) {
                            console.error(
                                "Error en la respuesta de ingresos mensuales"
                            );
                            throw new Error(response.data.message);
                        }

                        const { resumen, detalle, datosGrafico } =
                            response.data;

                        setTotalIngresos(resumen.totalIngresos);
                        setCantidadIngresos(resumen.cantidadIngresos);

                        setResumenIngresos({
                            total: resumen.totalIngresos,
                            cantidad: resumen.cantidadIngresos,
                            detalle: detalle,
                            datosGrafico: datosGrafico,
                        });
                    })
                    .catch((error) => {
                        if (error.status === 401) {
                            navigate("/error", {
                                state: {
                                    errorCode: 401,
                                    mensaje:
                                        "Debe volver a iniciar sesión para continuar.",
                                },
                            });
                            return;
                        }
                        console.error("Error al obtener ingresos mensuales");
                        setTotalIngresos(0);
                        setCantidadIngresos(0);
                        setResumenIngresos({
                            total: 0,
                            cantidad: 0,
                            detalle: [],
                            datosGrafico: [],
                        });
                    })
            );
            // Egresos mensuales activos y con estado aprobado
            axios
                .get(
                    `${import.meta.env.VITE_API_URL}/egresos/mes?fecha=${fecha}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                )
                .then((response) => {
                    const data = response.data.filter(
                        (e) => e.activo && e.estado === "Aprobado"
                    );
                    const categoriasData = CATEGORIAS.map((cat) => {
                        const categoryValue = data
                            .filter((e) => e.categoria === cat)
                            .reduce((acc, cur) => acc + cur.monto, 0);
                        return { name: cat, value: categoryValue };
                    }).filter((cat) => cat.value > 0);
                    setEgresos(categoriasData);
                    setTotalEgresos(
                        data.reduce((acc, cur) => acc + cur.monto, 0)
                    );
                    const resumen = data.map((e) => ({
                        fecha: e.fecha,
                        categoria: e.categoria,
                        proveedor: e.proveedor,
                        monto: e.monto,
                    }));
                    setResumenEgresos(resumen);
                })
                .catch((error) => {
                    console.error(
                        "Error al obtener los egresos mensuales:",
                        error
                    );
                });
        }

        promises.push(
            axios
                .get(
                    `${import.meta.env.VITE_API_URL}/ingresos/anio?anio=${selectedYear}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((response) => {
                    const data = response.data;
                    setTotalIngresosAnuales(data.totalIngresos);
                })
                .catch((error) => {
                    console.error(
                        "Error al obtener total ingresos anuales:",
                        error
                    );
                })
        );

        promises.push(
            axios
                .get(
                    `${import.meta.env.VITE_API_URL}/egresos/anio?anio=${selectedYear}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((response) => {
                    const data = response.data;
                    setTotalEgresosAnuales(data.totalEgresos);
                })
                .catch((error) => {
                    console.error(
                        "Error al obtener total egresos anuales:",
                        error
                    );
                })
        );

        // Ejecutar todas las promesas y manejar el loading
        Promise.allSettled(promises).finally(() => {
            setLoading(false);
        });
    }, [selectedYear, selectedMonth, isAnnualView]);

    const getCategoryName = (catId) => {
        const cat = categories.find(
            (c) => c._id && c._id.toString() === catId.toString()
        );
        return cat ? cat.nombre : catId;
    };

    // Arreglo de años para el selector
    const years = [];
    for (
        let i = new Date().getFullYear();
        i >= new Date().getFullYear() - 5;
        i--
    ) {
        years.push(i);
    }

    // Verificar si los datos están vacíos para los gráficos
    const noDatosEgresosMensuales = totalEgresos === 0 || egresos.length === 0;
    const noDatosIngresos =
        totalIngresos === 0 || resumenIngresos.detalle.length === 0;

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
                {/* Selector de Año y Mes */}
                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        marginBottom: "20px",
                        justifyContent: "center",
                        paddingTop: "40px",
                    }}
                >
                    <Form.Select
                        value={selectedYear}
                        onChange={(e) =>
                            setSelectedYear(Number(e.target.value))
                        }
                        style={{ width: "150px" }}
                    >
                        {years.map((year, index) => (
                            <option key={index} value={year}>
                                {year}
                            </option>
                        ))}
                    </Form.Select>
                    <Form.Select
                        value={selectedMonth}
                        onChange={(e) =>
                            setSelectedMonth(Number(e.target.value))
                        }
                        style={{ width: "150px" }}
                    >
                        <option value={0}>Año completo</option>
                        {monthNames.map((month, index) => (
                            <option key={index} value={index + 1}>
                                {month}
                            </option>
                        ))}
                    </Form.Select>
                    <button
                        className="btn thm-btn"
                        onClick={() => {
                            setShowModalReportes(true);
                        }}
                    >
                        Imprimir Reporte
                    </button>
                </div>

                {isAnnualView ? (
                    // Vista Anual
                    <>
                        {/* Gráfico de barras anual*/}
                        <div
                            className="chart-box"
                            style={{ marginBottom: "30px" }}
                        >
                            <h3 style={{ textAlign: "center" }}>
                                Ingresos y Egresos Anuales
                            </h3>
                            {totalIngresosAnuales || totalEgresosAnuales ? (
                                <div
                                    style={{
                                        width: "100%",
                                        height: "400px",
                                        maxWidth: "400px",
                                        margin: "0 auto",
                                    }}
                                >
                                    <ResponsiveContainer>
                                        <BarChart
                                            data={[
                                                {
                                                    name: "Ingresos",
                                                    ingresos:
                                                        totalIngresosAnuales,
                                                },
                                                {
                                                    name: "Egresos",
                                                    egresos:
                                                        totalEgresosAnuales,
                                                },
                                            ]}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip
                                                formatter={(value) =>
                                                    `₡${value.toLocaleString()}`
                                                }
                                            />
                                            <Bar
                                                dataKey="ingresos"
                                                fill="#ff0072"
                                            />
                                            <Bar
                                                dataKey="egresos"
                                                fill="#8d25fc"
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <p style={{ textAlign: "center" }}>
                                    No hay datos disponibles para este año.
                                </p>
                            )}
                        </div>

                        {/* Gráficos pastel y listados anuales */}
                        <div
                            className="row"
                            style={{
                                display: "flex",
                                gap: "20px",
                                justifyContent: "center",
                            }}
                        >
                            {/* Ingresos Anuales */}
                            <div
                                className="chart-box"
                                style={{
                                    flex: 1,
                                    minWidth: "350px",
                                    textAlign: "center",
                                }}
                            >
                                <h3>Ingresos Anuales</h3>
                                {totalIngresosAnuales > 0 ? (
                                    <div
                                        style={{
                                            width: "100%",
                                            height: "400px",
                                            maxWidth: "400px",
                                            margin: "0 auto",
                                        }}
                                    >
                                        <ResponsiveContainer>
                                            <PieChart>
                                                <Pie
                                                    data={detalleIngresosAnuales.reduce(
                                                        (acc, ingreso) => {
                                                            const nombreCategoria =
                                                                getCategoryName(
                                                                    ingreso.categoria
                                                                );
                                                            const existente =
                                                                acc.find(
                                                                    (item) =>
                                                                        item.name ===
                                                                        nombreCategoria
                                                                );
                                                            if (existente) {
                                                                existente.value +=
                                                                    ingreso.monto;
                                                            } else {
                                                                acc.push({
                                                                    name: nombreCategoria,
                                                                    value: ingreso.monto,
                                                                });
                                                            }
                                                            return acc;
                                                        },
                                                        []
                                                    )}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={80}
                                                    outerRadius={150}
                                                    dataKey="value"
                                                    label={({ percent }) =>
                                                        `${(percent * 100).toFixed(1)}%`
                                                    }
                                                >
                                                    {detalleIngresosAnuales
                                                        .reduce(
                                                            (acc, ingreso) => {
                                                                const nombreCategoria =
                                                                    getCategoryName(
                                                                        ingreso.categoria
                                                                    );
                                                                if (
                                                                    !acc.find(
                                                                        (
                                                                            item
                                                                        ) =>
                                                                            item.name ===
                                                                            nombreCategoria
                                                                    )
                                                                ) {
                                                                    acc.push({
                                                                        name: nombreCategoria,
                                                                        value: ingreso.monto,
                                                                    });
                                                                }
                                                                return acc;
                                                            },
                                                            []
                                                        )
                                                        .map((entry, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={
                                                                    COLORS[
                                                                        index %
                                                                            COLORS.length
                                                                    ]
                                                                }
                                                            />
                                                        ))}
                                                </Pie>
                                                <text
                                                    x="50%"
                                                    y="50%"
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                    fontSize={20}
                                                    fontWeight="bold"
                                                >
                                                    ₡
                                                    {totalIngresosAnuales.toLocaleString()}
                                                </text>
                                                <Tooltip
                                                    formatter={(value) =>
                                                        `₡${value.toLocaleString()}`
                                                    }
                                                />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <p style={{ textAlign: "center" }}>
                                        No hay datos para Ingresos Anuales.
                                    </p>
                                )}
                                <h3 style={{ marginTop: "20px" }}>
                                    Listado de Ingresos Anuales
                                </h3>
                                {detalleIngresosAnuales.length > 0 ? (
                                    <table
                                        style={{
                                            width: "100%",
                                            borderCollapse: "collapse",
                                            marginTop: "10px",
                                        }}
                                    >
                                        <thead>
                                            <tr>
                                                <th
                                                    style={{
                                                        border: "1px solid #ddd",
                                                        padding: "8px",
                                                    }}
                                                >
                                                    Fecha
                                                </th>
                                                <th
                                                    style={{
                                                        border: "1px solid #ddd",
                                                        padding: "8px",
                                                    }}
                                                >
                                                    Cliente
                                                </th>
                                                <th
                                                    style={{
                                                        border: "1px solid #ddd",
                                                        padding: "8px",
                                                    }}
                                                >
                                                    Categoría
                                                </th>
                                                <th
                                                    style={{
                                                        border: "1px solid #ddd",
                                                        padding: "8px",
                                                    }}
                                                >
                                                    Monto
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {detalleIngresosAnuales.map(
                                                (ingreso, index) => (
                                                    <tr key={index}>
                                                        <td
                                                            style={{
                                                                border: "1px solid #ddd",
                                                                padding: "8px",
                                                            }}
                                                        >
                                                            {new Date(
                                                                ingreso.fecha
                                                            ).toLocaleDateString()}
                                                        </td>
                                                        <td
                                                            style={{
                                                                border: "1px solid #ddd",
                                                                padding: "8px",
                                                            }}
                                                        >
                                                            {
                                                                ingreso.nombre_cliente
                                                            }
                                                        </td>
                                                        <td
                                                            style={{
                                                                border: "1px solid #ddd",
                                                                padding: "8px",
                                                            }}
                                                        >
                                                            {getCategoryName(
                                                                ingreso.categoria
                                                            )}
                                                        </td>
                                                        <td
                                                            style={{
                                                                border: "1px solid #ddd",
                                                                padding: "8px",
                                                            }}
                                                        >
                                                            ₡
                                                            {ingreso.monto.toLocaleString()}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p style={{ textAlign: "center" }}>
                                        No hay ingresos anuales para mostrar.
                                    </p>
                                )}
                            </div>

                            {/* Egresos Anuales */}
                            <div
                                className="chart-box"
                                style={{ flex: 1, minWidth: "350px" }}
                            >
                                <h3 style={{ textAlign: "center" }}>
                                    Egresos Anuales
                                </h3>
                                {totalEgresosAnuales > 0 ? (
                                    <div
                                        style={{
                                            width: "100%",
                                            height: "400px",
                                            maxWidth: "400px",
                                            margin: "0 auto",
                                        }}
                                    >
                                        <ResponsiveContainer>
                                            <PieChart>
                                                <Pie
                                                    data={detalleEgresosAnuales.reduce(
                                                        (acc, egreso) => {
                                                            const categoria =
                                                                egreso.categoria;
                                                            const existente =
                                                                acc.find(
                                                                    (item) =>
                                                                        item.name ===
                                                                        categoria
                                                                );
                                                            if (existente) {
                                                                existente.value +=
                                                                    egreso.monto;
                                                            } else {
                                                                acc.push({
                                                                    name: categoria,
                                                                    value: egreso.monto,
                                                                });
                                                            }
                                                            return acc;
                                                        },
                                                        []
                                                    )}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={80}
                                                    outerRadius={150}
                                                    dataKey="value"
                                                    label={({ percent }) =>
                                                        `${(percent * 100).toFixed(1)}%`
                                                    }
                                                >
                                                    {detalleEgresosAnuales
                                                        .reduce(
                                                            (acc, egreso) => {
                                                                if (
                                                                    !acc.find(
                                                                        (
                                                                            item
                                                                        ) =>
                                                                            item.name ===
                                                                            egreso.categoria
                                                                    )
                                                                ) {
                                                                    acc.push({
                                                                        name: egreso.categoria,
                                                                        value: egreso.monto,
                                                                    });
                                                                }
                                                                return acc;
                                                            },
                                                            []
                                                        )
                                                        .map((entry, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={
                                                                    COLORS[
                                                                        index %
                                                                            COLORS.length
                                                                    ]
                                                                }
                                                            />
                                                        ))}
                                                </Pie>
                                                <text
                                                    x="50%"
                                                    y="50%"
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                    fontSize={20}
                                                    fontWeight="bold"
                                                >
                                                    ₡
                                                    {totalEgresosAnuales.toLocaleString()}
                                                </text>
                                                <Tooltip
                                                    formatter={(value) =>
                                                        `₡${value.toLocaleString()}`
                                                    }
                                                />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <p style={{ textAlign: "center" }}>
                                        No hay datos para Egresos Anuales.
                                    </p>
                                )}
                                <h3
                                    style={{
                                        textAlign: "center",
                                        marginTop: "20px",
                                    }}
                                >
                                    Listado de Egresos Anuales
                                </h3>
                                {detalleEgresosAnuales.length > 0 ? (
                                    <table
                                        style={{
                                            width: "100%",
                                            borderCollapse: "collapse",
                                            marginTop: "10px",
                                        }}
                                    >
                                        <thead>
                                            <tr>
                                                <th
                                                    style={{
                                                        border: "1px solid #ddd",
                                                        padding: "8px",
                                                    }}
                                                >
                                                    Fecha
                                                </th>
                                                <th
                                                    style={{
                                                        border: "1px solid #ddd",
                                                        padding: "8px",
                                                    }}
                                                >
                                                    Categoría
                                                </th>
                                                <th
                                                    style={{
                                                        border: "1px solid #ddd",
                                                        padding: "8px",
                                                    }}
                                                >
                                                    Proveedor
                                                </th>
                                                <th
                                                    style={{
                                                        border: "1px solid #ddd",
                                                        padding: "8px",
                                                    }}
                                                >
                                                    Monto
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {detalleEgresosAnuales.map(
                                                (egreso, index) => (
                                                    <tr key={index}>
                                                        <td
                                                            style={{
                                                                border: "1px solid #ddd",
                                                                padding: "8px",
                                                            }}
                                                        >
                                                            {new Date(
                                                                egreso.fecha
                                                            ).toLocaleDateString()}
                                                        </td>
                                                        <td
                                                            style={{
                                                                border: "1px solid #ddd",
                                                                padding: "8px",
                                                            }}
                                                        >
                                                            {egreso.categoria}
                                                        </td>
                                                        <td
                                                            style={{
                                                                border: "1px solid #ddd",
                                                                padding: "8px",
                                                            }}
                                                        >
                                                            {egreso.proveedor}
                                                        </td>
                                                        <td
                                                            style={{
                                                                border: "1px solid #ddd",
                                                                padding: "8px",
                                                            }}
                                                        >
                                                            ₡
                                                            {egreso.monto.toLocaleString()}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p style={{ textAlign: "center" }}>
                                        No hay egresos anuales para mostrar.
                                    </p>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    // Vista Mensual
                    <>
                        <div
                            className="row"
                            style={{ display: "flex", gap: "20px" }}
                        >
                            <div className="chart-box" style={{ flex: 1 }}>
                                <h3 style={{ textAlign: "center" }}>
                                    Ingresos y Egresos Mensuales
                                </h3>
                                {totalIngresos === 0 && totalEgresos === 0 ? (
                                    <p style={{ textAlign: "center" }}>
                                        No hay datos disponibles para este mes.
                                    </p>
                                ) : (
                                    <div
                                        style={{
                                            width: "100%",
                                            height: "300px",
                                            margin: "0 auto",
                                        }}
                                    >
                                        <ResponsiveContainer>
                                            <BarChart
                                                data={[
                                                    {
                                                        name: "Ingresos",
                                                        ingresos: totalIngresos,
                                                    },
                                                    {
                                                        name: "Egresos",
                                                        egresos: totalEgresos,
                                                    },
                                                ]}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip
                                                    formatter={(value) =>
                                                        `₡${value.toLocaleString()}`
                                                    }
                                                />
                                                <Bar
                                                    dataKey="ingresos"
                                                    fill="#ff0072"
                                                />
                                                <Bar
                                                    dataKey="egresos"
                                                    fill="#8d25fc"
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </div>

                            {/* Gráfico Anual siempre visible */}
                            <div className="chart-box" style={{ flex: 1 }}>
                                <h3 style={{ textAlign: "center" }}>
                                    Ingresos y Egresos Anuales
                                </h3>
                                <div
                                    style={{
                                        width: "100%",
                                        height: "300px",
                                        margin: "0 auto",
                                    }}
                                >
                                    <ResponsiveContainer>
                                        <BarChart
                                            data={[
                                                {
                                                    name: "Ingresos",
                                                    ingresos:
                                                        totalIngresosAnuales ||
                                                        0,
                                                },
                                                {
                                                    name: "Egresos",
                                                    egresos:
                                                        totalEgresosAnuales ||
                                                        0,
                                                },
                                            ]}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip
                                                formatter={(value) =>
                                                    `₡${value.toLocaleString()}`
                                                }
                                            />
                                            <Bar
                                                dataKey="ingresos"
                                                fill="#ff0072"
                                            />
                                            <Bar
                                                dataKey="egresos"
                                                fill="#8d25fc"
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        <div
                            className="row"
                            style={{
                                display: "flex",
                                gap: "20px",
                                marginTop: "30px",
                            }}
                        >
                            <div className="chart-box" style={{ flex: 1 }}>
                                <h3 style={{ textAlign: "center" }}>
                                    Ingresos del Mes
                                </h3>
                                {noDatosIngresos ? (
                                    <p style={{ textAlign: "center" }}>
                                        No hay datos disponibles para este mes.
                                    </p>
                                ) : (
                                    <>
                                        <div
                                            style={{
                                                width: "100%",
                                                height: "400px",
                                                maxWidth: "400px",
                                                margin: "0 auto",
                                            }}
                                        >
                                            <ResponsiveContainer>
                                                <PieChart>
                                                    <Pie
                                                        data={
                                                            resumenIngresos.datosGrafico
                                                        }
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={80}
                                                        outerRadius={150}
                                                        dataKey="value"
                                                        label={({ percent }) =>
                                                            `${(percent * 100).toFixed(1)}%`
                                                        }
                                                    >
                                                        {resumenIngresos.datosGrafico.map(
                                                            (entry, index) => (
                                                                <Cell
                                                                    key={`cell-${index}`}
                                                                    fill={
                                                                        COLORS[
                                                                            index %
                                                                                COLORS.length
                                                                        ]
                                                                    }
                                                                />
                                                            )
                                                        )}
                                                    </Pie>
                                                    <text
                                                        x="50%"
                                                        y="50%"
                                                        textAnchor="middle"
                                                        dominantBaseline="middle"
                                                        fontSize={20}
                                                        fontWeight="bold"
                                                    >
                                                        ₡
                                                        {resumenIngresos.total.toLocaleString()}
                                                    </text>
                                                    <Tooltip
                                                        formatter={(value) =>
                                                            `₡${value.toLocaleString()}`
                                                        }
                                                    />
                                                    <Legend />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <h3
                                            style={{
                                                textAlign: "center",
                                                marginTop: "20px",
                                            }}
                                        >
                                            Resumen de Ingresos del Mes
                                        </h3>
                                        <table
                                            style={{
                                                width: "100%",
                                                borderCollapse: "collapse",
                                                marginTop: "10px",
                                            }}
                                        >
                                            <thead>
                                                <tr>
                                                    <th
                                                        style={{
                                                            border: "1px solid #ddd",
                                                            padding: "8px",
                                                        }}
                                                    >
                                                        Fecha
                                                    </th>
                                                    <th
                                                        style={{
                                                            border: "1px solid #ddd",
                                                            padding: "8px",
                                                        }}
                                                    >
                                                        Cliente
                                                    </th>
                                                    <th
                                                        style={{
                                                            border: "1px solid #ddd",
                                                            padding: "8px",
                                                        }}
                                                    >
                                                        Categoría
                                                    </th>
                                                    <th
                                                        style={{
                                                            border: "1px solid #ddd",
                                                            padding: "8px",
                                                        }}
                                                    >
                                                        Monto
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {resumenIngresos.detalle.map(
                                                    (ingreso, index) => (
                                                        <tr key={index}>
                                                            <td
                                                                style={{
                                                                    border: "1px solid #ddd",
                                                                    padding:
                                                                        "8px",
                                                                }}
                                                            >
                                                                {new Date(
                                                                    ingreso.fecha
                                                                ).toLocaleDateString()}
                                                            </td>
                                                            <td
                                                                style={{
                                                                    border: "1px solid #ddd",
                                                                    padding:
                                                                        "8px",
                                                                }}
                                                            >
                                                                {
                                                                    ingreso.nombre_cliente
                                                                }
                                                            </td>
                                                            <td
                                                                style={{
                                                                    border: "1px solid #ddd",
                                                                    padding:
                                                                        "8px",
                                                                }}
                                                            >
                                                                {getCategoryName(
                                                                    ingreso.categoria
                                                                )}
                                                            </td>
                                                            <td
                                                                style={{
                                                                    border: "1px solid #ddd",
                                                                    padding:
                                                                        "8px",
                                                                }}
                                                            >
                                                                ₡
                                                                {ingreso.monto.toLocaleString()}
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </>
                                )}
                            </div>
                            <div className="chart-box" style={{ flex: 1 }}>
                                <h3 style={{ textAlign: "center" }}>
                                    Egresos por Mes
                                </h3>
                                {!noDatosEgresosMensuales ? (
                                    <div
                                        style={{
                                            width: "100%",
                                            height: "400px",
                                            maxWidth: "400px",
                                            margin: "0 auto",
                                        }}
                                    >
                                        <ResponsiveContainer>
                                            <PieChart>
                                                <Pie
                                                    data={egresos}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={80}
                                                    outerRadius={150}
                                                    dataKey="value"
                                                    label={({ percent }) =>
                                                        `${(percent * 100).toFixed(1)}%`
                                                    }
                                                >
                                                    {egresos.map(
                                                        (entry, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={
                                                                    COLORS[
                                                                        index %
                                                                            COLORS.length
                                                                    ]
                                                                }
                                                            />
                                                        )
                                                    )}
                                                </Pie>
                                                <text
                                                    x="50%"
                                                    y="50%"
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                    fontSize={20}
                                                    fontWeight="bold"
                                                >
                                                    ₡
                                                    {totalEgresos.toLocaleString()}
                                                </text>
                                                <Tooltip
                                                    formatter={(value) =>
                                                        `₡${value.toLocaleString()}`
                                                    }
                                                />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <p style={{ textAlign: "center" }}>
                                        No hay datos disponibles para este mes.
                                    </p>
                                )}
                                <h3
                                    style={{
                                        textAlign: "center",
                                        marginTop: "20px",
                                    }}
                                >
                                    Resumen de Egresos del Mes
                                </h3>
                                {!noDatosEgresosMensuales ? (
                                    <div>
                                        <div
                                            style={{
                                                textAlign: "center",
                                                marginBottom: "20px",
                                            }}
                                        >
                                            <h4>Total de Egresos</h4>
                                            <p>
                                                ₡{totalEgresos.toLocaleString()}
                                            </p>
                                        </div>
                                        <table
                                            style={{
                                                width: "100%",
                                                borderCollapse: "collapse",
                                                marginTop: "20px",
                                            }}
                                        >
                                            <thead>
                                                <tr>
                                                    <th
                                                        style={{
                                                            border: "1px solid #ddd",
                                                            padding: "8px",
                                                        }}
                                                    >
                                                        Fecha
                                                    </th>
                                                    <th
                                                        style={{
                                                            border: "1px solid #ddd",
                                                            padding: "8px",
                                                        }}
                                                    >
                                                        Categoría
                                                    </th>
                                                    <th
                                                        style={{
                                                            border: "1px solid #ddd",
                                                            padding: "8px",
                                                        }}
                                                    >
                                                        Proveedor
                                                    </th>
                                                    <th
                                                        style={{
                                                            border: "1px solid #ddd",
                                                            padding: "8px",
                                                        }}
                                                    >
                                                        Monto
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {resumenEgresos.map(
                                                    (e, index) => (
                                                        <tr key={index}>
                                                            <td
                                                                style={{
                                                                    border: "1px solid #ddd",
                                                                    padding:
                                                                        "8px",
                                                                }}
                                                            >
                                                                {new Date(
                                                                    e.fecha
                                                                ).toLocaleDateString()}
                                                            </td>
                                                            <td
                                                                style={{
                                                                    border: "1px solid #ddd",
                                                                    padding:
                                                                        "8px",
                                                                }}
                                                            >
                                                                {e.categoria}
                                                            </td>
                                                            <td
                                                                style={{
                                                                    border: "1px solid #ddd",
                                                                    padding:
                                                                        "8px",
                                                                }}
                                                            >
                                                                {e.proveedor}
                                                            </td>
                                                            <td
                                                                style={{
                                                                    border: "1px solid #ddd",
                                                                    padding:
                                                                        "8px",
                                                                }}
                                                            >
                                                                ₡
                                                                {e.monto.toLocaleString()}
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p style={{ textAlign: "center" }}>
                                        No hay datos disponibles para este mes.
                                    </p>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
            {showModalReportes && (
                <ModalImprimirReportes
                    show={showModalReportes}
                    handleClose={() => setShowModalReportes(false)}
                ></ModalImprimirReportes>
            )}
        </AdminLayout>
    );
};

export default Estadisticas;
