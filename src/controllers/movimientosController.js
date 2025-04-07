const Movimiento = require("../models/movimientoModel");

const movimientosController = {
  // Obtener movimientos por fecha, año, o rango
  async obtenerMovimientos(req, res) {
    try {
      const { fecha, anio, fechaInicio, fechaFin } = req.query;
      let filtro = {};

      if (fecha) {
        // Si se pasa una fecha exacta
        const fechaObj = new Date(fecha);
        filtro.fecha = {
          $gte: new Date(fechaObj.setHours(0, 0, 0, 0)),
          $lte: new Date(fechaObj.setHours(23, 59, 59, 999)),
        };
      } else if (anio) {
        // Si se pasa un año
        const inicio = new Date(anio, 0, 1);
        const fin = new Date(anio, 11, 31, 23, 59, 59, 999);
        filtro.fecha = { $gte: inicio, $lte: fin };
      } else if (fechaInicio && fechaFin) {
        // Si se pasa un rango de fechas
        filtro.fecha = { $gte: new Date(fechaInicio), $lte: new Date(fechaFin) };
      }
      // Puedes agregar otros filtros si lo requieres, por ejemplo, por tipo de movimiento.
      const movimientos = await Movimiento.find(filtro).sort({ fecha: -1 });
      res.json(movimientos);
    } catch (error) {
      console.error("Error al obtener el historial de movimientos:", error.message);
      res.status(500).json({ error: "Error al obtener el historial de movimientos" });
    }
  },
};

module.exports = movimientosController;
