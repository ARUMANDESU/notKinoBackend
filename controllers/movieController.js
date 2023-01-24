const Movie = require("../models/movie");
const { Validator } = require("node-input-validator");
class movieController {
    async createMovieHandler(req, res) {
        try {
            const v = new Validator(req.body, {
                title: "required|string",
                description: "required|string",
                rate: "required|integer",
                country: "required|string",
                length: "required|integer",
                actors: "required|array",
                "actors.*.name": "required|string",
                "actors.*.img_url": "required|string",
                "actors.*.url": "required|string",
                comments: "array",
                "comments.*.date": "required|string",
                "comments.*.user_id": "required|string",
                "comments.*.text": "required|string",
            });

            v.check().then(async (matched) => {
                if (!matched) {
                    res.status(422).json(v.errors);
                    return;
                }

                const movie = await Movie.create(v.inputs);
                res.json(movie.toJSON());
            });
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Error" });
        }
    }
    async getMovieHandler(req, res) {
        try {
            const movie_id = req.params.id;
            const movie = await Movie.findOne({ _id: movie_id });
            res.json(movie.toJSON());
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Error" });
        }
    }

    async updateMovieHandler(req, res) {
        try {
            const movie_id = req.params.id;
            /*            const {
                title,
                length,
                rate,
                description,
                country,
                actors,
                comments,
            } = req.body;*/

            await Movie.updateOne({ _id: movie_id }, { $set: req.body })
                .then((movie) => {
                    res.json(movie);
                })
                .catch((e) => {
                    res.status(400);
                });
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Error" });
        }
    }
    async deleteMovieHandler(req, res) {
        try {
            const movie_id = req.params.id;
            await Movie.findOneAndDelete({ _id: movie_id })
                .then((movie) => {
                    res.json(movie);
                })
                .catch((e) => {
                    res.status(400);
                });
        } catch (e) {
            console.log(e);
        }
    }

    async listMovieHandler(req, res) {
        try {
            await Movie.find(req.query)
                .then((movies) => {
                    res.json(movies);
                })
                .catch((e) => {
                    console.log(e);
                    res.status(400);
                });
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new movieController();
