const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const router = require("./routers/router");

const app = express();
app.use(
    cors({
        origin: [
            "*",
            "https://not-kino-frontend.vercel.app",
            "https://not-kino-frontend-arumandesu.vercel.app",
            "https://not-kino-frontend-git-master-arumandesu.vercel.app",
            process.env.FRONT_URL,
        ],
        credentials: true,
    })
);
const port = process.env.PORT || 4000;

dotenv.config();
mongoose.set("strictQuery", false);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());
app.use(express.urlencoded());
app.use(router);

mongoose
    .connect(process.env.DB_URL)
    .then((res) => console.log("Connected to DB"))
    .catch((error) => console.log(error));
app.listen(port, () => console.log(`Server listening on port ${port}!`));
