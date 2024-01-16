const { fetchCommentsByArticleId } = require("../models/comments.models.js");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
