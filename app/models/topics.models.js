const db = require("../connection.js");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then((topics) => {
    return topics.rows;
  });
};

exports.insertNewTopic = (slug, description) => {
  if (!slug || !description) {
    return Promise.reject({ status: 400, msg: "Bad request" });
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
