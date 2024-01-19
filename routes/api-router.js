const apiRouter = require("express").Router();
const { getEndpoints } = require("../app/controllers/endpoints.controllers");


const articlesRouter = require("./articles-router");
const commentsRouter = require("./comments-router");
const topicsRouter = require("./topics-router");
const usersRouter = require("./users-router");

apiRouter.use("/articles", articlesRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.get("/", getEndpoints);

module.exports = apiRouter;
