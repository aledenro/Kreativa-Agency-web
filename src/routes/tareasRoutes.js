const express = require("express");
const TareasController = require("../controllers/tareasController");

const router = express.Router();

router.post("/crear", TareasController.createTarea);
router.get("/id/:id", TareasController.getTareaById);

module.exports = router;
