const express = require("express");
const ContactoController = require("../controllers/contactoController");
const verificarToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", ContactoController.nuevoFormContacto);
router.get("/", verificarToken, ContactoController.getAllForms);
router.get("/:id", verificarToken, ContactoController.getFormById);
router.put("/:id", verificarToken, ContactoController.desactivarRespuestaForm);
router.put(
	"/actualizar/:id",
	verificarToken,
	ContactoController.actualizarFormulario
);

module.exports = router;
