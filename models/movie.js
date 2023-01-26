const { Schema, model } = require("mongoose");

const Movie = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    rate: {
        kp: { type: Number, required: true, default: 0 },
        imdb: { type: Number, required: true, default: 0 },
    },
    votes: {
        kp: { type: Number, required: true, default: 0 },
        imdb: { type: Number, required: true, default: 0 },
    },
    watchability: {
        items: {
            type: [
                {
                    logo: { url: { type: String, required: true } },
                    name: { type: String, required: true },
                    url: { type: String, required: true },
                },
            ],
            required: false,
        },
    },
    length: { type: Number, required: true },
    year: { type: Number, required: true },
    type: { type: String, required: true },
    poster: {
        url: { type: String },
        previewUrl: { type: String },
    },
    comments: [
        {
            required: false,
            date: { type: Date, required: true, default: Date.now() },
            user_id: { type: String, required: true },
            text: { type: String, required: true },
        },
    ],
});

module.exports = model("Movie", Movie);
