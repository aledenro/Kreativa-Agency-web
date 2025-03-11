import React, { useState } from "react";
import { motion } from "framer-motion";
import { Home, Users, Settings, LogOut, Menu } from "lucide-react";
import { Avatar } from "@heroui/react"; // ✅ Usamos Avatar en lugar de User
import "../AdminPanel.css";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
    { name: "Enero", ventas: 4000 },
    { name: "Febrero", ventas: 3000 },
    { name: "Marzo", ventas: 5000 },
    { name: "Abril", ventas: 2000 },
];

const metricas = [
    { label: "Ventas", porcentaje: 75, color: "#FF0072" },
    { label: "Usuarios Nuevos", porcentaje: 50, color: "#FF0072" },
    { label: "Tickets Abiertos", porcentaje: 25, color: "#FF0072" },
];

const AdminPanel = () => {
    const [collapsed, setCollapsed] = useState(true);

    return (
        <div className="admin-container">
            {/* Sidebar con animación */}
            <motion.aside 
                className={`sidebar ${collapsed ? "collapsed" : ""}`}
                animate={{ width: collapsed ? "80px" : "250px" }} 
                transition={{ duration: 0.3, ease: "easeInOut" }}
                onMouseEnter={() => setCollapsed(false)} 
                onMouseLeave={() => setCollapsed(true)}
            >

                {/* ✅ Avatar del Administrador con HeroUI */}
                <div className="profile-container">
                    <Avatar
                        size="xl" // ✅ Tamaño grande
                        className="profile-avatar" // ✅ Aplicar estilos extra
                        src="https://i.pravatar.cc/150?u=a04258114e29026702d"
                    />
                    {!collapsed && (
                        <>
                            <span className="profile-name">Scarlett Peña</span>
                            <span className="profile-role">Administrador</span>
                        </>
                    )}
                </div>

                {/* Menú de navegación */}
                <ul>
                    {[{ icon: Home, label: "Dashboard" }, { icon: Users, label: "Usuarios" }, { icon: Settings, label: "Configuración" }, { icon: LogOut, label: "Salir" }].map((item, index) => (
                        <motion.li key={index} whileHover={{ scale: 1.1 }} className="menu-item">
                            <item.icon size={24} />
                            {!collapsed && (
                                <motion.span 
                                    animate={{ opacity: 1, display: "inline-block" }} 
                                    transition={{ duration: 0.2 }}
                                >
                                    {item.label}
                                </motion.span>
                            )}
                        </motion.li>
                    ))}
                </ul>
            </motion.aside>

            <motion.main 
                className="content"
                animate={{ marginLeft: collapsed ? "80px" : "250px" }}
                transition={{ duration: 0.3 }}
            >
                <div className="header">
                    <h1>Panel de Administración</h1>
                </div>

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