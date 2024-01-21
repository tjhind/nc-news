const db = require("../connection.js");
const { fetchArticleById } = require("./articles.models.js");

exports.fetchCommentsByArticleId = (article_id, limit, p) => {
  return fetchArticleById(article_id).then(() => {
    let queryStr = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`;
    let queryParams = [article_id];
    const validLimitPQueries = /^[0-9]*$/;
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
    return db.query(queryStr, queryParams).then((comments) => {
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

exports.changeCommentVotes = (comment_id, inc_votes) => {
  if (inc_votes === undefined) {
    return Promise.reject({ status: 400, msg: "No inc_votes specified" });
  }
  if (inc_votes === 0) {
    return db
      .query(`SELECT * FROM comments WHERE comment_id=$1`, [comment_id])
      .then((comment) => {
        return comment.rows[0];
      });
  } else {
    return db
      .query(
        `UPDATE comments SET votes=votes+$1 WHERE comment_id=$2 RETURNING *`,
        [inc_votes, comment_id]
      )
      .then((newComment) => {
        if (!newComment.rows.length) {
          return Promise.reject({ status: 404, msg: "Comment does not exist" });
        }
        return newComment.rows[0];
      });
  }
};
