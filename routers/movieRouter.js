const express = require("express");
const movieController = require("../controllers/movieController");

const router = express.Router();

router.get("/:id", movieController.getMovieHandler);

module.exports = router;
