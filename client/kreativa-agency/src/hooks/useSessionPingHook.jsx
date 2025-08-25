import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TokenUtils from "../utils/validateToken";

export const useSessionPing = () => {
  const navigate = useNavigate();
  const { user, logout: authLogout } = useAuth();

  const handleSessionExpired = useCallback(
    (event) => {
      if (authLogout) {
        authLogout();
      }

      navigate("/error", {
        replace: true,
        state: {
          errorCode: 401,
          mensaje:
            event.detail?.reason ||
            "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
        },
      });
    },
    [navigate, authLogout]
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("user_name");

    if (token && username && user) {
      console.log("Usuario logueado detectado, iniciando ping de sesión...");

      window.addEventListener("sessionExpired", handleSessionExpired);

      TokenUtils.startTokenPing();

      return () => {
        window.removeEventListener("sessionExpired", handleSessionExpired);
        TokenUtils.stopTokenPing();
      };
    } else {
      TokenUtils.stopTokenPing();
    }
  }, [user, handleSessionExpired]);

  useEffect(() => {
    if (!user) {
      TokenUtils.stopTokenPing();
    }
  }, [user]);

  return {
    startPing: TokenUtils.startTokenPing,
    stopPing: TokenUtils.stopTokenPing,
    getPingStatus: TokenUtils.getPingStatus,
    logout: TokenUtils.logout,
  };
};
