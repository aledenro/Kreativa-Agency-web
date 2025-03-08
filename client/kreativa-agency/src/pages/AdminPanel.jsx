import React, { useState } from "react";
import { motion } from "framer-motion";
import { Home, Users, Settings, Menu, LogOut } from "lucide-react";
import "../AdminPanel.css";
import logo from "../assets/img/logo.png"; // Importamos el logo

const AdminPanel = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="admin-container">
            {/* Sidebar con animación mejorada */}
            <motion.aside 
                className={`sidebar ${collapsed ? "collapsed" : ""}`}
                animate={{ width: collapsed ? "80px" : "250px" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
                    <Menu size={24} />
                </button>

                {/* Logo con animación mejorada */}
                <motion.div 
                    className="logo-container"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: -70 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.img 
                        src={logo} 
                        alt="Logo" 
                        className="logo"
                        animate={{ width: collapsed ? "60px" : "120px", opacity: collapsed ? 0.7 : 1 }}
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

            {/* Contenido */}
            <main className="content">
                <div className="header">
                    <h1>Panel de Administración</h1>
                </div>
                <div className="dashboard-content">
                    <p>🚀 Aquí irán las métricas, gráficos y datos importantes.</p>
                </div>
            </main>
        </div>
    );
};

export default AdminPanel;