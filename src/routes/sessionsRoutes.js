const express = require("express");
const router = express.Router();
const SessionsController = require("../controllers/sessionsController");

router.post("/", SessionsController.addSession);
router.put("/", SessionsController.updateSessionStatus);
router.get("/:id", SessionsController.getSessionByUserId);
router.get("/active/:id", SessionsController.getActiveSession);
router.put("/token", SessionsController.updateSessionStatusToken);
router.post("/validate-token", SessionsController.validateToken);
router.post("/logout", SessionsController.closeCurrentSession);

module.exports = router;
