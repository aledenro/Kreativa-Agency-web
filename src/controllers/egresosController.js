const EgresosService = require("../services/egresosService");
const lodash = require("lodash");
const Egreso = require("../models/egresosModel");
const movimientosService = require("../services/movimientosService");

class EgresosController {
    //Agregar egreso
    async agregarEgreso(req, res) {
        try {
            // Validar que están todos los datos
            if (lodash.isEmpty(req.body)) {
                return res.status(400).json({
                    error: "Para registrar el egreso debe completar todos los campos",
                });
            }
            const egreso = await EgresosService.agregarEgreso(req.body);
            // Registrar el movimiento de creación
            await await movimientosService.registrarMovimiento({
                entidad: "egreso",
                idRegistro: egreso._id,
                accion: "creación",
                descripcion: "Creación del egreso",
                detalle: { datosNuevos: egreso },
            });
            return res.status(201).json(egreso);
        } catch (error) {
            console.error(
                "Error al intentar registar el egreso: " + error.message
            );

            if (error.name === "ValidationError") {
                return res
                    .status(400)
                    .json({ error: "Datos inválidos", details: error.message });
            }

            // Error para otros casos
            return res
                .status(500)
                .json({ error: "Error interno del servidor" });
        }
    }

    // Obtener egreso
    async obtenerEgresos(req, res) {
        try {
            const egresos = await EgresosService.obtenerEgresos();
            return res.status(200).json(egresos);
        } catch (error) {
            console.error("Error al obtener egresos: " + error.message);
            return res
                .status(500)
                .json({ error: "Error interno del servidor" });
        }
    }

    // Obtener un egreso por ID
    async obtenerEgresoPorId(req, res) {
        try {
            const { id } = req.params;
            const egreso = await EgresosService.obtenerEgresoPorId(id);

            if (!egreso) {
                return res.status(404).json({ error: "Egreso no encontrado" });
            }

            return res.status(200).json(egreso);
        } catch (error) {
            console.error(
                "Error al obtener el egreso por ID: " + error.message
            );
            return res
                .status(500)
                .json({ error: "Error interno del servidor" });
        }
    }

    // Editar egreso
    async editarEgreso(req, res) {
        try {
            const { id } = req.params;
            let nuevosDatos = req.body;
            const camposPermitidos = [
                "fecha",
                "monto",
                "categoria",
                "descripcion",
                "proveedor",
                "estado",
                "nota",
            ];

            // Filtrar solo los campos permitidos
            nuevosDatos = Object.keys(nuevosDatos)
                .filter((key) => camposPermitidos.includes(key))
                .reduce((obj, key) => {
                    obj[key] = nuevosDatos[key];
                    return obj;
                }, {});

            const egresoAnterior = await EgresosService.obtenerEgresoPorId(id);
            const egresoActualizado = await EgresosService.editarEgreso(
                id,
                nuevosDatos
            );

            if (!egresoActualizado) {
                return res.status(404).json({ error: "Egreso no encontrado" });
            }

            // Registrar movimiento de edición
            await movimientosService.registrarMovimiento({
                entidad: "egreso",
                idRegistro: egresoActualizado._id,
                accion: "edición",
                descripcion: "Edición del egreso",
                detalle: {
                    datosAnteriores: egresoAnterior,
                    datosNuevos: egresoActualizado,
                },
            });

            return res.status(200).json(egresoActualizado);
        } catch (error) {
            console.error(
                "Error al intentar editar el egreso: " + error.message
            );

            // Error es por datos inválidos o faltantes
            if (error.name === "ValidationError") {
                return res.status(400).json({
                    error: "Datos inválidos, por favor ingrese los datos correctamente",
                    details: error.message,
                });
            }

            // Error para otros casos
            return res
                .status(500)
                .json({ error: "Error interno del servidor" });
        }
    }

    // Desactivar egreso
    async desactivarEgreso(req, res) {
        try {
            const { id } = req.params;
            const egresoAnterior = await EgresosService.obtenerEgresoPorId(id);
            const egreso = await EgresosService.desactivarEgresoById(id);

            await movimientosService.registrarMovimiento({
                entidad: "egreso",
                idRegistro: egreso._id,
                accion: "desactivación",
                descripcion: "Desactivación del egreso",
                detalle: {
                    datosAnteriores: egresoAnterior,
                    datosNuevos: egreso,
                },
            });
            return res
                .status(200)
                .json({ mensaje: "Egreso desactivado", egreso });
        } catch (error) {
            console.error("Error al desactivar el egreso: " + error.message);
            return res.status(500).json({ error: error.message });
        }
    }

    // Activar egreso
    async activarEgreso(req, res) {
        try {
            const { id } = req.params;
            const egresoAnterior = await EgresosService.obtenerEgresoPorId(id);
            const egreso = await EgresosService.activarEgresoById(id);
            await movimientosService.registrarMovimiento({
                entidad: "egreso",
                idRegistro: egreso._id,
                accion: "activación",
                descripcion: "Activación del egreso",
                detalle: {
                    datosAnteriores: egresoAnterior,
                    datosNuevos: egreso,
                },
            });
            return res.status(200).json({ mensaje: "Egreso activado", egreso });
        } catch (error) {
            console.error("Error al activar el egreso: " + error.message);
            return res.status(500).json({ error: error.message });
        }
    }

    // Obtener egresos por mes
    async obtenerEgresosPorMes(req, res) {
        try {
            const { fecha } = req.query;
            let fechaInicio, fechaFin;

            if (fecha) {
                const [anio, mes] = fecha.split("-");
                fechaInicio = new Date(anio, mes - 1, 1);
                fechaFin = new Date(anio, mes, 0);
            } else {
                // Si no se proporciona fecha, obtener el mes actual
                const today = new Date();
                fechaInicio = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    1
                );
                fechaFin = new Date(
                    today.getFullYear(),
                    today.getMonth() + 1,
                    0
                );
            }
            const egresos = await Egreso.find({
                fecha: { $gte: fechaInicio, $lte: fechaFin },
                activo: true,
                estado: "Aprobado",
            });

            return res.json(egresos);
        } catch (error) {
            console.error("Error al obtener los egresos:", error);
            return res
                .status(500)
                .json({ error: "Error al obtener los egresos." });
        }
    }

    async obtenerTotalEgresosAnuales(req, res) {
        try {
            const { year } = req.query;
            if (!year) {
                return res
                    .status(400)
                    .json({ error: "Se requiere el parámetro 'year'" });
            }

            const total = await EgresosService.obtenerTotalEgresosAnuales(year);
            res.json({ total });
        } catch (error) {
            res.status(500).json({
                error: "Error al obtener los egresos anuales",
            });
        }
    }

    async obtenerEgresosPorAnio(req, res) {
        try {
            const { anio } = req.query;
            if (!anio) {
                return res
                    .status(400)
                    .json({ error: "Se requiere el parámetro 'anio'" });
            }
            const totalEgresos =
                await EgresosService.obtenerEgresosPorAnio(anio);
            return res.json({ totalEgresos });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async obtenerEgresosAnualesDetalle(req, res) {
        try {
            const { anio } = req.query;
            if (!anio) {
                return res
                    .status(400)
                    .json({ message: "Se requiere el parámetro 'anio'." });
            }
            const data =
                await EgresosService.obtenerEgresosPorAnioDetalle(anio);
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getEgresosDateRange(req, res) {
        try {
            const fechaInicio = req.query.fechaInicio;
            const fechaFin = req.query.fechaFin;

            const egresos = await EgresosService.getEgresosDateRange(
                fechaInicio,
                fechaFin
            );

            return res.json(egresos);
        } catch (error) {
            res.status(500).json({
                error: "No se pudieron obtener los egresos.",
            });
        }
    }
}

module.exports = new EgresosController();
