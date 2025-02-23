const ServiciosService = require("../services/serviciosService");
const lodash = require("lodash");

class ServiciosController {
    async agregarServicio(req, res) {
        try {
            const servicio = await ServiciosService.agregarServicio(req.body);

            return res.status(201).json(servicio);
        } catch (error) {
            console.error("Error al agregar el servicio: " + error.message);
            return res.status(500).json({ error: error.message });
        }
    }

    async getServicios(req, res) {
        try {
            const servicios = await ServiciosService.getServicios();
            return res.status(200).json(servicios);
        } catch (error) {
            console.error("Error al obtener los servicios: " + error.message);
            return res.status(500).json({ error: error.message });
        }
    }

    async getServicioById(req, res) {
        try {
            const { id } = req.params;
            const servicio = await ServiciosService.getServicioById(id);

            return res.status(200).json(servicio);
        } catch (error) {
            console.error("Error al obtener el servicio: " + error.message);
            return res.status(404).json({ error: error.message });
        }
    }

    async modificarServicioById(req, res) {
        try {
            const id = req.params.id;
            const data = req.body;

            const servicioActualizado =
                await ServiciosService.modificarServicioById(id, data);

            return res.status(200).json(servicioActualizado);
        } catch (error) {
            console.error("Error al modificar el servicio: " + error.message);
            return res.status(404).json({ error: error.message });
        }
    }

    async agregarPaquete(req, res) {
        try {
            const { id } = req.params;
            const paquete = req.body;

            const servicioActualizado = await ServiciosService.agregarPaquete(
                id,
                paquete
            );
            return res.status(200).json(servicioActualizado);
        } catch (error) {
            console.error("Error al agregar el paquete: " + error.message);
            return res.status(500).json({ error: error.message });
        }
    }

    async desactivarServicio(req, res) {
        try {
            const { id } = req.params;
            const servicio = await ServiciosService.desactivarServicioById(id);
            return res
                .status(200)
                .json({ mensaje: "Servicio desactivado", servicio });
        } catch (error) {
            console.error("Error al desactivar el servicio: " + error.message);
            return res.status(500).json({ error: error.message });
        }
    }

    async activarServicio(req, res) {
        try {
            const { id } = req.params;
            const servicio = await ServiciosService.activarServicioById(id);
            return res
                .status(200)
                .json({ mensaje: "Servicio activado", servicio });
        } catch (error) {
            console.error("Error al activar el servicio: " + error.message);
            return res.status(500).json({ error: error.message });
        }
    }

    async getCategorias(req, res) {
        try {
            const categorias = await ServiciosService.getCategorias();
            return res.status(200).json(categorias);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async agregarCategoria(req, res) {
        try {
            const { nombre } = req.body;
            if (!nombre) {
                return res
                    .status(400)
                    .json({ error: "El nombre es obligatorio" });
            }
            const respuesta = await ServiciosService.agregarCategoria(nombre);
            return res.status(201).json(respuesta);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ServiciosController();
