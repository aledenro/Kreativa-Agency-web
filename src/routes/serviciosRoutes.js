const express = require("express");
const ServiciosController = require("../controllers/serviciosController");

const router = express.Router();
router.post("/agregar", ServiciosController.agregarServicio);
router.get("/", ServiciosController.getServicios);
router.get("/:id", ServiciosController.getServicioById);
router.put("/modificar/:id", ServiciosController.modificarServicioById);
router.put("/:id/nuevoPaquete", ServiciosController.agregarPaquete);
router.put("/:id/desactivar", ServiciosController.desactivarServicio);
router.put("/:id/activar", ServiciosController.activarServicio);

module.exports = router;
