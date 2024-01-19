const db = require("../connection.js");

exports.fetchAllUsers = () => {
  return db.query(`SELECT * FROM users`).then((users) => {
    return users.rows;
  });
};

exports.fetchUsername = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username.toLowerCase()])
    .then((user) => {
      if (!user.rows.length) {
        return Promise.reject({ status: 404, msg: "Username does not exist" });
      }
      return user.rows[0];
    });
};
