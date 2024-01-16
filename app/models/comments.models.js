const db = require("/Users/tiahhind/Northcoders/backend/be-nc-news/db/connection.js");

exports.fetchCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [article_id]
    )
    .then((comments) => {
      if (!comments.rows.length) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return comments.rows;
    });
};
