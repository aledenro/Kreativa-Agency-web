import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSessionPing } from "../../hooks/useSessionPingHook";
import { validTokenActive } from "../../utils/validateToken";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, hydrating } = useAuth();

  useSessionPing();

  if (hydrating) return null;

  if (!validTokenActive()) {
    return (
      <Navigate
        to="/error"
        replace
        state={{
          errorCode: 401,
          mensaje: "Acceso no autorizado. Debe iniciar sesión.",
        }}
      />
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/error"
        replace
        state={{
          errorCode: 401,
          mensaje: "Acceso no autorizado.",
        }}
      />
    );
  }

  if (allowedRoles.length > 0) {
    const userRoles = Array.isArray(user.tipo_usuario)
      ? user.tipo_usuario
      : [user.tipo_usuario];

    const canAccess = userRoles.some((role) => allowedRoles.includes(role));

    if (!canAccess) {
      return (
        <Navigate
          to="/error"
          replace
          state={{
            errorCode: 403,
            mensaje: "Oops, no está autorizado para ingresar acá.",
          }}
        />
      );
    }
  }

  return children;
}
