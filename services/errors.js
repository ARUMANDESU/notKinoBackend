const logErrors = (err, req, res, next) => {
    console.error(err.stack);
    next(err);
};

const clientErrorHandler = (err, req, res, next) => {
    if (req.xhr) {
        res.status(500).send({ error: `Something failed! ${err.message}` });
    } else {
        next(err);
    }
};
const errorHandler = (err, req, res, next) => {
    res.status(500).send({ error: err.message });
};

// const clientErrorHandler = (err, req, res, next) => {
//     console.log(err);
//     return res.status(400).json({ message: "Something went wrong" });
// };

// const serverErrorHandler = (err, req, res, next) => {
//     console.log(err);
//     return res
//         .status(500)
//         .json({ message: "We have some troubles with our server" });
// };

module.exports = { logErrors, clientErrorHandler, errorHandler };
