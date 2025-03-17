import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer } from "recharts";
import "../AdminPanel.css";
import logo from "../assets/img/logo.png";
import { Form } from "react-bootstrap";

const COLORS = ["#ff0072", "#8d25fc", "#007bff", "#ffc02c"];
const CATEGORIAS = ["Salarios", "Software", "Servicios de contabilidad", "Servicios"];

const Estadisticas = () => {
    const [collapsed, setCollapsed] = useState(true);
    const [egresos, setEgresos] = useState([]);
    const [totalEgresos, setTotalEgresos] = useState(0);
    const [totalIngresos, setTotalIngresos] = useState(0);
    const [cantidadIngresos, setCantidadIngresos] = useState(0);
    const [totalEgresosAnuales, setTotalEgresosAnuales] = useState(0);
    const [totalIngresosAnuales, setTotalIngresosAnuales] = useState(0);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [resumenEgresos, setResumenEgresos] = useState([]); // Resumen de egresos
    const [resumenIngresos, setResumenIngresos] = useState({ total: 0, cantidad: 0, detalle: [] }); // Resumen de ingresos

    useEffect(() => {
        const formattedMonth = selectedMonth < 10 ? `0${selectedMonth}` : selectedMonth;
        const fecha = `${selectedYear}-${formattedMonth}`;

        // Obtener los egresos mensuales
        axios.get(`http://localhost:4000/api/egresos/mes?fecha=${fecha}`)
            .then(response => {
                const data = response.data.filter(e => e.activo);
                const categoriasData = CATEGORIAS.map(cat => {
                    const categoryValue = data.filter(e => e.categoria === cat).reduce((acc, curr) => acc + curr.monto, 0);
                    return { name: cat, value: categoryValue };
                }).filter(cat => cat.value > 0);

                setEgresos(categoriasData);
                setTotalEgresos(data.reduce((acc, curr) => acc + curr.monto, 0));

                // Filtrar los datos para el resumen de egresos
                const resumen = data.map(e => ({
                    fecha: e.fecha,
                    categoria: e.categoria,
                    proveedor: e.proveedor,
                    monto: e.monto
                }));
                setResumenEgresos(resumen);
            })
            .catch(error => console.error("Error al obtener los egresos:", error));

        // Obtener los ingresos mensuales
        axios.get(`http://localhost:4000/api/ingresos/ingresosPorMes?mes=${formattedMonth}&año=${selectedYear}`)
            .then(response => {
                const { resumen, detalle } = response.data;
                setTotalIngresos(resumen.totalIngresos);
                setCantidadIngresos(resumen.cantidadIngresos);
                setResumenIngresos({
                    total: resumen.totalIngresos,
                    cantidad: resumen.cantidadIngresos,
                    detalle: detalle
                });
            })
            .catch(error => {
                console.error("Error al obtener los ingresos:", error);
                // Asegúrate de resetear los valores si hay un error
                setTotalIngresos(0);
                setCantidadIngresos(0);
                setResumenIngresos({
                    total: 0,
                    cantidad: 0,
                    detalle: []
                });
            });

        // Obtener los ingresos anuales
        axios.get(`http://localhost:4000/api/ingresos/anio?anio=${selectedYear}`)
            .then(response => {
                const data = response.data;
                setTotalIngresosAnuales(data.totalIngresos);
            })
            .catch(error => console.error("Error al obtener los ingresos anuales:", error));

        // Obtener los egresos anuales
        axios.get(`http://localhost:4000/api/egresos/anio?anio=${selectedYear}`)
            .then(response => {
                const data = response.data;
                setTotalEgresosAnuales(data.totalEgresos);
            })
            .catch(error => console.error("Error al obtener los egresos anuales:", error));
    }, [selectedYear, selectedMonth]);

    const years = [];
    for (let i = new Date().getFullYear(); i >= new Date().getFullYear() - 5; i--) {
        years.push(i);
    }

    // Verificar si los datos están vacíos para los gráficos
    const noDatosEgresos = totalEgresos === 0 || egresos.length === 0;
    const noDatosIngresos = totalIngresos === 0 || resumenIngresos.detalle.length === 0;

    return (
        <div className="admin-container">
            <motion.aside className={`sidebar ${collapsed ? "collapsed" : ""}`}
                animate={{ width: collapsed ? "80px" : "250px" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                onMouseEnter={() => setCollapsed(false)}
                onMouseLeave={() => setCollapsed(true)}
            >
                <ul></ul>
            </motion.aside>

            <motion.main className="content"
                animate={{ marginLeft: collapsed ? "80px" : "250px" }}
                transition={{ duration: 0.3 }}
            >
                <div className="header">
                    <div className="logo-header">
                        <img src={logo} alt="Kreativa Agency" className="logo-img" />
                    </div>
                </div>

                <div className="charts-container">
                    <div className="row">
                        {/* Selector de Año y Mes */}
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center', paddingTop: '40px' }}>
                            <Form.Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} style={{ width: '150px' }}>
                                {years.map((year, index) => (
                                    <option key={index} value={year}>{year}</option>
                                ))}
                            </Form.Select>

                            <Form.Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} style={{ width: '150px' }}>
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i} value={i + 1}>{i + 1}</option>
                                ))}
                            </Form.Select>
                        </div>

                        {/* Gráfico de Ingresos vs Egresos Mensual */}
                        <div className="chart-box">
                            <h3 style={{ textAlign: 'center' }}>Ingresos y Egresos Mensuales</h3>
                            {!noDatosEgresos ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={[{ name: "Ingresos", ingresos: totalIngresos }, { name: "Egresos", egresos: totalEgresos }]}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <ChartTooltip formatter={(value) => `₡${value.toLocaleString()}`} />
                                        <Bar dataKey="ingresos" fill="#ff0072" />
                                        <Bar dataKey="egresos" fill="#8d25fc" />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <p>No hay datos disponibles para este mes.</p>
                            )}
                        </div>

                        {/* Gráfico Ingresos vs Egresos Anual */}
                        <div className="chart-box">
                            <h3 style={{ textAlign: 'center' }}>Ingresos y Egresos Anuales</h3>
                            {!noDatosEgresos ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={[{ name: "Ingresos", ingresos: totalIngresosAnuales }, { name: "Egresos", egresos: totalEgresosAnuales }]}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => `₡${value.toLocaleString()}`} />
                                        <Bar dataKey="ingresos" fill="#ff0072" />
                                        <Bar dataKey="egresos" fill="#8d25fc" />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <p>No hay datos disponibles para este año.</p>
                            )}
                        </div>
                    </div>

                    <div className="row">
                        {/* Resumen de Ingresos del Mes */}
                        <div className="chart-box">
                            <h3 style={{ textAlign: 'center' }}>Ingresos del Mes</h3>
                            {noDatosIngresos ? ( // Mostrar mensaje si no hay datos
                                <p>No hay datos disponibles para este mes.</p>
                            ) : (
                                <>
                                    <PieChart width={400} height={400}>
                                        <Pie
                                            data={resumenIngresos.detalle.reduce((acc, ingreso) => {
                                                const clienteExistente = acc.find(item => item.name === ingreso.nombre_cliente);
                                                if (clienteExistente) {
                                                    clienteExistente.value += ingreso.monto;
                                                } else {
                                                    acc.push({ name: ingreso.nombre_cliente, value: ingreso.monto });
                                                }
                                                return acc;
                                            }, [])}
                                            cx={200}
                                            cy={200}
                                            innerRadius={80}
                                            outerRadius={150}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                                        >
                                            {resumenIngresos.detalle.reduce((acc, ingreso) => {
                                                const clienteExistente = acc.find(item => item.name === ingreso.nombre_cliente);
                                                if (!clienteExistente) {
                                                    acc.push({ name: ingreso.nombre_cliente, value: ingreso.monto });
                                                }
                                                return acc;
                                            }, []).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <text x={200} y={200} textAnchor="middle" dominantBaseline="middle" fontSize={20} fontWeight="bold">
                                            ₡{resumenIngresos.total.toLocaleString()}
                                        </text>
                                        <Tooltip formatter={(value) => `₡${value.toLocaleString()}`} />
                                        <Legend />
                                    </PieChart>

                                    <h3 style={{ textAlign: 'center' }}>Resumen de Ingresos del Mes</h3>

                                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                                        <thead>
                                            <tr>
                                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Fecha</th>
                                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Nombre del Cliente</th>
                                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Servicio</th>
                                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Monto</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {resumenIngresos.detalle.map((ingreso, index) => (
                                                <tr key={index}>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(ingreso.fecha).toLocaleDateString()}</td>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{ingreso.nombre_cliente}</td>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{ingreso.servicio}</td>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>₡{ingreso.monto.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </>
                            )}
                        </div>

                        {/* Gráfico de Egresos Mensuales (PieChart) */}
                        <div className="chart-box">
                            <h3 style={{ textAlign: 'center' }}>Egresos por Mes</h3>
                            {!noDatosEgresos ? (
                                <PieChart width={400} height={400}>
                                    <Pie
                                        data={egresos}
                                        cx={200}
                                        cy={200}
                                        innerRadius={80}
                                        outerRadius={150}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ name, percent }) => `${(percent * 100).toFixed(1)}%`}
                                    >
                                        {egresos.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <text x={200} y={200} textAnchor="middle" dominantBaseline="middle" fontSize={20} fontWeight="bold">
                                        ₡{totalEgresos.toLocaleString()}
                                    </text>
                                    <Tooltip formatter={(value) => `₡${value.toLocaleString()}`} />
                                    <Legend />
                                </PieChart>
                            ) : (
                                <p>No hay datos disponibles para este mes.</p>
                            )}

                            <h3 style={{ textAlign: 'center' }}>Resumen de Egresos del Mes</h3>
                            {!noDatosEgresos ? (
                                <div>
                                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                        <h4>Total de Egresos</h4>
                                        <p>₡{totalEgresos.toLocaleString()}</p>
                                    </div>

                                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                                        <thead>
                                            <tr>
                                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Fecha</th>
                                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Categoría</th>
                                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Proveedor</th>
                                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Monto</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {resumenEgresos.map((e, index) => (
                                                <tr key={index}>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(e.fecha).toLocaleDateString()}</td>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{e.categoria}</td>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{e.proveedor}</td>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>₡{e.monto.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p>No hay datos disponibles para este mes.</p>
                            )}

                        </div>
                    </div>
                </div>
            </motion.main>
        </div>
    );
};

export default Estadisticas;