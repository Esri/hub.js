import { pickProps } from "../../src";

describe("pickProps:", () => {
  it("returns object if passed no props", () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = pickProps(obj, []);
    expect(result).toEqual(obj);
  });
  it("drops props not in list", () => {
    const obj = { a: 1, b: 2, c: 3 };
    const props = ["a", "c"];
    const result = pickProps(obj, props);
    expect(result).toEqual({ a: 1, c: 3 });
  });
});
