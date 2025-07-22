const mongoose = require("mongoose");

const EgresosModel = new mongoose.Schema(
    {
        fecha: {
            type: Date,
            required: true,
            default: Date.now,
        },
        monto: {
            type: Number,
            required: true,
            min: 0,
        },
        categoria: {
            type: String,
            enum: ['Salarios', 'Software', 'Servicios de contabilidad', 'Servicios'],
            required: true
        },
        descripcion: {
            type: String,
            required: true,
        },
        proveedor: {
            type: String,
            required: true,
        },
        estado: {
            type: String,
            required: true,
            enum: ["Aprobado", "Pendiente", "Rechazado"],
        },
        nota: {
            type: String,
        },
        fecha_creacion: {
            type: Date,
            required: true,
            default: Date.now(),
        },
        ultima_modificacion: {
            type: Date,
            required: true,
            default: Date.now,
        },
        activo: {
            type: Boolean,
            default: true,
            required: true
        },
    },
    { collection: "egresos" }
);

EgresosModel.pre('save', function (next) {
    this.ultima_modificacion = Date.now();
    next();
});

module.exports = mongoose.model("egresos", EgresosModel);