const db = require("../connection.js");
const fs = require("fs/promises");

exports.fetchEndpoints = () => {
  return fs.readFile("endpoints.json", "utf8").then((endpointsFile) => {
    return JSON.parse(endpointsFile);
  });
};
