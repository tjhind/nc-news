const express = require("express");
const app = express();
app.use(express.json());

// TOPICS CONTROLLERS
const { getTopics } = require("./controllers/topics.controllers");

// TOPICS REQUESTS
app.get("/api/topics", getTopics);

// ERROR HANDLING
app.all("/api/*", (req, res, next) => {
  res.status(404).send({ msg: "invalid path" });
});

module.exports = app;
