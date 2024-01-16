const {
  fetchArticleById,
  fetchArticles,
  changeArticleById,
} = require("../models/articles.models.js");

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.editArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  changeArticleById(article_id, inc_votes)
    .then((updated_article) => {
      res.status(200).send({ updated_article });
    })
    .catch((err) => {
      next(err);
    });
};
