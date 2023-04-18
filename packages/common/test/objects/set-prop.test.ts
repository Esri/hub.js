import { setProp } from "../../src";

describe("setProp", () => {
  it("works with a string path", () => {
    const obj = {};
    setProp("foo.bar", true, obj);
    expect(obj).toEqual({ foo: { bar: true } });
  });

  it("works with an array path", () => {
    const obj = {};
    setProp(["foo", "bar"], true, obj);
    expect(obj).toEqual({ foo: { bar: true } });
  });

  it("uses an existing path when available", () => {
    const obj = { foo: { bar: false } };
    setProp(["foo", "bar"], true, obj);
    expect(obj).toEqual({ foo: { bar: true } });
  });

  it("handles intermediary properties that are explicitly set to undefined", () => {
    const obj = { foo: undefined as any };
    setProp("foo.bar", true, obj);
    expect(obj).toEqual({ foo: { bar: true } });
  });

  it("handles replace option", () => {
    const obj = { foo: { bar: "org", extent: [], geometries: {} } } as any;
    setProp("foo", { bar: "none" }, obj, true);
    expect(obj).toEqual({ foo: { bar: "none" } });
  });
});
