const SessionsService = require("../services/sessionsService");
const lodash = require("lodash");
const { verificarUsuarioExistente } = require("../services/usuarioService");

class SessionsController {
  async addSession(req, res) {
    try {
      const data = req.body;

      if (!data || lodash.isEmpty(data) || !data.username || !data.token) {
        return res.sendStatus(400);
      }

      const user = await verificarUsuarioExistente(data.username);

      if (!user || lodash.isEmpty(user)) {
        return res.sendStatus(404);
      }

      const sessionData = {
        user: user._id,
        estado: true,
        token: data.token,
        fecha: Date.now(),
        motivoFinalizacion: "",
      };

      const session = await SessionsService.addSession(sessionData);

      if (session && !lodash.isEmpty(session)) {
        return res.status(201).json({
          message: "Sesión creada exitosamente",
          sessionId: session._id,
        });
      }

      return res.sendStatus(500);
    } catch (error) {
      console.error("Error creando sesión:", error);
      return res.sendStatus(500);
    }
  }

  async updateSessionStatus(req, res) {
    const userId = req.body.username;
    const motivo = req.body.motivo;

    try {
      const user = await verificarUsuarioExistente(userId);

      if (!user || lodash.isEmpty(user)) {
        return res.sendStatus(404);
      }

      const sessionRes = await SessionsService.updateSessionStatus(
        user._id,
        motivo
      );

      if (sessionRes.error) {
        return res.status(404).json({ error: sessionRes.error });
      }

      return res.status(200).json({ message: sessionRes.message });
    } catch (error) {
      console.error("Error actualizando sesión:", error);
      return res.sendStatus(500);
    }
  }

  async getSessionByUserId(req, res) {
    const userId = req.params.id;

    if (!userId) {
      return res.sendStatus(400);
    }

    try {
      const user = await verificarUsuarioExistente(userId);

      if (!user || lodash.isEmpty(user)) {
        return res.sendStatus(404);
      }

      const sessionFound = await SessionsService.findActiveSessionByUserId(
        user._id
      );

      return res.json({ found: sessionFound });
    } catch (error) {
      console.log(error.message);
      return res.sendStatus(500);
    }
  }

  async updateSessionStatusToken(req, res) {
    const userId = req.body.username;
    const motivo = req.body.motivo;
    const token = req.body.token;

    try {
      const user = await verificarUsuarioExistente(userId);

      if (!user || lodash.isEmpty(user)) {
        return res.sendStatus(404);
      }

      const sessionRes = await SessionsService.updateSessionStatusToken(
        user._id,
        motivo,
        token
      );

      if (sessionRes.error) {
        return res.status(404).json({ error: sessionRes.error });
      }

      return res.status(200).json({ message: sessionRes.message });
    } catch (error) {
      console.error("Error actualizando sesión con token:", error);
      return res.sendStatus(500);
    }
  }

  async validateToken(req, res) {
    const { username, token } = req.body;

    if (!username || !token) {
      return res.status(400).json({
        valid: false,
        message: "Username y token son requeridos",
      });
    }

    try {
      const user = await verificarUsuarioExistente(username);
      if (!user || lodash.isEmpty(user)) {
        return res.status(404).json({
          valid: false,
          message: "Usuario no encontrado",
        });
      }

      if (user.estado && user.estado.toLowerCase() === "inactivo") {
        return res.status(403).json({
          valid: false,
          message: "Usuario inactivo",
        });
      }

      const jwt = require("jsonwebtoken");
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (jwtError) {
        await SessionsService.updateSessionStatusToken(
          user._id,
          "Token JWT expirado",
          token
        );

        return res.status(401).json({
          valid: false,
          message: "Token JWT inválido o expirado",
        });
      }

      if (decoded.usuario !== username || decoded.id !== user._id.toString()) {
        return res.status(401).json({
          valid: false,
          message: "Token no coincide con usuario",
        });
      }

      const isActiveSession = await SessionsService.isTokenActiveSession(
        user._id,
        token
      );

      if (!isActiveSession) {
        return res.status(401).json({
          valid: false,
          message: "Token no corresponde a la sesión activa",
        });
      }

      return res.status(200).json({
        valid: true,
        message: "Token válido",
        user: {
          id: user._id,
          usuario: user.usuario,
          tipo_usuario: user.tipo_usuario,
        },
      });
    } catch (error) {
      console.error("Error validando token:", error);
      return res.status(500).json({
        valid: false,
        message: "Error interno del servidor",
      });
    }
  }

  async getActiveSession(req, res) {
    const userId = req.params.id;

    if (!userId) {
      return res.sendStatus(400);
    }

    try {
      const user = await verificarUsuarioExistente(userId);

      if (!user || lodash.isEmpty(user)) {
        return res.sendStatus(404);
      }

      const session = await SessionsService.getActiveSessionByUserId(user._id);

      if (!session || lodash.isEmpty(session)) {
        return res.status(404).json({ message: "No hay sesión activa" });
      }

      return res.json({
        session: {
          id: session._id,
          fecha: session.fecha,
          token: session.token.substring(0, 20) + "...",
        },
      });
    } catch (error) {
      console.error("Error obteniendo sesión activa:", error);
      return res.sendStatus(500);
    }
  }

  async closeCurrentSession(req, res) {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username es requerido" });
    }

    try {
      const user = await verificarUsuarioExistente(username);

      if (!user || lodash.isEmpty(user)) {
        return res.sendStatus(404);
      }

      const result = await SessionsService.updateSessionStatus(
        user._id,
        "Logout"
      );

      if (result.error) {
        return res.status(404).json({ error: result.error });
      }

      return res.status(200).json({ message: "Sesión cerrada exitosamente" });
    } catch (error) {
      console.error("Error cerrando sesión:", error);
      return res.sendStatus(500);
    }
  }
}

module.exports = new SessionsController();
