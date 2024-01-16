const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controllers");
const { getEndpoints } = require("./controllers/endpoints.controllers");
const {
  getArticleById,
  getArticles,
} = require("./controllers/articles.controllers");
const {
  getCommentsByArticleId,
} = require("./controllers/comments.controllers");

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.all("/api/*", (req, res, next) => {
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
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status();
});

module.exports = app;
