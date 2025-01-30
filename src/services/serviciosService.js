const Servicios = require("../models/serviciosModel");

class ServiciosService {
  async agregarServicio(data) {
    try {
      const servicio = new Servicios(data);

      return await servicio.save();
    } catch (error) {
      throw new Error("No se pudo agregar el servicio: " + error.message);
    }
  }
}

module.exports = new ServiciosService();
