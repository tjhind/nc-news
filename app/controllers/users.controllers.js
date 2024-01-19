const { fetchAllUsers, fetchUsername } = require("../models/users.models");

exports.getAllUsers = (req, res, next) => {
  fetchAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUsername = (req, res, next) => {
  const { username } = req.params;
  fetchUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
