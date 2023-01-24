const User = require("../models/user");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();
const mailer = require("../utils/mailer/nodemailer");
const { response } = require("express");
class userController {
    async getUserHandler(req, res) {
        try {
            const user_name = req.params.username;
            await User.find({ username: user_name })
                .then((user) => {
                    res.json(user);
                })
                .catch((e) => {
                    console.log(e);
                });
        } catch (e) {
            console.log(e);
        }
    }
    async registerUserHandler(req, res) {
        try {
            let user = req.body;

            bcrypt
                .hash(user.password, 11)
                .then(async (hash) => {
                    user.hashed_password = hash;
                    user.activateToken = crypto.randomUUID();
                    user.activateExpires = Date.now() + 24 * 360 * 10000;
                    await User.create(user).then((user) => {
                        console.log(user);
                        mailer.sendActivationMail(
                            user.email,
                            `${process.env.ROOT_URL}/user/activate/?email=${user.email}&token=${user.activateToken}`,
                            user
                        );
                        res.json({ successful: true });
                    });
                })
                .catch((err) => console.error(err.message));
        } catch (e) {
            console.log(e);
        }
    }
    async activateAccountHandler(req, res) {
        try {
            const { email, token } = req.query;

            await User.findOneAndUpdate(
                {
                    email: email,
                    activateToken: token,
                    activateExpires: { $gte: Date.now() },
                },
                { $set: { activated: true } }
            )
                .then((response) => {
                    if (response) {
                        res.json({ successful: true });
                    } else res.json({ successful: false });
                })
                .catch((err) => console.error(err.message));
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new userController();
