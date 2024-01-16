const app = require("../app/app.js");
const request = require("supertest");
const db = require("../app/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");
const fs = require("fs/promises");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("/api/*", () => {
  test("GET 404: responds with error when given invalid endpoint", () => {
    return request(app)
      .get("/api/fjdihdkfkhudz")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid path");
      });
  });
});

describe("/api", () => {
  test("GET 200: responds with a description of all other endpoints available", () => {
    return fs.readFile("endpoints.json", "utf8").then((result) => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
          expect(response.body.endpoints).toEqual(JSON.parse(result));
        });
    });
  });
});

describe("/api/topics", () => {
  test("GET 200: responds with all topics with correct details", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topics.length).toBe(3);
        response.body.topics.forEach((topic) => {
          expect(typeof topic.description).toBe("string");
          expect(typeof topic.slug).toBe("string");
        });
      });
  });
});

describe("/api/articles", () => {
  test("GET 200: responds with an array that returns all articles, with body property removed", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles.length).toBe(13);
        response.body.articles.forEach((article) => {
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(article).not.toHaveProperty("body");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.article_img_url).toBe("string");
        });
      });
  });
  test("GET 200: responds with an array that returns all articles, sorted bu created_at in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("GET 200: responds with an array of all articles with a comment_count for each article", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        response.body.articles.forEach((article) => {
          expect(typeof article.comment_count).toBe("string");
        });
      });
  });
  test("GET 404: responds with an error when wrong endpoint is requested", () => {
    return request(app)
      .get("/api/banana")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid path");
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET 200: responds with correct article with all keys", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        expect(response.body.article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("GET 404: responds with an error when given a valid but non-existent article_id", () => {
    return request(app)
      .get("/api/articles/11111")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article does not exist");
      });
  });
  test("GET 400: responds with an error when given an invalid article_id", () => {
    return request(app)
      .get("/api/articles/dsjkfhskjhak")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("PATCH 200: responds with object representing updated article when inc votes is positive", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 100 })
      .expect(200)
      .then(({ body }) => {
        const { updated_article } = body;
        expect(updated_article).toMatchObject([
          {
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 200,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          },
        ]);
      });
  });
  test("PATCH 200: responds with object representing updated article when inc votes is negative", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -100 })
      .expect(200)
      .then(({ body }) => {
        const { updated_article } = body;
        expect(updated_article).toMatchObject([
          {
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          },
        ]);
      });
  });
  test("PATCH 200: responds with object representing updated article and ignores additional properties", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 100, tiah: "hello", snack: "apple and peanut butter" })
      .expect(200)
      .then(({ body }) => {
        const { updated_article } = body;
        expect(updated_article).toMatchObject([
          {
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 200,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          },
        ]);
      });
  });
  test("PATCH 400: responds with error when invalid inc_votes value is given for patch request", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "hello" })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("PATCH 400: responds with error when invalid object is given for patch request", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({
        username: "icellusedkars",
        body: "wow, this article is stupendous!",
      })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("No inc_votes specified");
      });
  });
  test("PATCH 400: responds with error when invalid endpoint is given for patch request", () => {
    return request(app)
      .patch("/api/articles/lol")
      .send({ inc_votes: 200 })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("PATCH 404: responds with error when valid but non-existent article_id is given for patch request", () => {
    return request(app)
      .patch("/api/articles/100000")
      .send({ inc_votes: 200 })
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article does not exist");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET 200: responds with comments whose article id is in the endpoint with correct properties, sorted by created_at in descending order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments.length).toBe(11);
        response.body.comments.forEach((comment) => {
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.author).toBe("string");
          expect(comment.article_id).toBe(1);
          expect(typeof comment.created_at).toBe("string");
        });
        expect(response.body.comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("GET 404: responds with an error when given a valid but non-existent article_id", () => {
    return request(app)
      .get("/api/articles/1111/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article does not exist");
      });
  });
  test("GET 400: responds with an error when given an invalid article_id", () => {
    return request(app)
      .get("/api/articles/jdks/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("POST 201: inserts a new comment into the db and responds with the newly created comment", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "icellusedkars",
        body: "wow, this article is stupendous!",
      })
      .expect(201)
      .then(({ body }) => {
        const { new_comment } = body;
        expect(new_comment.author).toBe("icellusedkars");
        expect(new_comment.body).toBe("wow, this article is stupendous!");
        expect(new_comment.article_id).toBe(1);
        expect(new_comment.votes).toBe(0);
        expect(typeof new_comment.created_at).toBe("string");
      });
  });
  test("POST 400: responds with an error when given an invalid username in post request body", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "tiahontoast",
        body: "I'm not a user of this site and I hate this article!",
      })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("POST 400: responds with an error when given a post request body with no body property", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "icellusedkars",
      })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("POST 400: responds with an error when given a post request body with no username property", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        hello: "hi",
      })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("POST 404: responds with error when valid but non-existent article_id is given for post request", () => {
    return request(app)
      .post("/api/articles/999999/comments")
      .send({
        username: "icellusedkars",
        body: "wow, this article is stupendous!",
      })
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article does not exist");
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test("DELETE 204: deletes the specified team and sends no body back", () => {
    return request(app).delete("/api/comments/3").expect(204);
  });
  test("DELETE 404: responds with an error when given a valid but non-existent comment_id in endpoint", () => {
    return request(app)
      .delete("/api/comments/1999999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Comment not found");
      });
  });
  test("DELETE 400: responds with an error when given an invalid comment_id in endpoint", () => {
    return request(app)
      .delete("/api/comments/tiah")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("/api/users", () => {
  test("GET 200: responds with an array of all users, with the correct properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        expect(response.body.users.length).toBe(4);
        response.body.users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});
