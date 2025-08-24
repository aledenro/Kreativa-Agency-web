const SessionsModel = require("../models/sessionsModel");
const lodash = require("lodash");

class SessionsService {
  async addSession(data) {
    try {
      await this.updateSessionStatus(data.user, "Nueva sesión iniciada");

      const session = new SessionsModel(data);
      await session.save();
      return session;
    } catch (error) {
      console.error("Error creando nueva sesion", error);
      return null;
    }
  }

  async isTokenActiveSession(userId, token) {
    try {
      const session = await SessionsModel.findOne({
        user: userId,
        token: token,
        estado: true,
      });

      return session ? true : false;
    } catch (error) {
      console.error("Error verificando token activo:", error);
      return false;
    }
  }

  async cleanExpiredSessions() {
    try {
      const now = new Date();
      const result = await SessionsModel.updateMany(
        {
          estado: true,
          fecha: { $lt: new Date(now.getTime() - 2 * 60 * 60 * 1000) },
        },
        {
          estado: false,
          motivoFinalizacion: "Sesión expirada por tiempo",
        }
      );

      return result;
    } catch (error) {
      console.error("Error limpiando sesiones expiradas:", error);
      return null;
    }
  }

  async updateSessionStatus(userId, motivo) {
    try {
      const session = await SessionsModel.findOne({
        user: userId,
        estado: true,
      });

      if (!session || lodash.isEmpty(session)) {
        return { error: "No se encontró una sesión activa" };
      }

      session.estado = false;
      session.motivoFinalizacion = motivo;
      await session.save();

      return { message: "Estado actualizado de manera correcta." };
    } catch (error) {
      throw new Error("Error al actualizar el estado de la sesión.");
    }
  }

  async getActiveSessionByUserId(userId) {
    try {
      const session = await SessionsModel.findOne({
        user: userId,
        estado: true,
      });

      return session || {};
    } catch (error) {
      throw new Error("Error al buscar la sesión.");
    }
  }

  async updateSessionStatusToken(userId, motivo, token) {
    try {
      const session = await SessionsModel.findOne({
        user: userId,
        token: token,
      });

      if (!session || lodash.isEmpty(session)) {
        return { error: "No se encontró una sesión con ese token" };
      }

      session.estado = false;
      session.motivoFinalizacion = motivo;
      await session.save();

      return { message: "Estado actualizado de manera correcta." };
    } catch (error) {
      throw new Error("Error al actualizar el estado de la sesión.");
    }
  }

  async findActiveSessionByUserIdAndToken(userId, token) {
    try {
      const session = await SessionsModel.findOne({
        user: userId,
        token: token,
        estado: true,
      });

      return session;
    } catch (error) {
      console.error("Error buscando sesión por token:", error);
      return null;
    }
  }

  async closeAllUserSessions(userId, motivo = "Cierre forzado de sesiones") {
    try {
      const result = await SessionsModel.updateMany(
        {
          user: userId,
          estado: true,
        },
        {
          estado: false,
          motivoFinalizacion: motivo,
        }
      );

      return result;
    } catch (error) {
      console.error("Error cerrando todas las sesiones del usuario:", error);
      throw new Error("Error al cerrar sesiones del usuario.");
    }
  }

  async findActiveSessionByUserId(userId) {
    try {
      const session = await SessionsModel.findOne({
        user: userId,
        estado: true,
      });

      return session ? true : false;
    } catch (error) {
      throw new Error("Error al buscar la sesión.");
    }
  }
}

module.exports = new SessionsService();
