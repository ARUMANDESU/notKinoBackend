const Movie = require("../models/movie");
const { Validator } = require("node-input-validator");
const axios = require("axios");
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

                await Movie.create(v.inputs)
                    .then((movie) => {
                        res.json(movie);
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            });
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Error" });
        }
    }
    async getMovieHandler(req, res) {
        try {
            const movie_id = req.params.id;
            await Movie.findOne({ _id: movie_id })
                .then((movie) => {
                    res.json(movie);
                })
                .catch((e) => {
                    console.log(e);
                });
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

    async importFromKP(req, res) {
        try {
            const { rate, limit } = req.query;
            const url = `https://api.kinopoisk.dev/movie/?token=${process.env.KINOPOISK_API_TOKEN}&rate=${rate}&limit=${limit}`;
            axios.get(url).then(async (response) => {
                let movies = [];
                response.data.docs.map((data) => {
                    const acceptable =
                        data.name &&
                        data.description &&
                        data.year &&
                        data.movieLength &&
                        data.votes.kp &&
                        data.votes.imdb &&
                        data.rating &&
                        data.rating.imdb &&
                        data.rating.kp &&
                        data.poster &&
                        data.poster.url &&
                        data.poster.previewUrl;

                    if (acceptable) {
                        const temp = {
                            title: data.name,
                            description: data.description,
                            rate: data.rating,
                            year: data.year,
                            length: data.movieLength,
                            votes: data.votes,
                            poster: {
                                url: data.poster.url,
                                previewUrl: data.poster.previewUrl,
                            },
                            watchability: {
                                items: data.watchability.items,
                            },
                            type: data.type,
                        };

                        movies.push(temp);
                    }
                });
                res.json(movies);
                await Movie.insertMany(movies);
            });
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new movieController();
