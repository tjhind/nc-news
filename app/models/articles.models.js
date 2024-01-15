const db = require("/Users/tiahhind/Northcoders/backend/be-nc-news/db/connection.js");

exports.fetchArticles = () => {
  return db.query(
    `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.article_img_url, articles.votes, COUNT(comments.comment_id) AS comment_count FROM comments RIGHT JOIN articles ON comments.article_id=articles.article_id GROUP BY articles.article_id ORDER BY created_at DESC`
  );
};

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
