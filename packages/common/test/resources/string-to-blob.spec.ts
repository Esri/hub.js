import { describe, it, expect } from "vitest";
import { stringToBlob } from "../../src/resources/string-to-blob";

describe("stringToBlob", () => {
  it("returns a blob given a string", () => {
    const str = "Foo bar baz";
    try {
      const blob = stringToBlob(str) as unknown as Blob;
      if (typeof Blob !== "undefined") {
        expect(blob instanceof Blob).toBeTruthy();
        expect(blob.size).toBeGreaterThan(0);
        expect(blob.type).toBe("application/octet-stream");

        const customBlob = stringToBlob(
          str,
          "application/json"
        ) as unknown as Blob;
        expect(customBlob.type).toBe("application/json");
      }
    } catch (ex) {
      if (typeof Blob === "undefined") {
        expect((ex as Error).message).toEqual(
          "stringToBlob is not currently supported on Node"
        );
      }
    }
  });
});
