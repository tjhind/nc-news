const db = require("../connection.js");

exports.fetchCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [article_id]
    )
    .then((comments) => {
      if (!comments.rows.length) {
        return Promise.reject({ status: 404, msg: "No comments found" });
      }
      return comments.rows;
    });
};

exports.insertNewComment = (article_id, username, body) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((articles) => {
      if (!articles.rows.length) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      } else {
        return db
          .query(
            `INSERT INTO comments (body, author, article_id, votes, created_at) VALUES ($1, $2, $3, DEFAULT, DEFAULT) RETURNING *`,
            [body, username, article_id]
          )
          .then((comment) => {
            return comment.rows[0];
          });
      }
    });
};
