import { createContext, useState } from "react";

// Crear el contexto
export const AuthContext = createContext();

// Crear el provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Después de iniciar sesión
  const login = (userData) => {
    setUser(userData);
  };

  // Para cerrar sesión
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};