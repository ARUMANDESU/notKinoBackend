const express = require("express");
const movieController = require("../controllers/movieController");

const router = express.Router();

router.get("/:id", movieController.getMovieHandler);

router.post("/", movieController.createMovieHandler);

module.exports = router;
