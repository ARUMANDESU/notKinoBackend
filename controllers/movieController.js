const Movie = require("../models/movie");
const { Validator } = require("node-input-validator");
class movieController {
    async createMovieHandler(req, res) {
        try {
            const v = new Validator(req.body, {
                'title': "required|string",
                'description': "required|string",
                'rate': "required|integer",
                'country': "required|string",
                'length': "required|integer",
                'actors': "required|array",
                "actors.*.name": "required|string",
                "actors.*.img_url": "required|string",
                "actors.*.url": "required|string",
                'comments': "array",
                "comments.*.date": "required|string",
                "comments.*.user_id": "required|string",
                "comments.*.text": "required|string",
            });

            v.check().then( async (matched) => {
                if (!matched) {
                    res.status(422).json(v.errors);
                    return;
                }


                const movie = await Movie.create(v.inputs)
                res.json(movie.toJSON());
            });
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Error" });
        }
    }
    async getMovieHandler(req, res) {
        try {
            const movieID = req.params.id;
            const movie = await Movie.findOne({ _id: movieID });
            res.json(movie.toJSON());
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Error" });
        }
    }
}

module.exports = new movieController();
