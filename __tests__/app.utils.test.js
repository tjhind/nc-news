const { readEndpoints } = require("../app/utils/app.utils");

describe("readEndpoints()", () => {
  test("should return an object", () => {
    return readEndpoints().then((result) => {
      expect(typeof result).toBe("object");
    });
  });
});
