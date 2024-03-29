const db = require("../connection.js");
const { checkTopicDoesntExist } = require("../utils.js");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then((topics) => {
    return topics.rows;
  });
};

exports.insertNewTopic = (slug, description) => {
  if (!slug || !description) {
    return Promise.reject({
      status: 400,
      msg: "Both topic and description should be provided",
    });
  }
  return db
    .query(
      `INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *`,
      [slug, description]
    )
    .then((newTopic) => {
      if (newTopic.rows === 0) {
        return Promise.reject({ status: 400, msg: "Bad request" });
      }
      return newTopic.rows;
    });
};
