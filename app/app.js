const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controllers");
const { getEndpoints } = require("./controllers/endpoints.controllers");
const {
  getArticleById,
  getArticles,
  editArticleById,
} = require("./controllers/articles.controllers");
const {
  getCommentsByArticleId,
  postNewComment,
} = require("./controllers/comments.controllers");
app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", editArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postNewComment);

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
