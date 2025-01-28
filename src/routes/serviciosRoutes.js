const express = require("express");
const ServiciosController = require("../controllers/serviciosController");

const router = express.Router();
router.post("/agregar", ServiciosController.agregarServicio);

module.exports = router;
