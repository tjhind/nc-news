const {
  fetchCommentsByArticleId,
  insertNewComment,
  removeCommentById,
} = require("../models/comments.models.js");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postNewComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  insertNewComment(article_id, username, body)
    .then((new_comment) => {
      res.status(201).send({ new_comment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then((response) => {
      res.status(204).send({ response });
    })
    .catch(next);
};
