import { getProp } from "../../src/objects/get-prop";

describe("getProp", () => {
  it("can get a deep property", () => {
    const obj = {
      b: {
        c: {
          d: "peekaboo"
        },
        color: "orange"
      },
      size: "small"
    } as any;
    const c = getProp(obj, "b.c.d");
    expect(c).toBe("peekaboo");
  });
});
