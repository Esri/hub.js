import * as Blob from "cross-blob";
import { stringToBlob } from "../../src/resources";

describe("stringToBlob", () => {
  it("returns a blob given a string", () => {
    const str = "Foo bar baz";
    const blob = stringToBlob(str);
    expect(blob).toEqual(jasmine.any(Blob), "Returned blob");
    expect(blob.size).toBeGreaterThan(0, "Returned blob not empty");
  });
});
