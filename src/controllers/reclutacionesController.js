const ReclutacionesService = require("../services/reclutacionesService");

class ReclutacionesController {
    async nuevaReclutacion(req, res) {
        try {
            const nuevaReclutacion =
                await ReclutacionesService.nuevaReclutacion(
                    req.body,
                    req.files
                );
            res.status(201).json(nuevaReclutacion);
        } catch (error) {
            console.error(
                "Error al agregar la respuesta de reclutamiento: " +
                    error.message
            );
            res.status(500).json({ message: error.message });
        }
    }

    async getReclutacionById(req, res) {
        try {
            const reclutacion = await ReclutacionesService.getReclutacionById(
                req.params.id
            );
            res.status(200).json(reclutacion);
        } catch (error) {
            console.error(
                "Error al obtener esta reclutación: " + error.message
            );
            res.status(404).json({ message: error.message });
        }
    }

    async getAllReclutaciones(req, res) {
        try {
            const reclutaciones =
                await ReclutacionesService.getAllReclutaciones();
            res.status(200).json(reclutaciones);
        } catch (error) {
            console.error(
                "Error al obtener las respuestas al formulario: " +
                    error.message
            );
            res.status(500).json({ message: error.message });
        }
    }

    async desactivarReclutacion(req, res) {
        try {
            const reclutacion =
                await ReclutacionesService.desactivarReclutacion(req.params.id);
            res.status(200).json(reclutacion);
        } catch (error) {
            console.error(
                "Error al desactivar la reclutacion: " + error.message
            );

            res.status(404).json({ message: error.message });
        }
    }
}

module.exports = new ReclutacionesController();
