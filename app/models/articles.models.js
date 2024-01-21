const db = require("../connection.js");

exports.fetchArticles = (
  sort_by = "created_at",
  order = "DESC",
  topic,
  limit,
  p
) => {
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

  const validLimitPQueries = /^[0-9]*$/;

  if (topic) {
    queryStr += ` WHERE UPPER(topic) = $1`;
    queryParameters.push(topic.toUpperCase());
  }
  queryStr += ` GROUP BY articles.article_id ORDER BY ${sort_by.toLowerCase()} ${order.toUpperCase()}`;

  if (limit && !p) {
    if (!limit.match(validLimitPQueries)) {
      return Promise.reject({ status: 400, msg: "Invalid limit query" });
    }
    queryStr += ` LIMIT ${limit}`;
  }
  if (limit && p) {
    if (!p.match(validLimitPQueries) || !limit.match(validLimitPQueries)) {
      return Promise.reject({
        status: 400,
        msg: "Invalid page or limit query",
      });
    }
    queryStr += ` LIMIT ${limit} OFFSET ${limit * p}`;
  }
  if (!limit && p) {
    if (!p.match(validLimitPQueries)) {
      return Promise.reject({ status: 400, msg: "Invalid page query" });
    }
    queryStr += ` LIMIT 10 OFFSET ${10 * p}`;
  }
  return db.query(queryStr, queryParameters).then((articles) => {
    return articles.rows;
  });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(articles.article_id) AS total_count, COUNT(comments.comment_id) AS comment_count FROM comments LEFT JOIN articles ON comments.article_id=articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id`,
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

exports.insertNewArticle = (
  title,
  topic,
  author,
  body,
  article_img_url = "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
) => {
  return db
    .query(
      `INSERT INTO articles (title, topic, author, body, article_img_url, votes, created_at) VALUES ($1, $2, $3, $4, $5, DEFAULT, DEFAULT) RETURNING *`,
      [title, topic, author, body, article_img_url]
    )
    .then((newArticle) => {
      return { ...newArticle.rows[0], comment_count: 0 };
    });
};

exports.removeArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1`, [article_id])
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return db
        .query(`DELETE FROM comments WHERE article_id = $1`, [article_id])
        .then(() => {
          return db
            .query(`DELETE FROM articles WHERE article_id = $1`, [article_id])
            .then((result) => {
              return result;
            });
        });
    });
};
