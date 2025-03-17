import { useState } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, Home, Users, Settings, LogOut, Bell, MessageCircle, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "/src/assets/img/logo.png";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Home, label: "Inicio", path: "/" },
  { icon: Users, label: "Usuarios", path: "/usuarios" },
  { icon: Settings, label: "Configuración", path: "/configuracion" },
  { icon: LogOut, label: "Salir", path: "/logout" },
];

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <motion.aside
        className={`sidebar ${collapsed ? "collapsed" : ""}`}
        animate={{ width: collapsed ? "80px" : "250px" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setCollapsed(true)}
      >
        <ul>
          {menuItems.map((item, index) => (
            <motion.li
              key={index}
              whileHover={{ scale: 1.1 }}
              className="menu-item"
              onClick={() => navigate(item.path)}
            >
              <item.icon size={24} />
              {!collapsed && (
                <motion.span animate={{ opacity: 1, display: "inline-block" }} transition={{ duration: 0.2 }}>
                  {item.label}
                </motion.span>
              )}
            </motion.li>
          ))}
        </ul>
      </motion.aside>

      <motion.main className="content" animate={{ marginLeft: collapsed ? "80px" : "250px" }} transition={{ duration: 0.3 }}>
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
              <img src="https://i.pravatar.cc/150?u=a04258114e29026702d" alt="Perfil" />
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
