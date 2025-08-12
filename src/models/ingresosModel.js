const mongoose = require("mongoose");
const Usuario = require("../models/usuarioModel");

const IngresosModel = new mongoose.Schema(
	{
		fecha: {
			type: Date,
			required: true,
		},
		monto: {
			type: Number,
			required: true,
			min: 0,
		},
		descripcion: {
			type: String,
			required: true,
		},
		cedula: {
			type: String,
			required: true,
			validate: {
				validator: async function (cedula) {
					const usuario = await Usuario.findOne({ cedula });
					return !!usuario;
				},
				message: "La cédula ingresada no pertenece a un usuario registrado.",
			},
		},
		nombre_cliente: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		categoria: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "categorias_servicio",
			required: true,
		},
		estado: {
			type: String,
			required: true,
			enum: ["Pendiente de pago", "Pagado"],
		},
		nota: {
			type: String,
		},
		fecha_creacion: {
			type: Date,
			required: true,
			default: Date.now,
		},
		ultima_modificacion: {
			type: Date,
			required: true,
			default: Date.now,
		},
		activo: {
			type: Boolean,
			default: true,
			required: true,
		},
	},
	{ collection: "ingresos" }
);

IngresosModel.pre("save", function (next) {
	this.ultima_modificacion = Date.now();
	next();
});

module.exports = mongoose.model("ingresos", IngresosModel);
