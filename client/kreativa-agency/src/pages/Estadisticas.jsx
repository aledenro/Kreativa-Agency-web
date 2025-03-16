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
    const [ingresos, setIngresos] = useState([]);
    const [totalEgresos, setTotalEgresos] = useState(0);
    const [totalIngresos, setTotalIngresos] = useState(0);
    const [cantidadIngresos, setCantidadIngresos] = useState(0);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

    useEffect(() => {
        const formattedMonth = selectedMonth < 10 ? `0${selectedMonth}` : selectedMonth;
        const fecha = `${selectedYear}-${formattedMonth}`;

        axios.get(`http://localhost:4000/api/egresos/mes?fecha=${fecha}`)
            .then(response => {
                const data = response.data.filter(e => e.activo);
                const categoriasData = CATEGORIAS.map(cat => {
                    const categoryValue = data.filter(e => e.categoria === cat).reduce((acc, curr) => acc + curr.monto, 0);
                    return { name: cat, value: categoryValue };
                }).filter(cat => cat.value > 0);

                setEgresos(categoriasData);
                setTotalEgresos(data.reduce((acc, curr) => acc + curr.monto, 0));
            })
            .catch(error => console.error("Error al obtener los egresos:", error));

        axios.get(`http://localhost:4000/api/ingresos/ingresosPorMes?mes=${formattedMonth}&año=${selectedYear}`)
            .then(response => {
                const data = response.data;
                const ingresosPorMes = data.map(item => ({
                    name: item._id,
                    ingresos: item.totalIngresos
                }));

                setIngresos(ingresosPorMes);
                setTotalIngresos(data.reduce((acc, curr) => acc + curr.totalIngresos, 0));
                setCantidadIngresos(data[0]?.cantidad || 0);
            })
            .catch(error => console.error("Error al obtener los ingresos:", error));
    }, [selectedYear, selectedMonth]);

    const years = [];
    for (let i = new Date().getFullYear(); i >= new Date().getFullYear() - 5; i--) {
        years.push(i);
    }

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
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center', paddingTop: '20px' }}>
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
                        <div className="chart-box">
                            <h3>Comparación Ingresos vs Egresos Mensual</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={[{ name: "Ingresos", value: totalIngresos }, { name: "Egresos", value: totalEgresos }]}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <ChartTooltip formatter={(value) => `₡${value.toLocaleString()}`} />
                                    <Bar dataKey="value" fill="#ff0072" />
                                    <Bar dataKey="value" fill="#8d25fc" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="chart-box">
                            <h3>Comparación Ingresos vs Egresos Anual</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={[{ name: "Ingresos", value: totalIngresos }, { name: "Egresos", value: totalEgresos }]}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <ChartTooltip formatter={(value) => `₡${value.toLocaleString()}`} />
                                    <Bar dataKey="value" fill="#ff7300" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="row">
                        <div className="chart-box">
                            <h3>Egresos por Mes</h3>
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
                        </div>

                        <div className="chart-box">
                            <h3>Ingresos por Mes</h3>
                            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                <h4>Total de Ingresos</h4>
                                <p>₡{totalIngresos.toLocaleString()}</p>
                                <h4>Cantidad de Ingresos</h4>
                                <p>{cantidadIngresos}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.main>
        </div>
    );
};

export default Estadisticas;
