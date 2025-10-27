import { describe, it, expect } from "vitest";
import { objectToJsonBlob } from "../../src/resources/object-to-json-blob";

describe("objectToJsonBlob", () => {
  it("returns a blob given an object", () => {
    const obj = { foo: "bar––" };

    try {
      const blob = objectToJsonBlob(obj) as unknown as Blob;
      if (typeof Blob !== "undefined") {
        expect(blob instanceof Blob).toBeTruthy();
        expect(blob.size).toBeGreaterThan(0);
        expect(blob.type).toBe("application/json");
      }
    } catch (ex) {
      if (typeof Blob === "undefined") {
        expect((ex as Error).message).toEqual(
          "objectToJsonBlob is not currently supported on Node"
        );
      }
    }
  });
});
