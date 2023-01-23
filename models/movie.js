const { Schema, model } = require("mongoose");

const Movie = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    rate: { type: Number, required: true, default: 0 },
    country: { type: String, required: true },
    length: { type: Number, required: true },
    actors: [
        {
            name: { type: String, required: true },
            img_url: { type: String, required: true },
            url: { type: String, required: true },
        },
    ],
    comments: [
        {   required:false,
            date: { type: Date, required: true, default: Date.now() },
            user_id: { type: String, required: true },
            text: { type: String, required: true },
        },
    ],
});

module.exports = model("Movie", Movie);
