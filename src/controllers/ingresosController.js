const ingresosService = require("../services/ingresosService");
const Usuario = require("../models/usuarioModel");

const ingresosController = {
    async registrarIngreso(req, res) {
        try {
            const nuevoIngreso = await ingresosService.registrarIngreso(
                req.body
            );
            res.status(201).json({
                message: "Ingreso registrado con éxito.",
                ingreso: nuevoIngreso,
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async obtenerIngresos(req, res) {
        try {
            const ingresos = await ingresosService.obtenerIngresos();
            res.status(200).json(ingresos);
        } catch (error) {
            res.status(500).json({ message: "Error al obtener ingresos." });
        }
    },

    async buscarUsuarioPorCedula(req, res) {
        try {
            const usuario = await Usuario.findOne({
                cedula: req.params.cedula,
            });
            if (!usuario) {
                return res
                    .status(404)
                    .json({ message: "Usuario no encontrado" });
            }
            return res.status(200).json(usuario);
        } catch (error) {
            return res.status(500).json({
                message: "Error al buscar usuario",
                error: error.message,
            });
        }
    },

    async obtenerIngresoPorId(req, res) {
        try {
            const ingreso = await ingresosService.obtenerIngresoPorId(
                req.params.id
            );
            res.status(200).json(ingreso);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    },

    async actualizarIngreso(req, res) {
        try {
            const ingresoActualizado = await ingresosService.actualizarIngreso(
                req.params.id,
                req.body
            );
            res.status(200).json({
                message: "Ingreso actualizado con éxito.",
                ingreso: ingresoActualizado,
            });
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    },

    // Función para activar un ingreso
    async activarIngreso(req, res) {
        try {
            const { id } = req.params;
            const ingreso = await ingresosService.activarIngresoById(id);
            return res
                .status(200)
                .json({ mensaje: "Ingreso activado", ingreso });
        } catch (error) {
            console.error("Error al activar el ingreso: " + error.message);
            return res.status(500).json({ error: error.message });
        }
    },

    // Función para desactivar un ingreso
    async desactivarIngreso(req, res) {
        try {
            const { id } = req.params;
            const ingreso = await ingresosService.desactivarIngresoById(id);
            return res
                .status(200)
                .json({ mensaje: "Ingreso desactivado", ingreso });
        } catch (error) {
            console.error("Error al desactivar el ingreso: " + error.message);
            return res.status(500).json({ error: error.message });
        }
    },

    async obtenerIngresosPorMes(req, res) {
        try {
            const { mes, año } = req.query; // Recibe los parámetros mes y año del query string

            if (!mes || !año) {
                return res
                    .status(400)
                    .json({ message: "Debe proporcionar mes y año." });
            }

            const ingresosPorMes = await ingresosService.obtenerIngresosPorMes(
                mes,
                año
            );
            res.status(200).json(ingresosPorMes);
        } catch (error) {
            res.status(500).json({
                message: "Error al obtener los ingresos por mes.",
                error: error.message,
            });
        }
    },

    async obtenerIngresosPorAnio(req, res) {
        const { anio } = req.query; // Obtener el año desde los parámetros de la URL

        try {
            const totalIngresos =
                await ingresosService.obtenerIngresosPorAnio(anio);

            res.status(200).json({ totalIngresos });
        } catch (error) {
            res.status(500).json({
                error: "No se pudieron obtener los ingresos.",
            });
        }
    },

    async getIngresosDateRange(req, res) {
        try {
            const fechaInicio = req.query.fechaInicio;
            const fechaFin = req.query.fechaFin;

            const ingresos = await ingresosService.getIngresosDateRange(
                fechaInicio,
                fechaFin
            );

            return res.json(ingresos);
        } catch (error) {
            res.status(500).json({
                error: "No se pudieron obtener los ingresos.",
            });
        }
    },
};

module.exports = ingresosController;
