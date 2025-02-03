const ProyectoController = require("../controllers/proyectoController");
const express = require("express");

const router = express.Router();

router.post("/crear", ProyectoController.createProyecto);

module.exports = router;
