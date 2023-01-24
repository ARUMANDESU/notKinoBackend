const express = require("express");
const userRouter = require("./userRouter");
const movieRouter = require("./movieRouter");

const router = express.Router();

router.use("/user/", userRouter);
router.use("/movie/", movieRouter);
router.get("/", (req, res) => {
    res.send("Hello World!");
});

module.exports = router;
