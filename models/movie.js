const { Schema, model } = require("mongoose");
const { text } = require("express");

const Movie = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    rate: { type: Number, required: true, default: 0 },
    date: { type: Date, required: true, default: Date.now() },
    country: { type: String, required: true },
    length: { type: Number, required: true },
    actors: [
        {
            name: { type: String, required: true },
            img_url: { type: String, required: true },
            url: { type: String, required: true },
        },
    ],
    actors: [
        {
            date: { type: Date, required: true, default: Date.now() },
            user_id: { type: String, required: true },
            text: { type: String, required: true },
        },
    ],
});

module.exports = model("Movie", Movie);
