import { setProp } from "../../src";

describe("setProp", () => {
  it("works with a string path", async () => {
    const obj = {};
    setProp("foo.bar", true, obj);
    expect(obj).toEqual({ foo: { bar: true } });
  });

  it("works with an array path", async () => {
    const obj = {};
    setProp(["foo", "bar"], true, obj);
    expect(obj).toEqual({ foo: { bar: true } });
  });

  it("uses an existing path when available", async () => {
    const obj = { foo: { bar: false } };
    setProp(["foo", "bar"], true, obj);
    expect(obj).toEqual({ foo: { bar: true } });
  });
});
