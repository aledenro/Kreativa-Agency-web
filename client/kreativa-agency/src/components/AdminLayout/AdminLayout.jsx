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
    BriefcaseBusiness,
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
    {
        icon: BriefcaseBusiness,
        label: "Reclutaciones",
        path: "/admin/reclutaciones",
    },
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
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [showSidebarItems, setShowSidebarItems] = useState(false);
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
        const newState = !collapsed;
        setCollapsed(newState);
        setSidebarExpanded(newState);
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
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "15px",
                                }}
                            >
                                <Menu size={24} />
                                {!collapsed && <span>Menú</span>}
                            </motion.div>
                        </motion.li>
                    </AnimatePresence>

                    {/* Menú de navegación */}
                    <AnimatePresence>
                        {menuItems.map((item, index) => (
                            <motion.li
                                key={item.label}
                                className="menu-item"
                                whileHover={
                                    collapsed
                                        ? {}
                                        : {
                                              backgroundColor:
                                                  "rgba(255,255,255,0.05)",
                                          }
                                }
                                onClick={() => {
                                    navigate(item.path);
                                    if (isMobile) {
                                        setCollapsed(true);
                                    }
                                }}
                                custom={index}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={itemVariants}
                                layout
                            >
                                <motion.div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "15px",
                                    }}
                                >
                                    <item.icon size={24} />
                                    {!collapsed && <span>{item.label}</span>}
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
                <motion.div className="header">
                    {/* Botón hamburguesa visible solo en móviles */}
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
                        <img
                            src={logo}
                            alt="Kreativa Agency"
                            className="logo-img"
                        />
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
