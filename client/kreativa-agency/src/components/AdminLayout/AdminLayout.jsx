import { useEffect, useState, useRef } from "react";
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
    FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "/src/assets/img/logo.png";

const menuStructure = [
    {
        title: "Usuarios",
        items: [
            { icon: Users, label: "Gestión de usuarios", path: "/usuarios" },
        ],
    },
    {
        title: "Proyectos",
        items: [
            { icon: Settings, label: "Gestión de proyectos", path: "/proyectos/gestion" },
            { icon: LayoutDashboard, label: "Dashboard proyecto", path: "/proyectos/dashboard" },
            { icon: FilePlus2, label: "Solicitudes cotización", path: "/proyectos/solicitudes" },
        ],
    },
    {
        title: "Reportes",
        items: [
            { icon: Mail, label: "Dashboard", path: "/reportes/finanzas" },
        ],
    },
    {
        title: "Empleados",
        items: [
            { icon: IdCard, label: "Organigrama", path: "/empleados/organigrama" },
            { icon: FileText, label: "PTO", path: "/empleados/pto" },
            { icon: Users, label: "Perfiles", path: "/empleados/perfiles" },
        ],
    },
    {
        title: "Finanzas",
        items: [
            { icon: Mail, label: "Gestión financiera", path: "/finanzas/gestion" },
            { icon: LayoutDashboard, label: "Estadísticas", path: "/finanzas/estadisticas" },
        ],
    },
    {
        title: "Landing Page",
        items: [
            { icon: Home, label: "Gestión de servicios", path: "/landing/servicios" },
            { icon: SquareKanban, label: "Gestión de paquetes", path: "/landing/paquetes" },
            { icon: Settings, label: "Activar y desactivar puestos", path: "/landing/puestos" },
        ],
    },
    {
        title: "Salir",
        items: [
            { icon: LogOut, label: "Cerrar sesión", path: "/logout" },
        ],
    },
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
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const sidebarRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        const handleClickOutside = (event) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target) &&
                isMobile &&
                !collapsed
            ) {
                setCollapsed(true);
            }
        };
        window.addEventListener("resize", handleResize);
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("resize", handleResize);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMobile, collapsed]);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className="admin-container">
            {/* Sidebar */}
            <motion.aside
                ref={sidebarRef}
                className={`sidebar ${collapsed ? "collapsed" : ""} ${isMobile && !collapsed ? "show" : ""}`}
                initial={false}
                style={{ width: collapsed ? "80px" : "250px" }}
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
                                {!collapsed && <span>Menú</span>}
                            </motion.div>
                        </motion.li>
                    </AnimatePresence>

                    {/* Menú por módulos */}
                    <AnimatePresence>
                        {menuStructure.map((section, sectionIndex) => (
                            <motion.li key={section.title} layout className="sidebar-module">
                                <div style={{ width: "100%" }}>
                                    {!collapsed && (
                                        <>
                                            <div className="sidebar-section-title">{section.title}</div>
                                            <div className="sidebar-divider"></div>
                                        </>
                                    )}
                                    <ul className="sidebar-submenu" style={{ paddingLeft: "0" }}>
                                        {section.items.map((item, index) => (
                                            <motion.li
                                                key={item.label}
                                                className="menu-item mb-1 text-sm text-white/80"
                                                onClick={() => {
                                                    navigate(item.path);
                                                    if (isMobile) setCollapsed(true);
                                                }}
                                                custom={index}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                variants={itemVariants}
                                                layout
                                                whileHover={
                                                    collapsed
                                                        ? {}
                                                        : {
                                                            y: -3,
                                                            scale: 1,
                                                            backgroundColor: "rgba(255, 255, 255, 0.04)",
                                                            boxShadow: "0 0 4px rgba(0,0,0,0.03)",
                                                            transition: {
                                                                duration: 0.2,
                                                                ease: [0.25, 1, 0.5, 1],
                                                            },
                                                        }
                                                }
                                            >
                                                <motion.div
                                                    style={{ display: "flex", alignItems: "center", gap: "15px" }}
                                                >
                                                    <item.icon size={18} />
                                                    {!collapsed && <span>{item.label}</span>}
                                                </motion.div>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </ul>
            </motion.aside>

            {/* Contenido principal */}
            <motion.main
                className={`content ${collapsed ? "collapsed" : "expanded"}`}
                animate={{ marginLeft: collapsed ? "80px" : "250px" }}
                transition={{ duration: 0.5, ease: [0.68, -0.55, 0.27, 1.55] }}
            >
                {/* Header */}
                <motion.div
                    className={`header ${isMobile ? "" : collapsed ? "collapsed" : "expanded"}`}
                >
                    {isMobile && (
                        <button
                            className="menu-toggle-btn"
                            onClick={toggleSidebar}
                            aria-label="Abrir menú"
                        >
                            <Menu size={26} />
                        </button>
                    )}

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
                </motion.div>

                {/* Contenido dinámico */}
                {children}
            </motion.main>
        </div>
    );
};

export default AdminLayout;
