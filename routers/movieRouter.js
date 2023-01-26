const express = require("express");
const movieController = require("../controllers/movieController");

const router = express.Router();

router.get("/:id", movieController.getMovieHandler);
router.get("/", movieController.listMovieHandler);

router.post("/", movieController.createMovieHandler);
router.post("/kp", movieController.importFromKP);

router.patch("/:id", movieController.updateMovieHandler);

router.delete("/:id", movieController.deleteMovieHandler);

module.exports = router;
