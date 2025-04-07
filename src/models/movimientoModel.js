const mongoose = require("mongoose");

const movimientoSchema = new mongoose.Schema({
  idRegistro: { type: mongoose.Schema.Types.ObjectId, required: true },
  entidad: { type: String, required: true }, // "ingreso" o "egreso"
  accion: { type: String, required: true },   // "creacion", "edicion", "activacion", "desactivacion"
  fecha: { type: Date, default: Date.now },
  detalle: { type: Object }, // Aquí puedes guardar los cambios o datos relevantes
});

module.exports = mongoose.model("movimientos", movimientoSchema);
