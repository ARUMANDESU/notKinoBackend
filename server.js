const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express();
const router = require("./routes/router");
const port = process.env.PORT || 4000;

dotenv.config();
mongoose.set("strictQuery", false);
app.use(router);

mongoose
  .connect(process.env.DB_URL)
  .then((res) => console.log("Connected to DB"))
  .catch((error) => console.log(error));

app.listen(port, () => console.log(`Server listening on port ${port}!`));
