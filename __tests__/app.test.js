const app = require("../app/app.js");
const request = require("supertest");
const db = require("../db/connection.js");
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
  test("GET 200: responds with an array of all articles sorted by date in descending order, with body property removed", () => {
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
          expect(typeof article.body).toBe("undefined");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.article_img_url).toBe("string");
        });
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
});

describe("/api/articles/:article_id", () => {
  test("GET 200: responds with correct article with all keys", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        expect(response.body.article).toEqual({
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
  //   test("GET 404: responds with an error when given a valid but non-existent article_id", () => {
  //     return request(app)
  //       .get("/api/articles/1111/comments")
  //       .expect(400)
  //       .then((response) => {
  //         expect(response.body.msg).toBe("No comments found");
  //       });
  //   });
  //   test("GET 400: responds with an error when given an invalid article_id", () => {
  //     return request(app)
  //       .get("/api/articles/jdks/comments")
  //       .expect(400)
  //       .then((response) => {
  //         expect(response.body.msg).toBe("Bad request");
  //       });
  //   });
});
