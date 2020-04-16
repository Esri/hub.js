import { getProps } from "../../src";

describe("getProps", function() {
  it("gets multiple props", function() {
    const obj = {
      foo: {
        bar: "baz",
        boop: "beep"
      }
    };

    const [prop1, prop2] = getProps(obj, ["foo.bar", "foo.boop"]);
    expect(prop1).toEqual("baz");
    expect(prop2).toEqual("beep");
  });
});
