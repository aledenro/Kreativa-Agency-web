import { useEffect, useState, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import {
    LayoutDashboard,
    Home,
    Users,
    LogOut,
    Mail,
    Search,
    IdCard,
    SquareKanban,
    Menu,
    ChevronDown,
    Banknote,
    FilePlus2,
    BriefcaseBusiness,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "/src/assets/img/logo.png";
import { AuthContext } from "../../context/AuthContext";

const sidebarItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: i * 0.07,
            duration: 0.4,
            ease: "easeOut",
        },
    }),
};

const menuStructure = [
    { title: "Usuarios", icon: Users, items: [{ label: "Gestión de usuarios", path: "/usuarios" }] },
    {
        title: "Proyectos", icon: SquareKanban, items: [
            { label: "Gestión de proyectos", path: "/proyectos/gestion" },
            { label: "Dashboard proyecto", path: "/proyectos/dashboard" },
            { label: "Solicitudes cotización", path: "/proyectos/solicitudes" },
        ]
    },
    { title: "Reportes", icon: LayoutDashboard, items: [{ label: "Dashboard", path: "/estadisticas" }] },
    {
        title: "Empleados", icon: IdCard, items: [
            { label: "Organigrama", path: "/empleados/organigrama" },
            { label: "PTO", path: "/empleados/pto" },
            { label: "Perfiles", path: "/empleados/perfiles" },
        ]
    },
    {
        title: "Finanzas", icon: Banknote, items: [
            { label: "Gestión financiera", path: "/finanzas/gestion" },
            { label: "Estadísticas", path: "/finanzas/estadisticas" },
        ]
    },
    {
        title: "Landing", icon: Home, items: [
            { label: "Gestión de servicios", path: "/landing/servicios" },
            { label: "Gestión de paquetes", path: "/landing/paquetes" },
            { label: "Gestión Form Puestos", path: "/landing/puestos" },
        ]
    },
    { title: "Salir", icon: LogOut, items: [{ label: "Cerrar sesión", path: "/logout" }] },
];

const AdminLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [openSections, setOpenSections] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const sidebarRef = useRef(null);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const userInitial = user?.nombre?.charAt(0).toUpperCase() || "U";

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isMobile && !collapsed) {
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

    const toggleSection = (title) => {
        setOpenSections((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    const handleSearchChange = (value) => {
        setSearchTerm(value);
        const suggestions = [];
        for (const section of menuStructure) {
            for (const item of section.items) {
                if (item.label.toLowerCase().includes(value.toLowerCase())) {
                    suggestions.push(item);
                }
            }
        }
        setFilteredSuggestions(suggestions);
    };

    const handleOpenOutlook = () => {
        window.open(
            "https://outlook.live.com/owa/",
            "_blank"
        );
    };

    return (
        <div className="admin-container">
            <motion.aside
                ref={sidebarRef}
                className={`sidebar ${collapsed ? "collapsed" : ""} ${isMobile && !collapsed ? "show" : ""}`}
                initial={false}
                style={{ width: collapsed ? "80px" : "250px", overflowY: 'auto' }}
            >
                <ul>
                    <AnimatePresence>
                        <motion.li
                            className={`menu-item ${collapsed ? "menu-toggle-item" : ""}`}
                            onClick={toggleSidebar}
                            custom={-1}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            layout
                        >
                            <motion.div className="menu-toggle-content">
                                <Menu size={collapsed ? 28 : 24} />
                                {!collapsed && <span>Menú</span>}
                            </motion.div>
                        </motion.li>
                    </AnimatePresence>

                    {menuStructure.map((section, index) => (
                        <motion.li
                            key={section.title}
                            className={`sidebar-module ${openSections[section.title] ? "open" : ""}`}
                            variants={sidebarItemVariants}
                            initial="hidden"
                            animate="visible"
                            custom={index}
                        >
                            <div className="module-container">
                                <div className="menu-item module-header" onClick={() => toggleSection(section.title)}>
                                    <div className="module-title">
                                        <section.icon size={20} />
                                        {!collapsed && <span>{section.title}</span>}
                                    </div>
                                    {!collapsed && (
                                        <ChevronDown
                                            size={16}
                                            className="chevron-icon"
                                            style={{ transition: "transform 0.3s", transform: openSections[section.title] ? "rotate(180deg)" : "rotate(0)" }}
                                        />
                                    )}
                                </div>

                                <AnimatePresence>
                                    {!collapsed && openSections[section.title] && (
                                        <motion.ul className="sidebar-submenu" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                                            {section.items.map((item) => (
                                                <motion.li
                                                    key={item.label}
                                                    className="menu-item submenu-item"
                                                    onClick={() => navigate(item.path)}
                                                    layout
                                                >
                                                    <span>{item.label}</span>
                                                </motion.li>
                                            ))}
                                        </motion.ul>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.li>
                    ))}

                </ul>
            </motion.aside>

            <motion.main className={`content ${collapsed ? "collapsed" : "expanded"}`} animate={{ marginLeft: collapsed ? "80px" : "250px" }} transition={{ duration: 0.5, ease: [0.68, -0.55, 0.27, 1.55] }}>
                <motion.div className={`header ${isMobile ? "" : collapsed ? "collapsed" : "expanded"}`}>
                    {isMobile && (
                        <button className="menu-toggle-btn" onClick={toggleSidebar} aria-label="Abrir menú">
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
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                            />
                            {filteredSuggestions.length > 0 && (
                                <div className="suggestions-dropdown">
                                    {filteredSuggestions.map((suggestion, index) => (
                                        <div
                                            key={index}
                                            className="suggestion-item"
                                            onClick={() => {
                                                navigate(suggestion.path);
                                                setSearchTerm("");
                                                setFilteredSuggestions([]);
                                            }}
                                        >
                                            {suggestion.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="header-icons">
                        <div className="tooltip-wrapper" data-tooltip="Cerrar sesión">
                            <LogOut
                                size={22}
                                className="header-icon"
                                onClick={() => {
                                    Swal.fire({
                                        title: "¿Cerrar sesión?",
                                        text: "¿Estás seguro que deseas cerrar tu sesión?",
                                        icon: "warning",
                                        showCancelButton: true,
                                        confirmButtonColor: "#FF0072",
                                        cancelButtonColor: "#888",
                                        confirmButtonText: "Sí, cerrar sesión",
                                        cancelButtonText: "Cancelar"
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            localStorage.removeItem("token");
                                            localStorage.removeItem("tipo_usuario");
                                            localStorage.removeItem("user_id");
                                            window.location.href = "http://localhost:5173/";
                                        }
                                    });
                                }}
                            />
                        </div>

                        <div className="tooltip-wrapper" data-tooltip="Ir a Outlook">
                            <Mail
                                size={22}
                                className="header-icon"
                                onClick={handleOpenOutlook}
                            />
                        </div>

                        <div
                            className="tooltip-wrapper"
                            data-tooltip="Ver perfil"
                            onClick={() => navigate("/perfil")}
                        >
                            <div
                                className="header-avatar"
                                style={{
                                    backgroundColor: "#FF0072",
                                    color: "white",
                                    fontWeight: "bold",
                                    fontSize: "18px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    cursor: "pointer",
                                    borderRadius: "50%",
                                    width: "36px",
                                    height: "36px"
                                }}
                            >
                                {userInitial}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {children}
            </motion.main>
        </div>
    );
};

export default AdminLayout;
