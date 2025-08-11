const express = require("express");
const ContactoController = require("../controllers/contactoController");
const {verificarToken, verificarTokenValidoSesion} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", ContactoController.nuevoFormContacto);
router.get("/", verificarToken, verificarTokenValidoSesion, ContactoController.getAllForms);
router.get("/:id", verificarToken, verificarTokenValidoSesion, ContactoController.getFormById);
router.put("/:id", verificarToken, verificarTokenValidoSesion, ContactoController.desactivarRespuestaForm);
router.put(
	"/actualizar/:id",
	verificarToken,
	ContactoController.actualizarFormulario
);

module.exports = router;
