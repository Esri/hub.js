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

  it("removes any character not a-z or 0-9", function () {
    const input = "a92!!@__k2ø";
    expect(slugify(input)).toEqual("a92-k2");
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

  it("removes leading hyphens", () => {
    const input = "---hello world";
    expect(slugify(input)).toEqual("hello-world");
  });

  it("removes trailing hyphens", () => {
    const input = "hello world---";
    expect(slugify(input)).toEqual("hello-world");
  });

  it("removes both leading and trailing hyphens", () => {
    const input = "---hello world---";
    expect(slugify(input)).toEqual("hello-world");
  });

  it("removes underscores", () => {
    const input = "hello__world";
    expect(slugify(input)).toEqual("hello-world");
  });

  it("removes non-alphanumeric characters including underscores", () => {
    const input = "hello@#%$^&*()_world";
    expect(slugify(input)).toEqual("hello-world");
  });

  it("handles only non-alphanumeric characters", () => {
    const input = "!!!@@@###";
    expect(slugify(input)).toEqual("");
  });

  it("handles string with only underscores", () => {
    const input = "___";
    expect(slugify(input)).toEqual("");
  });

  it("handles string with leading and trailing underscores", () => {
    const input = "__hello_world__";
    expect(slugify(input)).toEqual("hello-world");
  });

  it("handles string with mixed hyphens and underscores", () => {
    const input = "--hello__world--";
    expect(slugify(input)).toEqual("hello-world");
  });

  it("handles string with spaces, hyphens, and underscores", () => {
    const input = "  --hello __ world--  ";
    expect(slugify(input)).toEqual("hello-world");
  });

  it("handles string with numbers and underscores", () => {
    const input = "123__456";
    expect(slugify(input)).toEqual("123-456");
  });

  it("handles string with special characters and underscores", () => {
    const input = "foo_bar!@#baz";
    expect(slugify(input)).toEqual("foo-bar-baz");
  });
});
