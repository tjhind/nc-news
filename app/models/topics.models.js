const db = require("/Users/tiahhind/Northcoders/backend/be-nc-news/db/connection.js");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then((topics) => {
    return topics.rows;
  });
};
