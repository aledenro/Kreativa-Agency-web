const Movimiento = require("../models/movimientoModel");

const movimientosService = {
  async registrarMovimiento(movimientoData) {
    try {
      const movimiento = new Movimiento(movimientoData);
      await movimiento.save();
      return movimiento;
    } catch (error) {
      throw new Error("Error al registrar el movimiento: " + error.message);
    }
  }
};

module.exports = movimientosService;
