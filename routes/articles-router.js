const {
  getArticleById,
  getArticles,
  editArticleById,
} = require("../app/controllers/articles.controllers");
const {
  getCommentsByArticleId,
  postNewComment,
} = require("../app/controllers/comments.controllers");

const articlesRouter = require("express").Router();

articlesRouter.route("/").get(getArticles);

articlesRouter.route("/:article_id").get(getArticleById).patch(editArticleById);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postNewComment);

module.exports = articlesRouter;
