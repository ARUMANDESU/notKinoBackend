const User = require("../models/user");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const mailer = require("../utils/mailer/nodemailer");
const { generateAccessToken } = require("../utils/jwt");

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
            res.status(400).json({ message: "Error" });
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
            res.status(400).json({ message: "Error" });
        }
    }

    async loginUserHandler(req, res) {
        try {
            const { username, password } = req.body;
            console.log(req.body);
            const user = await User.findOne({
                username: username,
                activated: true,
            });
            if (!user) {
                return res
                    .status(400)
                    .json({ message: `Пользователь ${username} не найден` });
            }
            const validPassword = bcrypt.compareSync(
                password,
                user.hashed_password
            );
            if (!validPassword) {
                return res
                    .status(400)
                    .json({ message: "Введен неверный пароль" });
            }
            const token = generateAccessToken(user._id, user.roles);
            return res.json({ token });
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Error" });
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
            res.status(400).json({ message: "Error" });
        }
    }

    async addToFavorites(req, res) {
        try {
            const favorite = req.params.id;
            res.json(req.body);
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Error" });
        }
    }
}

module.exports = new userController();
