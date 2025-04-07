const express = require("express");
const ConfigController = require("../controllers/configController");

const router = express.Router();

router.get("/", ConfigController.getFormStatus);
router.put("/", ConfigController.toggleFormStatus);

module.exports = router;
