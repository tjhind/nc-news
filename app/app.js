const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controllers");
const { getEndpoints } = require("./controllers/endpoints.controllers");

app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);

app.all("/api/*", (req, res, next) => {
  res.status(404).send({ msg: "invalid path" });
});

module.exports = app;
