const db = require("/Users/tiahhind/Northcoders/backend/be-nc-news/db/connection.js");

exports.fetchArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((article) => {
      if (!article.rows.length) {
        return Promise.reject({ status: 404, msg: "Article does not exist" });
      }
      return article.rows[0];
    });
};
