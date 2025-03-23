import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Home,
    Users,
    Settings,
    LogOut,
    Bell,
    MessageCircle,
    Search,
    Mail,
    IdCard,
    SquareKanban,
    FilePlus2,
    Menu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "/src/assets/img/logo.png";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/estadisticas" },
    { icon: Home, label: "Inicio", path: "/" },
    { icon: Users, label: "Usuarios", path: "/usuarios" },
    { icon: SquareKanban, label: "Tareas", path: "/tareas" },
    { icon: FilePlus2, label: "Cotizaciones", path: "/cotizacion" },
    { icon: IdCard, label: "Empleados", path: "/jerarquia" },
    { icon: Settings, label: "Configuración", path: "/configuracion" },
    { icon: Mail, label: "Contactos", path: "/admin/contacto" },
    { icon: LogOut, label: "Salir", path: "/logout" },
];

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.06,
      duration: 0.4,
      ease: [0.65, 0, 0.35, 1],
    },
  }),
  exit: (i) => ({
    opacity: 0,
    x: -20,
    transition: {
      delay: i * 0.03,
      duration: 0.3,
      ease: [0.65, 0, 0.35, 1],
    },
  }),
};

const AdminLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(true);
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        if (collapsed) {
            setCollapsed(false);
            setTimeout(() => setSidebarExpanded(true), 600);
        } else {
            setSidebarExpanded(false);
            setCollapsed(true);
        }
    };

    return (
        <div className="admin-container">
            {/* Sidebar */}
            <motion.aside
                className={`sidebar ${collapsed ? "collapsed" : ""}`}
                animate={{ width: collapsed ? "80px" : "250px" }}
                transition={{ duration: 0.5, ease: [0.68, -0.55, 0.27, 1.55] }} // ease más profesional
            >
                <ul>
                    {/* Botón Menú */}
                    <AnimatePresence>
                        <motion.li
                            className="menu-item"
                            onClick={toggleSidebar}
                            custom={-1}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={itemVariants}
                            layout
                        >
                            <motion.div
                                style={{ display: "flex", alignItems: "center", gap: "15px" }}
                            >
                                <Menu size={24} />
                                {!collapsed && sidebarExpanded && <span>Menú</span>}
                            </motion.div>
                        </motion.li>
                    </AnimatePresence>

                    {/* Menú de navegación */}
                    <AnimatePresence>
                        {menuItems.map((item, index) => (
                            <motion.li
                                key={item.label}
                                className="menu-item"
                                whileHover={collapsed ? {} : { backgroundColor: "rgba(255,255,255,0.05)" }}
                                onClick={() => navigate(item.path)}
                                custom={index}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={itemVariants}
                                layout
                            >
                                <motion.div
                                    style={{ display: "flex", alignItems: "center", gap: "15px" }}
                                >
                                    <item.icon size={24} />
                                    {!collapsed && sidebarExpanded && <span>{item.label}</span>}
                                </motion.div>
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </ul>
            </motion.aside>

            {/* Contenido principal */}
            <motion.main
                className="content"
                animate={{ marginLeft: collapsed ? "80px" : "250px" }}
                transition={{ duration: 0.5, ease: [0.68, -0.55, 0.27, 1.55] }}
            >
                {/* Header */}
                <div className="header">
                    <div className="logo-header">
                        <img src={logo} alt="Kreativa Agency" className="logo-img" />
                    </div>

                    <div className="search-container">
                        <div className="search-bar">
                            <Search size={18} className="search-icon" />
                            <input type="text" placeholder="Buscar..." />
                        </div>
                    </div>

                    <div className="header-icons">
                        <Bell size={22} className="header-icon" />
                        <MessageCircle size={22} className="header-icon" />
                        <div className="header-avatar">
                            <img
                                src="https://i.pravatar.cc/150?u=a04258114e29026702d"
                                alt="Perfil"
                            />
                        </div>
                    </div>
                </div>

                {/* Contenido dinámico */}
                {children}
            </motion.main>
        </div>
    );
};

export default AdminLayout;