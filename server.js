const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const router = require("./routers/router");
const userRouter = require("./routers/userRouter");
const movieRouter = require("./routers/movieRouter");

const app = express();
const port = process.env.PORT || 4000;

dotenv.config();
mongoose.set("strictQuery", false);
app.use(router);
app.use("/user/", userRouter);
app.use("/movie/", movieRouter);

mongoose
    .connect(process.env.DB_URL)
    .then((res) => console.log("Connected to DB"))
    .catch((error) => console.log(error));

app.listen(port, () => console.log(`Server listening on port ${port}!`));
