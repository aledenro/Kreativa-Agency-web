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
      const { id } = req.params;
      const servicioActualizado = await ServiciosService.modificarServicioById(
        id,
        req.body
      );

      return res.status(200).json(servicioActualizado);
    } catch (error) {
      console.error("Error al modificar el servicio: " + error.message);
      return res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new ServiciosController();
