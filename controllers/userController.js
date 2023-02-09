const User = require("../models/user");
const Movie = require("../models/movie");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const mailer = require("../utils/mailer/nodemailer");
const { generateAccessToken } = require("../utils/jwt");

class userController {
    async getUserHandler(req, res, next) {
        try {
            const user_name = req.params.username;
            await User.findOne({ username: user_name })
                .then((user) => {
                    res.json(userOutput(user));
                })
                .catch((e) => {
                    next(e);
                });
        } catch (e) {
            next(e);
        }
    }
    async registerUserHandler(req, res, next) {
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
                .catch((e) => {
                    next(e);
                });
        } catch (e) {
            next(e);
        }
    }

    async loginUserHandler(req, res, next) {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({
                username: username,
                activated: true,
            });
            if (!user) {
                throw new Error("User is not found");
            }
            const validPassword = bcrypt.compareSync(
                password,
                user.hashed_password
            );
            if (!validPassword) {
                throw new Error("Invalid password");
            }
            const token = generateAccessToken(user._id, user.roles);

            res.header("Authorization", `Bearer ${token}`);
            return res.json(userOutput(user));
        } catch (e) {
            next(e);
        }
    }

    async activateAccountHandler(req, res, next) {
        try {
            const { email, token } = req.query;

            await User.findOneAndUpdate(
                {
                    email: email,
                    activateToken: token,
                    activateExpires: { $gte: Date.now() },
                },
                {
                    $set: { activated: true },
                    $unset: [{ activateToken: 1 }, { activateExpires: 1 }],
                }
            )
                .then((response) => {
                    if (response) {
                        res.json({ successful: true });
                    } else res.json({ successful: false });
                })
                .catch((err) => console.error(err.message));
        } catch (e) {
            next(e);
        }
    }

    async addToFavorites(req, res, next) {
        try {
            const { id, roles } = req.body.user;
            const movie_id = req.params.id;
            const movie = await Movie.findOne({ _id: movie_id });
            if (!movie) {
                throw new Error("Movie is not exist!");
            }
            await User.findOneAndUpdate(
                { _id: id },
                { $push: { favorites: movie_id } }
            ).then((user) => {
                res.json({ successful: true });
            });
        } catch (e) {
            next(e);
        }
    }
}

function userOutput(user) {
    const { _id, username, email, roles, favorites } = user;
    return { _id, username, email, roles, favorites };
}

module.exports = new userController();
