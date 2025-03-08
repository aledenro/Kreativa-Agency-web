import React, { useState } from "react";
import "../AdminPanel.css";

const AdminPanel = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="admin-container">
            <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
                <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
                    ☰
                </button>
                <h2>Admin</h2>
                <ul>
                    <li><span>Dashboard</span></li>
                    <li><span>Usuarios</span></li>
                    <li><span>Configuración</span></li>
                </ul>
            </aside>
            <main className="content">
                <h1>Bienvenido al Panel de Administración</h1>
                <p>Este es un diseño inicial del AdminPanel con menú lateral.</p>
            </main>
        </div>
    );
};

export default AdminPanel;