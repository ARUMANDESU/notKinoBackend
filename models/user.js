const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const User = new Schema({
    email: { type: String, unique: true, required: true },
    username: { type: String, unique: true, required: true },
    hashed_password: { type: String, required: true },
    roles: { type: [String], default: ["user"] },
    avatar_url: { type: String, required: false },
    activated: { type: Boolean, default: false },
    activateToken: String,
    activateExpires: Date,
    favorites: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Movie",
        },
    ],
});

module.exports = model("User", User);
