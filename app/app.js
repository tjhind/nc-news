const express = require("express");
const app = express();

app.use(express.json());

const apiRouter = require("../routes/api-router");
app.use("/api", apiRouter);

app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "Invalid path" });
});

app.use((err, req, res, next) => {
  if (err.msg && err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02" || "23503") {
    res.status(400).send({ msg: "Bad request" });
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "internal server err" });
});

module.exports = app;
