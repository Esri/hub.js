import { _checkStatusAndParseJson } from "../../src/domains";

describe("_checkStatusAndParseJson", function() {
  it("resolves with JSON when success", async function() {
    const res = {
      status: 200,
      json: () => {
        const foo = 1;
      }
    } as Response;
    spyOn(res, "json").and.returnValue(
      Promise.resolve({ message: "my json response" })
    );

    try {
      const result = await _checkStatusAndParseJson(res);
      expect(result.message).toBe("my json response");
    } catch (err) {
      fail("shouldnt reject");
    }
  });

  it("rejects with error when fail", async function() {
    const res = {
      status: 404,
      json: () => {
        const foo = 1;
      }
    } as Response;
    const jsonSpy = spyOn(res, "json").and.returnValue(
      Promise.resolve({
        error: {
          title: "title",
          detail: "an error"
        }
      })
    );

    try {
      await _checkStatusAndParseJson(res);
      fail("should reject");
    } catch (err) {
      expect(err.message).toBe("title :: an error :: 404");
    }

    const resWithoutError = {
      status: 404,
      json: () => {
        const foo = 1;
      }
    } as Response;
    jsonSpy.and.returnValue(Promise.resolve({}));

    try {
      await _checkStatusAndParseJson(resWithoutError);
      fail("should reject");
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});
