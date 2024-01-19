const { fetchTopics, insertNewTopic } = require("../models/topics.models.js");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.postNewTopic = (req, res, next) => {
  const { slug, description } = req.body;
  insertNewTopic(slug, description)
    .then((newTopic) => {
      res.status(201).send({ newTopic });
    })
    .catch(next);
};
