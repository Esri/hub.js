import { ensureProp } from "../../src/objects/ensure-prop";
import { describe, it, expect } from "vitest";

describe("ensureProp", function () {
  it("sets deep properties", function () {
    const foo: Record<string, any> = {};
    ensureProp(foo, "bar.baz");

    expect(foo.bar.baz).toEqual({});
  });
});
