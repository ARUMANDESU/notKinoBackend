const { decodeAccessToken } = require("../utils/jwt");

function isAuthorizedMiddleware() {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next();
        }
        try {
            const decodedData = decodeAccessToken(req);

            if (typeof decodedData == Object) {
                res.status(403).json({ message: "User not authorized!" });
            }
            req.body.user = { id: decodedData.id, roles: decodedData.roles };
            next();
        } catch (e) {
            console.log(e);
            res.status(403).json({ message: `error: ${e}` });
        }
    };
}
function roleMiddleware(roles) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next();
        }
        try {
            const decodedData = decodeAccessToken(req);
            if (!decodedData) {
                res.status(403).json({ message: "User not authorized!" });
            }

            let hasRole =
                decodedData.roles.filter((role) => roles.includes(role))
                    .length > 0;
            if (!hasRole) {
                res.status(403).json({
                    message: "User do not have permission!",
                });
            }
            next();
        } catch (e) {
            console.log(e);
            res.status(403).json({ message: "User not authorized!" });
        }
    };
}

module.exports = { isAuthorizedMiddleware, roleMiddleware };
