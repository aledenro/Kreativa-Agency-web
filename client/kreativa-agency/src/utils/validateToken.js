import { jwtDecode } from "jwt-decode";
import axios from "axios";

const PING_INTERVAL = 3000;
let pingInterval = null;
let isRunning = false;

export const validTokenActive = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return false;
  }

  try {
    const decoded = jwtDecode(token);
    const valid = decoded.exp * 1000 > Date.now();
    if (!valid) {
      localStorage.clear();
    }
    return valid;
  } catch (error) {
    console.error("Error decodificando token:", error);
    localStorage.clear();
    return false;
  }
};

export const updateSessionStatus = async (motivo = "Token vencido") => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user_name");

  if (!user || !token) return;

  try {
    await axios.put(`${import.meta.env.VITE_API_URL}/sessions/token`, {
      username: user,
      motivo: motivo,
      token: token,
    });
  } catch (error) {
    console.error("Error actualizando sesión:", error);
  }
};

export const pingBackend = async () => {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("user_name");

  if (!token || !username) {
    stopTokenPing();
    return false;
  }

  if (!validTokenActive()) {
    await handleInvalidSession("Token expirado localmente");
    return false;
  }

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/sessions/validate-token`,
      {
        username: username,
        token: token,
      },
      {
        timeout: 3000,
      }
    );

    if (response.data.valid) {
      return true;
    } else {
      await handleInvalidSession(response.data.message);
      return false;
    }
  } catch (error) {
    console.error("Error en ping al backend:", error);

    if (error.code === "ECONNABORTED" || error.code === "NETWORK_ERROR") {
      console.warn("Error de conexión, manteniendo sesión temporalmente");
      return true;
    }

    if (error.response?.status === 401 || error.response?.status === 403) {
      const message = error.response?.data?.message || "Token inválido";
      await handleInvalidSession(message);
      return false;
    }

    console.warn(
      "Error desconocido en ping, manteniendo sesión:",
      error.message
    );
    return true;
  }
};

export const handleInvalidSession = async (reason) => {
  stopTokenPing();

  try {
    await updateSessionStatus(reason);
  } catch (error) {
    console.error("Error actualizando estado de sesión:", error);
  }

  localStorage.clear();

  window.dispatchEvent(
    new CustomEvent("sessionExpired", {
      detail: { reason },
    })
  );
};

export const startTokenPing = () => {
  if (isRunning) {
    console.warn("El ping de token ya está corriendo");
    return;
  }

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("user_name");

  if (!token || !username) {
    return;
  }

  isRunning = true;

  pingBackend();

  pingInterval = setInterval(async () => {
    if (isRunning) {
      await pingBackend();
    }
  }, PING_INTERVAL);
};

export const stopTokenPing = () => {
  if (!isRunning) {
    return;
  }

  isRunning = false;

  if (pingInterval) {
    clearInterval(pingInterval);
    pingInterval = null;
  }
};

export const getPingStatus = () => {
  return {
    isRunning,
    interval: PING_INTERVAL,
  };
};

export const logout = async () => {
  const username = localStorage.getItem("user_name");

  if (username) {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/sessions/logout`, {
        username,
      });
    } catch (error) {
      console.error("Error en logout:", error);
    }
  }

  stopTokenPing();
  localStorage.clear();
  window.location.href = "/login";
};

export const makeAuthenticatedRequest = async (requestConfig) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user_name");

  if (!token || !user) {
    throw new Error("No hay token o usuario disponible");
  }

  const config = {
    ...requestConfig,
    headers: {
      ...requestConfig.headers,
      Authorization: `Bearer ${token}`,
      user: user,
    },
  };

  try {
    return await axios(config);
  } catch (error) {
    if (error.response?.status === 401) {
      await handleInvalidSession("Token inválido en request");
      throw new Error("Sesión expirada");
    }
    throw error;
  }
};

const TokenUtils = {
  validTokenActive,
  updateSessionStatus,
  pingBackend,
  startTokenPing,
  stopTokenPing,
  getPingStatus,
  handleInvalidSession,
  logout,
  makeAuthenticatedRequest,
};

export default TokenUtils;
