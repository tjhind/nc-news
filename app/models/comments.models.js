const db = require("../connection.js");
const { fetchArticleById } = require("./articles.models.js");

exports.fetchCommentsByArticleId = (article_id) => {
  return fetchArticleById(article_id).then(() => {
    return db
      .query(
        `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
        [article_id]
      )
      .then((comments) => {
        return comments.rows;
      });
  });
};

exports.insertNewComment = (article_id, username, body) => {
  return fetchArticleById(article_id).then(() => {
    return db
      .query(
        `INSERT INTO comments (body, author, article_id, votes, created_at) VALUES ($1, $2, $3, DEFAULT, DEFAULT) RETURNING *`,
        [body, username, article_id]
      )
      .then((comment) => {
        return comment.rows[0];
      });
  });
};

exports.removeCommentById = (comment_id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id=$1`, [comment_id])
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      }
      return db
        .query(`DELETE FROM comments WHERE comment_id=$1 RETURNING *`, [
          comment_id,
        ])
        .then(() => {
          return "no content";
        });
    });
};
