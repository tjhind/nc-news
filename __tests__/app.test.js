const app = require("../app/app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");
const { readEndpoints } = require("../app/utils/app.utils.js");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("/api/*", () => {
  test("GET 404: responds with error when given invalid endpoint", () => {
    return request(app)
      .get("/api/fjdihdkfkhudz")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("invalid path");
      });
  });
});

describe("/api", () => {
  test("GET 200: responds with a description of all other endpoints available", () => {
    return readEndpoints().then((result) => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
          expect(response.body.endpoints).toEqual(result);
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
