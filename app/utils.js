const db = require("./connection");

exports.checkTopicExists = (topic) => {
  if (topic.length) {
    return db
      .query(`SELECT * FROM topics WHERE slug = $1`, [topic])
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ status: 404, msg: "Topic does not exist" });
        }
      });
  }
};
