const Movie = require("../models/movie");

class movieController {
    async createMovieHandler(req, res) {
        try {
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Error" });
        }
    }
    async getMovieHandler(req, res) {
        try {
            const movieID = req.params.id;
            const movie = await Movie.findOne({ id: movieID });
            res.json(JSON.stringify(movie));
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Error" });
        }
    }
}

module.exports = new movieController();
