const db = require("../connection.js");

exports.fetchArticles = (sort_by = "created_at", order = "DESC", topic) => {
  let queryStr = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.article_img_url, articles.votes, COUNT(comments.comment_id) AS comment_count FROM comments RIGHT JOIN articles ON comments.article_id=articles.article_id`;

  let queryParameters = [];
  const validSortByQueries = [
    "created_at",
    "topic",
    "title",
    "author",
    "votes",
    "article_id",
  ];
  if (!validSortByQueries.includes(sort_by.toLowerCase())) {
    return Promise.reject({ status: 400, msg: "Invalid sort_by query" });
  }

  const validOrderQueries = ["asc", "desc", "ASC", "DESC"];
  if (!validOrderQueries.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  if (topic) {
    queryStr += ` WHERE UPPER(topic) = $1`;
    queryParameters.push(topic.toUpperCase());
  }
  queryStr += ` GROUP BY articles.article_id ORDER BY ${sort_by.toLowerCase()} ${order.toUpperCase()}`;
  return db.query(queryStr, queryParameters).then((articles) => {
    return articles.rows;
  });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.comment_id) AS comment_count FROM comments RIGHT JOIN articles ON comments.article_id=articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id`,
      [article_id]
    )
    .then((article) => {
      if (!article.rows.length) {
        return Promise.reject({ status: 404, msg: "Article does not exist" });
      }
      return article.rows[0];
    });
};

exports.changeArticleById = (article_id, inc_votes) => {
  return this.fetchArticleById(article_id).then(() => {
    if (inc_votes === undefined) {
      return Promise.reject({ status: 400, msg: "No inc_votes specified" });
    }
    return db
      .query(
        `UPDATE articles SET votes=votes+$1 WHERE article_id=$2 RETURNING *`,
        [inc_votes, article_id]
      )
      .then((updatedArticle) => {
        return updatedArticle.rows;
      });
  });
};
