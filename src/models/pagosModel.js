const mongoose = require("mongoose");

const PagosModel = new mongoose.Schema(
    {
        cliente_id: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "usuarios",
        },
        titulo: {
            type: String,
            required: true,
        },
        detalle: {
            type: String,
            required: true,
        },
        monto: {
            type: Number,
            required: true,
            min: 0,
        },
        fecha_creacion: {
            type: Date,
            required: true,
            default: Date.now(),
        },
        fecha_vencimiento: {
            type: Date,
            required: true,
        },
        estado: {
            type: String,
            required: true,
            enum: ["Pendiente", "Pagado", "Cancelado"],
        },
    },
    { collection: "pagos" }
);

module.exports = new mongoose.model("pagos", PagosModel);
