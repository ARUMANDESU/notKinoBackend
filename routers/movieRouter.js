const express = require("express");
const movieController = require("../controllers/movieController");
const { roleMiddleware } = require("../services/middlewares");

const router = express.Router();

router.get("/:id", movieController.getMovieHandler);
router.get("/", movieController.listMovieHandler);

router.use(roleMiddleware(["admin"])); // after this line routers below use middleware "roleMiddleware(["admin"])". Routers up to this line do not use this middleware

router.post("/kp", movieController.importFromKP);

router.use(roleMiddleware(["moderator"]));

router.post("/", movieController.createMovieHandler);
router.patch("/:id", movieController.updateMovieHandler);
router.delete("/:id", movieController.deleteMovieHandler);

module.exports = router;
