const mongoose = require("mongoose");

const movimientoSchema = new mongoose.Schema({
  idRegistro: { type: mongoose.Schema.Types.ObjectId, required: true },
  entidad: { type: String, required: true },
  accion: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  detalle: { type: Object },
});

module.exports = mongoose.model("movimientos", movimientoSchema);
