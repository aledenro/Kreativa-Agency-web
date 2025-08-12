import { createContext, useState, useContext, useEffect } from "react";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [hydrating, setHydrating] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("app_user");
    if (raw) setUser(JSON.parse(raw));
    setHydrating(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("app_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("app_user");
  };

  return (
    <AuthContext.Provider value={{ user, hydrating, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
