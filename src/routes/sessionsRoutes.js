const express = require("express")
const SessionsController = require("../controllers/sessionsController")

const router = express.Router()

router.post("/", SessionsController.addSession)
router.put("/", SessionsController.updateSessionStatus)
router.get("/:id", SessionsController.getSessionByUserId)
router.put("/token", SessionsController.updateSessionStatus)

module.exports = router