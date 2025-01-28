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
}

module.exports = new ServiciosController();
