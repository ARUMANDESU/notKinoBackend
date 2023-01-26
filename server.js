const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const router = require("./routers/router");

const app = express();
const port = process.env.PORT || 4000;

dotenv.config();
mongoose.set("strictQuery", false);
app.use(
    cors({
        origin: process.env.FRONT_URL,
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded());
app.use(router);

mongoose
    .connect(process.env.DB_URL)
    .then((res) => console.log("Connected to DB"))
    .catch((error) => console.log(error));

app.listen(port, () => console.log(`Server listening on port ${port}!`));
