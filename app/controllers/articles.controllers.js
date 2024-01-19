const {
  fetchArticleById,
  fetchArticles,
  changeArticleById,
  insertNewArticle,
} = require("../models/articles.models.js");
const { checkTopicExists } = require("../utils.js");

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic, limit, p } = req.query;

  const fetchArticlesQuery = fetchArticles(sort_by, order, topic, limit, p);
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
    .catch((error) => {
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

exports.postNewArticle = (req, res, next) => {
  const { title, topic, author, body, article_img_url } = req.body;

  insertNewArticle(title, topic, author, body, article_img_url)
    .then((newArticle) => {
      res.status(201).send({ newArticle });
    })
    .catch(next);
};
