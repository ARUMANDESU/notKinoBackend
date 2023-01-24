const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

router.get("/activate/", userController.activateAccountHandler);
router.get("/:username", userController.getUserHandler);

router.post("/", userController.registerUserHandler);

module.exports = router;
