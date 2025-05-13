const express = require("express");
const ContactoController = require("../controllers/contactoController");

const router = express.Router();

router.post("/", ContactoController.nuevoFormContacto);
router.get("/", ContactoController.getAllForms);
router.get("/:id", ContactoController.getFormById);
router.put("/:id", ContactoController.desactivarRespuestaForm);

module.exports = router;
