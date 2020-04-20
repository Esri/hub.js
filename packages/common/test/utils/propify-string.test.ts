import { propifyString } from "../../src";

describe("propifyString", function() {
  it("turns a string into a valid JSON prop", function() {
    const stringIn = "123.@$$%&foo($@*bar23baz";
    expect(propifyString(stringIn)).toBe("foobar23baz");
  });
});
