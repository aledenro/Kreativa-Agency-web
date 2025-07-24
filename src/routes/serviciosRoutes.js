const express = require("express");
const ServiciosController = require("../controllers/serviciosController");
const verificarToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/categorias", ServiciosController.getCategorias);
router.post(
    "/categorias",
    verificarToken,
    ServiciosController.agregarCategoria
);

router.get("/", ServiciosController.getServicios);
router.get("/nombres", ServiciosController.getServiciosNombres);
router.post("/agregar", verificarToken, ServiciosController.agregarServicio);
router.get("/:id", ServiciosController.getServicioById);
router.put(
    "/modificar/:id",
    verificarToken,
    ServiciosController.modificarServicioById
);
router.put(
    "/:id/nuevoPaquete",
    verificarToken,
    ServiciosController.agregarPaquete
);
router.put(
    "/:id/paquetes/:paqueteId",
    verificarToken,
    ServiciosController.modificarPaquete
);
router.put(
    "/:id/paquetes/:paqueteId/desactivar",
    verificarToken,
    ServiciosController.desactivarPaquete
);
router.put(
    "/:id/paquetes/:paqueteId/activar",
    verificarToken,
    ServiciosController.activarPaquete
);

router.put("/:id/activar", verificarToken, ServiciosController.activarServicio);
router.put(
    "/:id/desactivar",
    verificarToken,
    ServiciosController.desactivarServicio
);

module.exports = router;
