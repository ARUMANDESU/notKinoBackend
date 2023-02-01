const { Schema, model } = require("mongoose");

const User = new Schema({
    email: { type: String, unique: true, required: true },
    username: { type: String, unique: true, required: true },
    hashed_password: { type: String, required: true },
    roles: { type: [String], default: ["user"] },
    avatar_url: { type: String, unique: false, required: false },
    activated: { type: Boolean, default: false },
    activateToken: String,
    activateExpires: Date,
    favorites: {
        type: [
            {
                movie_id: { type: String, unique: true },
            },
        ],
    },
});

module.exports = model("User", User);
