const express = require("express");
const TareasController = require("../controllers/tareasController");

const router = express.Router();

router.post("/crear", TareasController.createTarea);

module.exports = router;
