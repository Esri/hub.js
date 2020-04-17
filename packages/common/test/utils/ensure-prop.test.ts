import { ensureProp } from "../../src";

describe("ensureProp", function() {
  it("sets deep properties", function() {
    const foo: Record<string, any> = {};
    ensureProp(foo, "bar.baz");

    expect(foo.bar.baz).toEqual({});
  });
});
