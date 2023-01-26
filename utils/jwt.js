const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;
const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles,
    };
    console.log(secret);
    return jwt.sign(payload, secret, { expiresIn: "24h" });
};

const decodeAccessToken = (req) => {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        return null;
    }
    return jwt.verify(token, secret);
};

module.exports = { generateAccessToken, decodeAccessToken };
