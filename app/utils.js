const db = require("./connection");

exports.checkTopicExists = (topic) => {
  return db
    .query(`SELECT * FROM topics WHERE slug = $1`, [topic])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Topic does not exist" });
      }
    });
};

exports.checkColumnExists = (sort_by) => {
  return db.query(`SELECT $1 FROM articles`, [sort_by]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Invalid sort_by query" });
    }
  });
};
