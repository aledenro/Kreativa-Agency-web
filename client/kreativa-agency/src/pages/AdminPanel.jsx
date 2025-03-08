import React, { useState } from "react";
import { motion } from "framer-motion";
import { Home, Users, Settings, Menu, LogOut } from "lucide-react";
import "../AdminPanel.css";
import logo from "../assets/img/logo.png";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
    { name: "Enero", ventas: 4000 },
    { name: "Febrero", ventas: 3000 },
    { name: "Marzo", ventas: 5000 },
    { name: "Abril", ventas: 2000 },
];

// 🔥 Datos para gráficos circulares
const metricas = [
    { label: "Ventas", porcentaje: 75, color: "#FF0072" },
    { label: "Usuarios Nuevos", porcentaje: 50, color: "#FF0072" },
    { label: "Tickets Abiertos", porcentaje: 25, color: "#FF0072" },
];

const AdminPanel = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="admin-container">
            {/* Sidebar con animación */}
            <motion.aside 
                className={`sidebar ${collapsed ? "collapsed" : ""}`}
                animate={{ width: collapsed ? "80px" : "250px" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                {/* Botón de colapso */}
                <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
                    <Menu size={24} />
                </button>

                {/* Logo animado */}
                <motion.div 
                    className="logo-container"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: -50 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.img 
                        src={logo} 
                        alt="Logo" 
                        className="logo"
                        animate={{ width: collapsed ? "50px" : "100px", opacity: collapsed ? 0.5 : 1 }}
                        transition={{ duration: 0.3 }}
                    />
                </motion.div>

                {/* Menú */}
                <ul>
                    <motion.li whileHover={{ scale: 1.1 }}>
                        <Home />
                        {!collapsed && <span>Dashboard</span>}
                    </motion.li>
                    <motion.li whileHover={{ scale: 1.1 }}>
                        <Users />
                        {!collapsed && <span>Usuarios</span>}
                    </motion.li>
                    <motion.li whileHover={{ scale: 1.1 }}>
                        <Settings />
                        {!collapsed && <span>Configuración</span>}
                    </motion.li>
                    <motion.li whileHover={{ scale: 1.1 }}>
                        <LogOut />
                        {!collapsed && <span>Salir</span>}
                    </motion.li>
                </ul>
            </motion.aside>

            {/* Contenido principal con ajuste de margen */}
            <motion.main 
                className="content"
                animate={{ marginLeft: collapsed ? "80px" : "250px" }}
                transition={{ duration: 0.3 }}
            >
                <div className="header">
                    <h1>Panel de Administración</h1>
                </div>

                {/* 🔥 Nueva Sección con Gráficos Circulares */}
                <div className="dashboard">
                    {metricas.map((metrica, index) => (
                        <motion.div key={index} className="metric-card">
                            <svg width="120" height="120" viewBox="0 0 120 120">
                                <circle className="circle-background" cx="60" cy="60" r="50" />
                                <motion.circle
                                    className="circle-foreground"
                                    cx="60"
                                    cy="60"
                                    r="50"
                                    stroke={metrica.color}
                                    strokeDasharray="314"
                                    strokeDashoffset="314"
                                    strokeWidth="10"
                                    fill="none"
                                    initial={{ strokeDashoffset: 314 }}
                                    animate={{ strokeDashoffset: (1 - metrica.porcentaje / 100) * 314 }}
                                    transition={{ duration: 2 }}
                                />
                                <text x="50%" y="50%" textAnchor="middle" dy=".3em" fill="#fff" fontSize="14">
                                    {metrica.porcentaje}%
                                </text>
                            </svg>
                            <h3>{metrica.label}</h3>
                        </motion.div>
                    ))}
                </div>

                {/* Gráfico de Barras */}
                <div className="chart-container">
                    <h3>Ventas por Mes</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="ventas" fill="#FF0072" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.main>
        </div>
    );
};

export default AdminPanel;