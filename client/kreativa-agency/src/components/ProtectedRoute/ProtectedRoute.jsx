import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, hydrating } = useAuth();

  if (hydrating) return null;

  if (!user) return <Navigate
        to="/error"
        replace
        state={{ errorCode: 401, mensaje: "Acceso no autorizado." }}
      />;

  const userRoles = Array.isArray(user.tipo_usuario)
    ? user.tipo_usuario
    : [user.tipo_usuario];

  const canAccess =
    allowedRoles.length === 0 || userRoles.some(r => allowedRoles.includes(r));

  if (!canAccess) {
    return (
      <Navigate
        to="/error"
        replace
        state={{ errorCode: 403, mensaje: "Oops, no está autorizado para ingresar acá." }}
      />
    );
  }

  return children;
}
