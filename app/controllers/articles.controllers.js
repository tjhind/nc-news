const {
  fetchArticleById,
  fetchArticles,
  changeArticleById,
} = require("../models/articles.models.js");
const { checkTopicExists } = require("../utils.js");

exports.getArticles = (req, res, next) => {
  const { topic } = req.query;

  const fetchArticlesQuery = fetchArticles(topic);
  const queries = [fetchArticlesQuery];

  if (topic) {
    const topicExistenceQuery = checkTopicExists(topic);
    queries.push(topicExistenceQuery);
  }
  Promise.all(queries)
    .then((response) => {
      const articles = response[0];
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.editArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  changeArticleById(article_id, inc_votes)
    .then((updated_article) => {
      res.status(200).send({ updated_article });
    })
    .catch(next);
};
