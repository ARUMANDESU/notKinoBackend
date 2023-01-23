const { Schema, model } = require("mongoose");

const User = new Schema({
    email: { type: String, unique: true, required: true },
    username: { type: String, unique: true, required: true },
    hashed_password: { type: String, required: true },
    roles: [{ type: String }],
    avatar_url: { type: String, unique: false, required: false },
});

module.exports = model("User", User);
