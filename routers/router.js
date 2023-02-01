const express = require("express");
const userRouter = require("./userRouter");
const movieRouter = require("./movieRouter");

const router = express.Router();

router.use("/movie/", movieRouter);
router.use("/user/", userRouter);

router.get("/", (req, res) => {
    res.send("Hello World!");
});

module.exports = router;
