const {
  fetchArticleById,
  fetchArticles,
  changeArticleById,
} = require("../models/articles.models.js");
const {
  checkTopicExists,
  checkColumnExists,
  checkOrderExists,
} = require("../utils.js");

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;

  const fetchArticlesQuery = fetchArticles(sort_by, order, topic);
  const queries = [fetchArticlesQuery];
  if (topic) {
    const topicExistenceQuery = checkTopicExists(topic);
    queries.push(topicExistenceQuery);
  }
  const sortByExistenceQuery = checkColumnExists(sort_by);
  queries.push(sortByExistenceQuery);

  Promise.all(queries)
    .then((response) => {
      const articles = response[0];
      res.status(200).send({ articles });
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
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
