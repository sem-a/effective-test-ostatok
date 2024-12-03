const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", require("./routes/index"));
app.use("/api/product", require("./routes/products"));
app.use("/api/stock", require("./routes/stocks"));
app.use("/api/shop", require("./routes/shops"));

module.exports = app;
