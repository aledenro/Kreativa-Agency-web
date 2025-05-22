import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Home,
    Users,
    Settings,
    LogOut,
    Search,
    Mail,
    IdCard,
    SquareKanban,
    FilePlus2,
    Menu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../AdminPanel.css";
// import logo from "https://kreativa-public.s3.us-east-2.amazonaws.com/landing/logo.png";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from "recharts";

const data = [
    { name: "Enero", ventas: 4000, ganancias: 2400 },
    { name: "Febrero", ventas: 3000, ganancias: 2210 },
    { name: "Marzo", ventas: 5000, ganancias: 2290 },
    { name: "Abril", ventas: 2000, ganancias: 2000 },
];

const metricas = [
    { label: "Casos Exitosos", cantidad: 280, color: "#6C63FF" },
    { label: "Leads", cantidad: 385, color: "#FF5757" },
    { label: "Solicitudes", cantidad: 540, color: "#4CAF50" },
    { label: "Nuevos Clientes", cantidad: 48, color: "#3F51B5" },
];

const AdminPanel = () => {
    const [collapsed, setCollapsed] = useState(true);
    const navigate = useNavigate();

    const handleOpenOutlook = () => {
        window.open(
            "https://login.live.com/login.srf?wa=wsignin1.0&rpsnv=174&ct=1743640803&rver=7.5.2211.0&wp=MBI_SSL&wreply=https%3a%2f%2foutlook.live.com%2fowa%2f",
            "_blank"
        );
    };

    return (
        <div className="admin-container">
            {/* Sidebar */}
            <motion.aside
                className={`sidebar ${collapsed ? "collapsed" : ""}`}
                animate={{ width: collapsed ? "80px" : "250px" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <ul>
                    {/* Menú */}
                    <motion.li
                        whileHover={{ scale: 1.1 }}
                        className="menu-item"
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        <Menu size={24} />
                        {!collapsed && (
                            <motion.span
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                Menú
                            </motion.span>
                        )}
                    </motion.li>

                    {/* Menú items */}
                    {[
                        { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
                        { icon: Home, label: "Inicio", path: "/" },
                        { icon: Users, label: "Usuarios", path: "/usuarios" },
                        { icon: SquareKanban, label: "Tareas", path: "/tareas" },
                        { icon: FilePlus2, label: "Cotizaciones", path: "/cotizacion" },
                        { icon: IdCard, label: "Empleados", path: "/jerarquia" },
                        { icon: Settings, label: "Configuración", path: "/configuracion" },
                        { icon: Mail, label: "Contactos", path: "/admin/contacto" },
                        { icon: LogOut, label: "Salir", path: "/logout" },
                    ].map((item, index) => (
                        <motion.li
                            key={index}
                            whileHover={{ scale: 1.1 }}
                            className="menu-item"
                            onClick={() => navigate(item.path)}
                        >
                            <item.icon size={24} />
                            {!collapsed && (
                                <motion.span
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {item.label}
                                </motion.span>
                            )}
                        </motion.li>
                    ))}
                </ul>
            </motion.aside>

            {/* Contenido principal */}
            <motion.main
                className="content"
                animate={{ marginLeft: collapsed ? "80px" : "250px" }}
                transition={{ duration: 0.3 }}
            >
                {/* Header */}
                <div className="header">
                    <div className="logo-header">
                        <img src="https://kreativa-public.s3.us-east-2.amazonaws.com/landing/logo.png" alt="Kreativa Agency" className="logo-img" />
                    </div>

                    {/* Buscador */}
                    <div className="search-container">
                        <div className="search-bar">
                            <Search size={18} className="search-icon" />
                            <input type="text" placeholder="Buscar..." />
                        </div>
                    </div>

                    {/* Íconos del header */}
                    <div className="header-icons">
                        <Mail
                            size={22}
                            className="header-icon"
                            onClick={() =>
                                window.open(
                                    "https://login.live.com/login.srf?wa=wsignin1.0&rpsnv=174&ct=1743640803&rver=7.5.2211.0&wp=MBI_SSL&wreply=https%3a%2f%2foutlook.live.com%2fowa%2f",
                                    "_blank"
                                )
                            }
                            style={{ cursor: "pointer" }}
                            title="Ir a Outlook"
                        />
                        <div className="header-avatar">
                            <img
                                src="https://i.pravatar.cc/150?u=a04258114e29026702d"
                                alt="Perfil"
                            />
                        </div>
                    </div>
                </div>

                {/* Métricas */}
                <div className="dashboard">
                    {metricas.map((metrica, index) => (
                        <motion.div
                            key={index}
                            className="metric-card"
                            style={{ borderTop: `4px solid ${metrica.color}` }}
                        >
                            <h3>{metrica.label}</h3>
                            <p>{metrica.cantidad}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Gráficos */}
                <div className="charts-container">
                    <div className="chart-box">
                        <h3>Ventas por Mes</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="ventas" fill="#6C63FF" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="chart-box">
                        <h3>Ganancias por Mes</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="ganancias"
                                    stroke="#4CAF50"
                                    strokeWidth={3}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </motion.main>
        </div>
    );
};

export default AdminPanel;