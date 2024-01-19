const {
  getArticleById,
  getArticles,
  editArticleById,
  postNewArticle,
} = require("../app/controllers/articles.controllers");
const {
  getCommentsByArticleId,
  postNewComment,
} = require("../app/controllers/comments.controllers");

const articlesRouter = require("express").Router();

articlesRouter.route("/").get(getArticles).post(postNewArticle);

articlesRouter.route("/:article_id").get(getArticleById).patch(editArticleById);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postNewComment);

module.exports = articlesRouter;
