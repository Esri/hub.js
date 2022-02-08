import { slugify } from "../../src";

describe("slugify", function () {
  it("makes characters lowercase", function () {
    const input = "ABCDEFG";
    expect(slugify(input)).toEqual("abcdefg");
  });

  it("trims extra spaces", function () {
    const input = "  mystring   ";
    expect(slugify(input)).toEqual("mystring");
  });

  it("removes any character not a-z, 0-9, or _", function () {
    const input = "a92!!@__k2ø";
    expect(slugify(input)).toEqual("a92__k2");
  });

  it("dasherizes input string", function () {
    const input = "javascript is really cool";
    expect(slugify(input)).toEqual("javascript-is-really-cool");
  });

  it("does it all at once", function () {
    const input = "   javascript is really COOL!!";
    expect(slugify(input)).toEqual("javascript-is-really-cool");
  });

  it("returns unaltered value when non-string", function () {
    const input = { foo: "bar" };
    expect(slugify(input).foo).toEqual("bar");
  });

  it("works", () => {
    const input = "E2E Test Project";
    expect(slugify(input)).toEqual("e2e-test-project");
  });
});
