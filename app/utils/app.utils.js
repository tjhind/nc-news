const fs = require("fs/promises");

exports.readEndpoints = async () => {
  const endpointsInfo = await fs.readFile(
    "/Users/tiahhind/Northcoders/backend/be-nc-news/endpoints.json",
    "utf8"
  );
  return JSON.parse(endpointsInfo);
};
