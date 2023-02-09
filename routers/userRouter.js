const express = require("express");
const userController = require("../controllers/userController");
const { isAuthorizedMiddleware } = require("../services/middlewares");
const errorHandler = require("../services/errors");
const router = express.Router();

router.get("/activate/", userController.activateAccountHandler);
router.get("/:username", userController.getUserHandler);

router.post("/register", userController.registerUserHandler);
router.post("/login", userController.loginUserHandler);
router.post(
    "/addMovie/:id",
    isAuthorizedMiddleware(),
    userController.addToFavorites
);

module.exports = router;
