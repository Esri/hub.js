import { objectToJsonBlob } from "../../src/resources";

describe("objectToJsonBlob", () => {
  it("returns a blob given a string", () => {
    const obj = {
      foo: "bar––"
    };

    try {
      const blob = objectToJsonBlob(obj);
      expect(blob).toEqual(jasmine.any(Blob), "Returned blob");
      expect(blob.size).toBeGreaterThan(0, "Returned blob not empty");
      expect(blob.type).toBe("application/json", "blob of type JSON");
    } catch (ex) {
      if (typeof Blob === "undefined") {
        expect(ex.message).toEqual(
          "objectToJsonBlob is not currently supported on Node"
        );
      }
    }
  });
});
