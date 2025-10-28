import { propifyString } from "../../src/utils/propify-string";
import { describe, it, expect } from "vitest";

describe("propifyString", function () {
  it("turns a string into a valid JSON prop", function () {
    const stringIn = "123.@$$%&foo($@*bar23baz";
    expect(propifyString(stringIn)).toBe("foobar23baz");
  });
});
