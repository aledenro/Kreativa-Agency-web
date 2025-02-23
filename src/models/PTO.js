const mongoose = require("mongoose");

const PTOSchema = new mongoose.Schema({
    empleado_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fecha_inicio: { type: Date, required: true },
    fecha_fin: { type: Date, required: true },
    comentario: { type: String, default: "" },
    estado: { type: String, enum: ["Pendiente", "Aprobado", "Rechazado"], default: "Pendiente" },
    fecha_solicitud: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PTO", PTOSchema);