const Movimiento = require("../models/movimientoModel");

const movimientosController = {
	// Obtener movimientos por fecha, año, o rango
	async obtenerMovimientos(req, res) {
		try {
			const { fecha, anio, fechaInicio, fechaFin } = req.query;
			let filtro = {};

			if (fecha) {
				const fechaInicio = new Date(`${fecha}T00:00:00`);
				const fechaFin = new Date(`${fecha}T23:59:59.999`);

				filtro.fecha = { $gte: fechaInicio, $lte: fechaFin };
			} else if (anio) {
				// Si se pasa un año
				const inicio = new Date(anio, 0, 1);
				const fin = new Date(anio, 11, 31, 23, 59, 59, 999);
				filtro.fecha = { $gte: inicio, $lte: fin };
			} else if (fechaInicio && fechaFin) {
				// Si se pasa un rango de fechas
				const inicio = new Date(`${fechaInicio}T00:00:00`);
				const fin = new Date(`${fechaFin}T23:59:59.999`);
				filtro.fecha = { $gte: inicio, $lte: fin };
			}
			const movimientos = await Movimiento.find(filtro).sort({ fecha: -1 });
			res.json(movimientos);
		} catch (error) {
			console.error(
				"Error al obtener el historial de movimientos:",
				error.message
			);
			res
				.status(500)
				.json({ error: "Error al obtener el historial de movimientos" });
		}
	},
};

module.exports = movimientosController;
