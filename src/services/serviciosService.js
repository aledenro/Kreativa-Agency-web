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

  async getServicios() {
    try {
      return await Servicios.find();
    } catch (error) {
      throw new Error("No se pudieron obtener los servicios: " + error.message);
    }
  }

  async getServicioById(id) {
    try {
      const servicio = await Servicios.findById(id);
      if (!servicio) {
        throw new Error(`Servicio ${id} no encontrado`);
      }
      return servicio;
    } catch (error) {
      throw new Error(`No se pudo obtener el servicio ${id}: ` + error.message);
    }
  }
}

module.exports = new ServiciosService();
