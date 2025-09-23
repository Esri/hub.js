import { stringToBlob } from "../../src/resources/string-to-blob";

describe("stringToBlob", () => {
  it("returns a blob given a string", () => {
    const str = "Foo bar baz";
    try {
      const blob = stringToBlob(str);
      expect(blob).toEqual(jasmine.any(Blob), "Returned blob");
      expect(blob.size).toBeGreaterThan(0, "Returned blob not empty");
      expect(blob.type).toBe(
        "application/octet-stream",
        "defaults to octet-stream"
      );

      const customBlob = stringToBlob(str, "application/json");
      expect(customBlob.type).toBe(
        "application/json",
        "Returned blob of custom type"
      );
    } catch (ex) {
      if (typeof Blob === "undefined") {
        expect((ex as Error).message).toEqual(
          "stringToBlob is not currently supported on Node"
        );
      }
    }
  });
});
