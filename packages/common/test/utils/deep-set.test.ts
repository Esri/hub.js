import { deepSet } from "../../src";

describe("deepSet", function() {
  it("sets deep properties", function() {
    const foo: Record<string, any> = {};
    deepSet(foo, "bar.baz", "beep");

    expect(foo.bar.baz).toBe("beep");
  });
});
