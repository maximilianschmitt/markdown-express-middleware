const express = require("express");
const mdem = require("./src");

const app = express();

app.use("/", mdem("README.md", { title: "markdown-express-middleware" }));

app.listen(3333);
